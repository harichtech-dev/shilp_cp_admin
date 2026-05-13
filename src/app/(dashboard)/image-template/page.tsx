"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  deleteTemplate,
  getTemplates,
  uploadTemplate,
} from "@/services/template.service";
import Link from "next/link";

interface Template {
  id: string;
  name: string;
  image: string;
}

const page = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [templateName, setTemplateName] = useState("");

  // 🔹 Fetch Templates
  const fetchTemplates = async () => {
    try {
      const data = await getTemplates();
      if (data.success) {
        setTemplates(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // When file is selected, show modal instead of uploading directly
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingFile(file);
    setShowModal(true); // show modal to enter WATI template name
  };

  // When modal is confirmed, upload with providers
  const handleConfirmUpload = async () => {
    if (!pendingFile || !templateName) return;

    try {
      setUploading(true);
      setShowModal(false);

      const providers = [
        { platform: "wati", templateName, mediaType: "image" },
      ];

      const res = await uploadTemplate(pendingFile, providers);

      if (res.success) {
        toast.success("Template uploaded successfully");
        fetchTemplates();
      } else {
        toast.error(res.message || "Upload failed");
      }
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
      setTemplateName("");
      setPendingFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  // 🔹 Delete
  const handleDelete = (id: string) => {
    const toastId = toast("Are you sure you want to delete?", {
      action: {
        label: "Delete",
        onClick: async () => {
          try {
            toast.dismiss(toastId);
            await deleteTemplate(id);
            toast.success("Template deleted");
            fetchTemplates();
          } catch (err) {
            toast.error("Delete failed");
          }
        },
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Image Templates
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Upload and manage image templates for WhatsApp campaigns
          </p>
        </div>

        {/* Upload Button */}
        <label className="bg-black text-white px-5 py-2.5 rounded-lg cursor-pointer text-sm font-medium hover:opacity-90">
          {uploading ? "Uploading..." : "+ Add Template"}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>

      {/* GRID */}
      {loading ? (
        <div className="text-center py-16 text-gray-500">
          Loading templates...
        </div>
      ) : templates.length === 0 ? (
        <div className="text-center py-16 bg-white border rounded-xl">
          <p className="text-gray-700 font-medium">No templates yet</p>
          <p className="text-sm text-gray-400 mt-1">
            Upload your first image template to get started
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
          {templates.map((template) => (
            <Link key={template.id} href={`/send?template=${template.id}`}>
              
              <div
                key={template.id}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer group"
              >
                {/* IMAGE */}
                <div className="h-[240px] bg-gray-100 flex items-center justify-center p-3">
                  
                  <img
                    src={`${template.image}`}
                    alt={template.name}
                    referrerPolicy="no-referrer"
                    className="max-h-full object-contain group-hover:scale-105 transition duration-300"
                  />
                </div>

                {/* CONTENT */}
                <div className="p-3">
                  {/* ACTIONS */}
                  <div className="flex items-center justify-between pt-2">
                    {/* Primary action */}
                    <span className="text-xs font-medium text-blue-600">
                      Use Template →
                    </span>

                    {/* <button
                      onClick={() =>
                        router.push(`/send?template=${template.id}`)
                      }
                      className="text-xs px-3 py-1 rounded-md bg-blue-500 text-white hover:bg-blue-600"
                    >
                      Use
                    </button> */}

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDelete(template.id);
                      }}
                      className="text-xs px-3 py-1 rounded-md border border-red-400 text-red-500 hover:bg-red-500 hover:text-white transition"
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

      {/* ✅ Add this modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
            <h2 className="text-lg font-semibold">Enter WATI Template Name</h2>
            <p className="text-sm text-gray-500">
              Enter the exact template name from your WATI dashboard
            </p>
            <input
              type="text"
              placeholder="e.g. property_details_share"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowModal(false);
                  setPendingFile(null);
                }}
                className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmUpload}
                disabled={!templateName}
                className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default page;
