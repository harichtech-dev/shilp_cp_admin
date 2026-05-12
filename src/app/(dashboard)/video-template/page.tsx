"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  getVideoTemplates,
  uploadVideoTemplate,
  deleteVideoTemplate,
} from "@/services/video.service";
import { toast } from "sonner";

interface Template {
  id: string;
  name: string;
  video: string;
  layout: number;
}

export default function VideoTemplatePage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [watiTemplateName, setWatiTemplateName] = useState("");

  const [file, setFile] = useState<File | null>(null);
  const [layout, setLayout] = useState(1);

  const fileRef = useRef<HTMLInputElement>(null);

  // 🔹 Fetch templates
  const fetchTemplates = async () => {
    try {
      const data = await getVideoTemplates();
      if (data.success) {
        setTemplates(data.data);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  // ✅ Step 1 - File selected → show modal
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setShowModal(true);
  };

  // ✅ Step 2 - Modal confirmed → upload with providers
  const handleConfirmUpload = async () => {
    if (!file || !watiTemplateName) return;
    setShowModal(false);
    const toastId = toast.loading("Uploading video...");

    try {
      setUploading(true);
      const providers = [
        {
          platform: "wati",
          templateName: watiTemplateName,
          mediaType: "video",
        },
      ];

      const res = await uploadVideoTemplate(file, layout, providers);

      if (res.success) {
        toast.success("Video uploaded successfully", { id: toastId });
        fetchTemplates();
      } else {
        toast.error(res.message || "Upload failed", { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error("Upload failed", { id: toastId });
    } finally {
      setUploading(false);
      setFile(null);
      setWatiTemplateName("");
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  // 🔹 Delete
  const handleDelete = (id: string) => {
    const toastId = toast("Are you sure you want to delete?", {
      action: {
        label: "Delete",
        onClick: async () => {
          try {
            toast.dismiss(toastId);
            await deleteVideoTemplate(id);
            toast.success("Template deleted");
            fetchTemplates();
          } catch (err) {
            toast.error("Delete failed");
          }
        },
      },
    });
  };

  // return (
  //   <div className="space-y-6">
  //     {/* ✅ Modal */}
  //     {showModal && (
  //       <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
  //         <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
  //           <h2 className="text-lg font-semibold">Enter WATI Template Name</h2>
  //           <p className="text-sm text-gray-500">
  //             Exact template name from WATI dashboard
  //           </p>
  //           <input
  //             type="text"
  //             placeholder="e.g. property_video_share"
  //             value={watiTemplateName}
  //             onChange={(e) => setWatiTemplateName(e.target.value)}
  //             className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
  //           />
  //           <div className="flex gap-3 justify-end">
  //             <button
  //               onClick={() => {
  //                 setShowModal(false);
  //                 setFile(null);
  //               }}
  //               className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-100"
  //             >
  //               Cancel
  //             </button>
  //             <button
  //               onClick={handleConfirmUpload}
  //               disabled={!watiTemplateName}
  //               className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
  //             >
  //               Upload
  //             </button>
  //           </div>
  //         </div>
  //       </div>
  //     )}

  //     {/* HEADER */}
  //     <div className="flex justify-between items-center">
  //       <h1 className="text-2xl font-semibold text-gray-900">
  //         Video Templates
  //       </h1>
  //     </div>

  //     {/* UPLOAD SECTION */}
  //     <div className="bg-white p-5 rounded-xl shadow border space-y-4">
  //       <div className="flex flex-wrap items-center gap-4">
  //         {/* File Upload */}
  //         <label className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg cursor-pointer text-sm text-gray-900">
  //           🎥 Select Video
  //           <input
  //             ref={fileRef}
  //             type="file"
  //             accept="video/*"
  //             onChange={(e) => setFile(e.target.files?.[0] || null)}
  //             className="hidden"
  //           />
  //         </label>

  //         {file && <span className="text-sm text-gray-600">{file.name}</span>}

  //         {/* Layout Select */}
  //         <select
  //           value={layout}
  //           onChange={(e) => setLayout(Number(e.target.value))}
  //           className="border px-3 py-2 rounded-lg text-sm"
  //         >
  //           <option value={1}>Layout 1 (Header + Footer)</option>
  //           <option value={2}>Layout 2 (Footer Only)</option>
  //         </select>

  //         {/* Upload Button */}
  //         <button
  //           onClick={handleUpload}
  //           disabled={uploading}
  //           className={`px-4 py-2 rounded-lg text-white text-sm ${
  //             uploading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
  //           }`}
  //         >
  //           {uploading ? "Uploading..." : "Upload"}
  //         </button>
  //       </div>
  //     </div>

  //     {/* GRID */}
  //     {loading ? (
  //       <div className="text-center py-10 text-gray-500">
  //         Loading templates...
  //       </div>
  //     ) : templates.length === 0 ? (
  //       <div className="text-center py-10 text-gray-500">
  //         No video templates found
  //       </div>
  //     ) : (
  //       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
  //         {templates.map((t) => (
  //           <Link key={t.id} href={`/send?videoTemplate=${t.id}`}>
  //             <div className="bg-white border rounded-xl shadow-sm hover:shadow-md transition overflow-hidden group cursor-pointer">
  //               {/* VIDEO PREVIEW */}
  //               <div className="h-[220px] bg-black flex items-center justify-center overflow-hidden">
  //                 <video
  //                   src={`${process.env.NEXT_PUBLIC_API_URL}${t.video}`}
  //                   className="w-full h-full object-cover group-hover:scale-105 transition"
  //                   muted
  //                   loop
  //                   playsInline
  //                 />
  //               </div>

  //               {/* CONTENT */}
  //               <div className="p-3">
  //                 <h3 className="text-sm font-semibold text-gray-800 truncate">
  //                   {t.name}
  //                 </h3>

  //                 <p className="text-xs text-gray-500 mt-1">
  //                   Layout: {t.layout}
  //                 </p>

  //                 {/* ACTION */}
  //                 <div className="mt-3 flex justify-between items-center">
  //                   <span className="text-xs text-blue-600 font-medium">
  //                     Use Template →
  //                   </span>
  //                 </div>
  //                 <button
  //                   onClick={(e) => {
  //                     e.preventDefault();
  //                     e.stopPropagation();
  //                     handleDelete(t.id);
  //                   }}
  //                   className="text-xs px-3 py-1 rounded-md border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition"
  //                 >
  //                   Delete
  //                 </button>
  //               </div>
  //             </div>
  //           </Link>
  //         ))}
  //       </div>
  //     )}
  //   </div>
  // );

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Video Templates
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Upload and manage video templates for WhatsApp campaigns
        </p>
      </div>

      {/* UPLOAD PANEL */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          {/* ✅ File picker - onChange uses handleFileSelect */}
          <label className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg cursor-pointer text-sm hover:opacity-90">
            🎥 {uploading ? "Uploading..." : "Select Video"}
            <input
              ref={fileRef}
              type="file"
              accept="video/*"
              onChange={handleFileSelect} // ✅ fixed
              className="hidden"
              disabled={uploading}
            />
          </label>

          {file && (
            <span className="text-sm text-gray-600 truncate max-w-[200px]">
              {file.name}
            </span>
          )}

          {/* Layout Select */}
          <select
            value={layout}
            onChange={(e) => setLayout(Number(e.target.value))}
            className="border border-gray-300 px-3 py-2 rounded-lg text-sm"
          >
            <option value={1}>Layout 1 (Header + Footer)</option>
            <option value={2}>Layout 2 (Footer Only)</option>
          </select>
        </div>
        <p className="text-xs text-gray-400 mt-3">
          Select a video to upload. You will be asked for the WATI template name
          before uploading.
        </p>
      </div>

      {/* ✅ Modal - outside everything */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
            <h2 className="text-lg font-semibold">Enter WATI Template Name</h2>
            <p className="text-sm text-gray-500">
              Enter the exact template name from your WATI dashboard
            </p>
            <input
              type="text"
              placeholder="e.g. property_reel_send"
              value={watiTemplateName}
              onChange={(e) => setWatiTemplateName(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowModal(false);
                  setFile(null);
                  if (fileRef.current) fileRef.current.value = "";
                }}
                className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmUpload}
                disabled={!watiTemplateName || uploading}
                className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GRID */}
      {loading ? (
        <div className="text-center py-16 text-gray-500">
          Loading templates...
        </div>
      ) : templates.length === 0 ? (
        <div className="text-center py-16 border rounded-xl bg-white">
          <p className="text-gray-600 font-medium">No video templates yet</p>
          <p className="text-sm text-gray-400 mt-1">
            Upload your first template to get started
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {templates.map((t) => (
            <Link key={t.id} href={`/send?videoTemplate=${t.id}`}>
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer group">
                <div className="h-[220px] bg-black overflow-hidden flex items-center justify-center">
                  <video
                    src={`${process.env.NEXT_PUBLIC_API_URL}${t.video}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                    muted
                    loop
                    playsInline
                  />
                </div>

                {/* CONTENT */}

                <div className="p-4 space-y-2">
                  <h3 className="text-sm font-semibold text-gray-800 truncate">
                    {t.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    Layout: {t.layout}
                  </p>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-blue-600 font-medium">
                      Use Template →
                    </span>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDelete(t.id);
                      }}
                      className="text-xs px-2.5 py-1 rounded-md border border-red-400 text-red-500 hover:bg-red-500 hover:text-white transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
