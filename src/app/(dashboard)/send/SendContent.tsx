"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { getAllUsers } from "@/services/user.service";
import { getTemplates } from "@/services/template.service";
import { getVideoTemplates, sendBulkVideo } from "@/services/video.service";
import { sendBulkImage } from "@/services/whatsapp.service";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getIntegrations } from "@/services/integration.service";
import { toast } from "sonner";

interface User {
  _id: string;
  name: string;
  phone: string;
  role: string;
  company: string;
  logo: string;
}

interface Template {
  _id: string;
  name: string;
  image: string;
}

export default function SendContent() {
  const searchParams = useSearchParams();
  const templateId = searchParams.get("template") ?? "";
  const videoTemplateId = searchParams.get("videoTemplate") ?? "";

  const [users, setUsers] = useState<User[]>([]);
  const [template, setTemplate] = useState<Template | null>(null);
  const [videoTemplate, setVideoTemplate] = useState<any>(null);
  const [sending, setSending] = useState(false);
  const [sentPct, setSentPct] = useState(0);
  const [message, setMessage] = useState("");
  const [platform, setPlatform] = useState("wati");
  const [integrations, setIntegrations] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);

  const router = useRouter();
  useEffect(() => {
    fetchAll();
  }, [templateId, videoTemplateId]);

  useEffect(() => {
    getIntegrations().then((res) => {
      const list = res.data || [];
      setIntegrations(list.filter((i: any) => i.status === "connected"));
    });
  }, []);

  const fetchAll = async () => {
    try {
      const [userRes, imageRes, videoRes] = await Promise.all([
        getAllUsers(),
        getTemplates(),
        getVideoTemplates(),
      ]);

      setUsers(userRes.data || []);

      // 🎥 VIDEO
      if (videoTemplateId) {
        const videoList = Array.isArray(videoRes)
          ? videoRes
          : videoRes?.data || [];

        const vid = videoList.find(
          (v: any) => String(v._id || v.id) === String(videoTemplateId),
        );

        console.log("videoList", videoList);
        console.log("videoTemplateId", videoTemplateId);
        console.log("matched video", vid);

        if (vid) {
          setVideoTemplate({
            _id: vid._id || vid.id,
            name: vid.name,
            video: vid.previewUrl,
          });
        }
      }

      // 🖼 IMAGE
      if (templateId) {
        const tmpl = imageRes.data.find(
          (t: any) => String(t.id) === String(templateId),
        );
        setTemplate(tmpl);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSend = () => {
    if (!templateId && !videoTemplateId) {
      toast.error("No template selected");
      return;
    }

    setShowConfirm(true); // open modal
  };

  const confirmSend = async () => {
    setShowConfirm(false);
    setSending(true);
    setSentPct(0);
    setMessage("");

    let p = 0;
    const iv = setInterval(() => {
      p = Math.min(p + 34, 100);
      setSentPct(p);
      if (p >= 100) clearInterval(iv);
    }, 700);

    try {
      let res;

      if (videoTemplateId) {
        res = await sendBulkVideo({
          templateId: videoTemplateId,
          platform,
        });
      } else {
        res = await sendBulkImage({
          templateId,
          platform,
        });
      }

      if (res.success) {
        setMessage(`Delivered successfully to all ${users.length} recipients.`);
      } else {
        setMessage("Failed: " + (res.message || "Something went wrong"));
      }
    } catch (err: any) {
      const msg =
        err.response?.data?.message || err.message || "Failed to send.";
      setMessage("Failed: " + msg);
      toast.error(msg);
    } finally {
      setSending(false);
    }
  };

  const isConnected = integrations.length > 0;
  const isSent = message.startsWith("Delivered");

  return (
    <div className="bg-[#F4F5F7] min-h-screen font-sora">
      {/* HEADER  */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-sm">
          {/* CLICKABLE */}
          <Link
            href={videoTemplateId ? "/video-template" : "/image-template"}
            className="text-gray-400 hover:text-gray-700"
          >
            {videoTemplateId ? "Video Templates" : "Image Templates"}
          </Link>
          <span className="text-gray-300">›</span>
          <span className="text-gray-900 font-semibold">
            {template?.name || "Send Campaign"}
          </span>
        </div>

        {/* 🔥 Dynamic badge */}
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full ${
            isConnected
              ? "bg-green-50 border border-green-200 text-green-700"
              : "bg-yellow-50 border border-yellow-200 text-yellow-700"
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current inline-block" />
          {isConnected ? "Ready to send" : "Setup required"}
        </div>
      </div>

      {/* ✅ PLATFORM CONFIG CARD */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-800 mb-3">
          Platform Configuration
        </h3>

        {/* 🔴 No Integration Connected */}
        {integrations.length === 0 ? (
          <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
            <div>
              <p className="text-sm font-medium text-gray-800">
                No platform connected
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Please connect an integration to send messages
              </p>
            </div>

            <button
              onClick={() => router.push("/integrations")}
              className="bg-black text-white px-4 py-2 rounded-md text-sm hover:opacity-90"
            >
              Connect Now
            </button>
          </div>
        ) : (
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2.5 rounded-lg text-sm"
          >
            {integrations.map((i: any) => (
              <option key={i.slug} value={i.slug}>
                {i.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="flex">
          {/* LEFT — full image, object-contain, no crop */}
          <div className="w-[48%] flex-shrink-0 border-r border-gray-100 bg-gray-50 flex items-center justify-center min-h-[420px]">
            {/* VIDEO */}
            {videoTemplateId ? (
              videoTemplate?.video ? (
                // <video
                //   src={`${videoTemplate.video}`}
                //   className="w-full h-full object-contain"
                //   controls
                //   autoPlay
                //   loop
                //   muted
                // />
                <iframe
                  src={videoTemplate.video}
                  className="w-full h-full rounded-xl"
                  allow="autoplay"
                  allowFullScreen
                />
              ) : (
                <p className="text-gray-400">No video preview</p>
              )
            ) : /* IMAGE */
            template?.image ? (
              <img
                src={`${template.image}`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
                alt="Template"
              />
            ) : (
              <p className="text-gray-400">No preview available</p>
            )}
          </div>

          {/* RIGHT — controls */}
          <div className="flex-1 p-9 flex flex-col gap-6 justify-center">
            <div>
              <p className="text-[10px] font-bold tracking-[0.13em] uppercase text-gray-400">
                Broadcast campaign
              </p>
              <h2 className="text-[22px] font-bold text-gray-900 tracking-tight leading-snug mt-1">
                Send to all
                <br />
                recipients now
              </h2>
              <p className="text-sm text-gray-500 mt-2 leading-relaxed font-normal">
                This template will be delivered instantly to every contact via
                WhatsApp.
              </p>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-2.5">
              {[
                {
                  num: isSent ? "100%" : sending ? `${sentPct}%` : "0%",
                  label: "Sent",
                },
                { num: users.length, label: "Recipients" },
                { num: 1, label: "Template" },
              ].map(({ num, label }) => (
                <div
                  key={label}
                  className="bg-gray-50 border border-gray-100 rounded-xl p-3.5"
                >
                  <p className="text-2xl font-bold text-gray-900 tracking-tighter leading-none">
                    {num}
                  </p>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mt-1.5">
                    {label}
                  </p>
                </div>
              ))}
            </div>

            <hr className="border-gray-100" />

            {/* Warning */}
            <div className="flex gap-2.5 items-start bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
              <svg
                className="w-4 h-4 flex-shrink-0 mt-0.5"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M8 2L1.5 13.5h13L8 2z"
                  stroke="#D97706"
                  strokeWidth="1.3"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 6.5v3"
                  stroke="#D97706"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                />
                <circle cx="8" cy="11.2" r="0.75" fill="#D97706" />
              </svg>
              <p className="text-xs text-amber-800 leading-relaxed">
                Sending is immediate and cannot be undone. All {users.length}{" "}
                users will receive this message right away.
              </p>
            </div>

            {/* CTA */}
            <button
              onClick={handleSend}
              disabled={sending}
              className={`w-full py-4 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all tracking-wide ${
                isSent
                  ? "bg-emerald-600"
                  : sending
                    ? "bg-gray-200 cursor-not-allowed text-gray-400"
                    : "bg-[#0F172A] hover:bg-[#1E293B] active:scale-[0.99]"
              }`}
            >
              {isSent ? (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M2.5 8l4 4 7-7"
                      stroke="white"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Campaign Sent
                </>
              ) : sending ? (
                "Sending…"
              ) : (
                <>
                  Send Campaign to {users.length} Users
                  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M3 8h10M9 4l4 4-4 4"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </>
              )}
            </button>

            {message && !isSent && (
              <p className="text-center text-xs text-red-500">{message}</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-7 py-4 flex items-center justify-between">
          {[
            {
              icon: (
                <svg
                  className="w-4 h-4 text-gray-400"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <rect
                    x="2"
                    y="2.5"
                    width="12"
                    height="11"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1.1"
                  />
                  <path
                    d="M2 6.5h12M5.5 2.5V4.5M10.5 2.5V4.5"
                    stroke="currentColor"
                    strokeWidth="1.1"
                    strokeLinecap="round"
                  />
                </svg>
              ),
              label: "Delivery",
              sub: "Immediate on confirm",
            },
            {
              icon: (
                <svg
                  className="w-4 h-4 text-gray-400"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <circle
                    cx="8"
                    cy="8"
                    r="5.5"
                    stroke="currentColor"
                    strokeWidth="1.1"
                  />
                  <path
                    d="M8 5.5V8l1.5 1.5"
                    stroke="currentColor"
                    strokeWidth="1.1"
                    strokeLinecap="round"
                  />
                </svg>
              ),
              label: "Avg delivery",
              sub: "Under 30 seconds",
            },
          ].map(({ icon, label, sub }) => (
            <div key={label} className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
                {icon}
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-700">{label}</p>
                <p className="text-[11px] text-gray-400">{sub}</p>
              </div>
            </div>
          ))}

          <div className="inline-flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-full px-3 py-1.5 text-xs font-semibold text-green-700">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
            WhatsApp ready
          </div>
        </div>

        {isSent && (
          <p className="text-center text-xs text-emerald-600 font-medium pb-4">
            {message}
          </p>
        )}
      </div>
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            {/* Header */}
            <h2 className="text-lg font-semibold text-gray-900">
              Confirm Campaign
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              This action cannot be undone
            </p>

            {/* Info */}
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Recipients</span>
                <span className="font-medium">{users.length}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Platform</span>
                <span className="font-medium capitalize">{platform}</span>
              </div>

              {/* <div className="flex justify-between">
          <span className="text-gray-500">Template</span>
          <span className="font-medium">
            {template?.name || videoTemplate?.name || "N/A"}
          </span>
        </div> */}
            </div>

            {/* Warning */}
            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
              Messages will be sent immediately to all users.
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={confirmSend}
                className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800"
              >
                Send Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
