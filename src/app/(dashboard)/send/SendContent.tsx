"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { getAllUsers } from "@/services/user.service";
import { getTemplates, previewImage } from "@/services/template.service";
import {
  getVideoTemplates,
  sendBulkVideo,
  previewVideo,
} from "@/services/video.service";
import { sendBulkImage } from "@/services/whatsapp.service";
import Link from "next/link";
import { useCallback, useEffect, useState, useRef } from "react";
import { getIntegrationStatus } from "@/services/integration.service";
import { toast } from "sonner";
import Image from "next/image";

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
interface VideoTemplate {
  _id: string;
  name: string;
  video: string;
}

interface Integration {
  slug: string;
  name: string;
  status: string;
}

interface RawVideoTemplate {
  _id?: string;
  id?: string;
  name: string;
  previewUrl: string;
}

export default function SendContent() {
  const searchParams = useSearchParams();
  const templateId = searchParams.get("template") ?? "";
  const videoTemplateId = searchParams.get("videoTemplate") ?? "";

  const [users, setUsers] = useState<User[]>([]);
  const [template, setTemplate] = useState<Template | null>(null);
  const [videoTemplate, setVideoTemplate] = useState<VideoTemplate | null>(
    null,
  );
  const [sending, setSending] = useState(false);
  const [sentPct, setSentPct] = useState(0);
  const [message, setMessage] = useState("");
  const [platform, setPlatform] = useState("wati");
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewLoading, setPreviewLoading] = useState(false);

  // Add state
  const [bgColor, setBgColor] = useState("#E5C840");
  const [textColor, setTextColor] = useState("#1A1000");

  // Track if this is the initial load so we don't double-fetch preview
  const isInitialLoad = useRef(true);
  // Debounce timer ref
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const router = useRouter();

  // ─── ONE-TIME: fetch users, templates, integrations, and initial preview ───
  useEffect(() => {
    const init = async () => {
      try {
        const [userRes, imageRes, videoRes, integrationRes] = await Promise.all(
          [
            getAllUsers(),
            getTemplates(),
            getVideoTemplates(),
            getIntegrationStatus(),
          ],
        );

        setUsers(userRes.data || []);

        const list: Integration[] = integrationRes.data || [];
        setIntegrations(list.filter((i) => i.status === "connected"));

        // 🎥 VIDEO template
        if (videoTemplateId) {
          const videoList = Array.isArray(videoRes)
            ? videoRes
            : videoRes?.data || [];
          const vid = videoList.find(
            (v: RawVideoTemplate) =>
              String(v._id || v.id) === String(videoTemplateId),
          );
          if (vid) {
            setVideoTemplate({
              _id: vid._id || vid.id,
              name: vid.name,
              video: vid.previewUrl,
            });
          }

          // Initial preview with default colors
          setPreviewLoading(true);
          const preview = await previewVideo({
            templateId: videoTemplateId,
            bgColor,
            textColor,
          });
          if (preview.success) setPreviewUrl(preview.url);
          setPreviewLoading(false);
        }

        // 🖼 IMAGE template
        if (templateId) {
          const tmpl = imageRes.data.find(
            (t: Template & { id?: string }) =>
              String(t.id || t._id) === String(templateId),
          );
          setTemplate(tmpl);

          setPreviewLoading(true);
          const preview = await previewImage({
            templateId,
            bgColor,
            textColor,
          });
          if (preview.success) setPreviewUrl(preview.publicUrl || preview.url);
          setPreviewLoading(false);
        }
      } catch (err) {
        console.error(err);
        setPreviewLoading(false);
      }

      isInitialLoad.current = false;
    };

    void init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // ← runs ONCE on mount only

  // ─── DEBOUNCED: re-fetch preview whenever colors change (video only) ───────
  const refreshPreview = useCallback(
    async (bg: string, text: string) => {
      if (!videoTemplateId && !templateId) return; 
      setPreviewLoading(true);
      try {
        // VIDEO
        if (videoTemplateId) {
          const preview = await previewVideo({
            templateId: videoTemplateId,
            bgColor: bg,
            textColor: text,
          });

          if (preview.success) {
            setPreviewUrl(preview.url);
          }
        }

        // IMAGE
        if (templateId) {
          const preview = await previewImage({
            templateId,
            bgColor: bg,
            textColor: text,
          });

          if (preview.success) {
            setPreviewUrl(preview.publicUrl || preview.url);
          }
        }
      } catch (err) {
        console.error("Preview refresh failed:", err);
      } finally {
        setPreviewLoading(false);
      }
    },
    [videoTemplateId, templateId],
  );

  // Watch bgColor
  useEffect(() => {
    if (isInitialLoad.current) return; // skip — initial preview already fired
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      void refreshPreview(bgColor, textColor);
    }, 600); // 600 ms debounce — feels instant, avoids hammering API
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [bgColor, textColor, refreshPreview]);

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
          bgColor, // ← add
          textColor, // ← add
        });
      } else {
        res = await sendBulkImage({
          templateId,
          platform,
          bgColor,
          textColor,
        });
      }

      if (res.success) {
        setMessage(`Delivered successfully to all ${users.length} recipients.`);
      } else {
        setMessage("Failed: " + (res.message || "Something went wrong"));
      }
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message ||
        (err as { message?: string }).message ||
        "Failed to send.";
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
            {integrations.map((i) => (
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
          {/* LEFT — preview */}
          <div className="w-[48%] flex-shrink-0 border-r border-gray-100 bg-black flex items-center justify-center min-h-[420px] overflow-hidden relative">
            {/* Loading overlay — shown while regenerating preview */}
            {previewLoading && (
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-10 gap-3">
                <svg
                  className="animate-spin w-8 h-8 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="3"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                <p className="text-white text-xs font-medium tracking-wide">
                  Generating preview…
                </p>
              </div>
            )}

            {videoTemplateId ? (
              previewUrl ? (
                <video
                  key={previewUrl}
                  src={previewUrl}
                  className="max-h-[820px] w-auto object-contain"
                  controls
                  autoPlay
                  loop
                  muted
                  playsInline
                  crossOrigin="anonymous"
                />
              ) : !previewLoading ? (
                <p className="text-gray-400">Loading video preview...</p>
              ) : null
            ) : previewUrl ? (
              <Image
                src={previewUrl}
                alt="Preview"
                width={800}
                height={1200}
                className="h-full max-h-[720px] w-auto object-contain"
              />
            ) : !previewLoading ? (
              <p className="text-gray-400">Loading image preview...</p>
            ) : null}
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

            {/* Color Customization — only shown for video templates */}
            {/* {videoTemplateId && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5 block">
                    Background Color
                  </label>
                  <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                    />
                    <span className="text-xs text-gray-500 font-mono">
                      {bgColor}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5 block">
                    Text Color
                  </label>
                  <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2">
                    <input
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                    />
                    <span className="text-xs text-gray-500 font-mono">
                      {textColor}
                    </span>
                  </div>
                </div>
                <p className="col-span-2 text-[10px] text-gray-400 -mt-1">
                  Preview updates automatically after you stop picking.
                </p>
              </div>
            )} */}

            {/* Color Customization — only shown for video templates */}
            {(videoTemplateId || templateId) && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  {/* Background Color */}
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5 block">
                      Background Color
                    </label>
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 space-y-2.5">
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          "#E5C840",
                          "#F4F5F7",
                          "#0F172A",
                          "#1E3A5F",
                          "#14532D",
                          "#7C3AED",
                          "#DC2626",
                          "#EA580C",
                          "#ffffff",
                          "#111111",
                        ].map((c) => (
                          <button
                            key={c}
                            type="button"
                            title={c}
                            onClick={() => setBgColor(c)}
                            style={{ background: c }}
                            className={`w-7 h-7 rounded-md flex-shrink-0 transition-transform duration-100 border-2 hover:scale-110 ${
                              bgColor === c
                                ? "border-gray-900 scale-110"
                                : c === "#ffffff"
                                  ? "border-gray-300"
                                  : "border-transparent"
                            }`}
                          />
                        ))}
                      </div>
                      <div className="border-t border-gray-200 pt-2.5 flex items-center gap-2">
                        <label
                          className="w-6 h-6 rounded-full border border-gray-300 cursor-pointer flex-shrink-0 overflow-hidden relative"
                          style={{ background: bgColor }}
                        >
                          <input
                            type="color"
                            value={bgColor}
                            onChange={(e) => setBgColor(e.target.value)}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                          />
                        </label>
                        <span className="text-[11px] text-gray-400">
                          Custom
                        </span>
                        <input
                          type="text"
                          value={bgColor}
                          maxLength={7}
                          onChange={(e) => {
                            const v = e.target.value;
                            if (/^#[0-9a-fA-F]{6}$/.test(v)) setBgColor(v);
                          }}
                          className="flex-1 text-xs font-mono px-2 py-1 border border-gray-200 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Text Color */}
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5 block">
                      Text Color
                    </label>
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 space-y-2.5">
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          "#1A1000",
                          "#0F172A",
                          "#ffffff",
                          "#F9FAFB",
                          "#FBBF24",
                          "#6EE7B7",
                          "#93C5FD",
                          "#FCA5A5",
                          "#111827",
                          "#374151",
                        ].map((c) => (
                          <button
                            key={c}
                            type="button"
                            title={c}
                            onClick={() => setTextColor(c)}
                            style={{ background: c }}
                            className={`w-7 h-7 rounded-md flex-shrink-0 transition-transform duration-100 border-2 hover:scale-110 ${
                              textColor === c
                                ? "border-gray-900 scale-110"
                                : c === "#ffffff"
                                  ? "border-gray-300"
                                  : "border-transparent"
                            }`}
                          />
                        ))}
                      </div>
                      <div className="border-t border-gray-200 pt-2.5 flex items-center gap-2">
                        <label
                          className="w-6 h-6 rounded-full border border-gray-300 cursor-pointer flex-shrink-0 overflow-hidden relative"
                          style={{ background: textColor }}
                        >
                          <input
                            type="color"
                            value={textColor}
                            onChange={(e) => setTextColor(e.target.value)}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                          />
                        </label>
                        <span className="text-[11px] text-gray-400">
                          Custom
                        </span>
                        <input
                          type="text"
                          value={textColor}
                          maxLength={7}
                          onChange={(e) => {
                            const v = e.target.value;
                            if (/^#[0-9a-fA-F]{6}$/.test(v)) setTextColor(v);
                          }}
                          className="flex-1 text-xs font-mono px-2 py-1 border border-gray-200 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-400"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-[10px] text-gray-400">
                  Colors reflect live on the preview.
                </p>
              </div>
            )}
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
