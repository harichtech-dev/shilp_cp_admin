"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  deleteTemplate,
  getTemplates,
  uploadTemplate,
} from "@/services/template.service";
import Link from "next/link";
import Image from "next/image";

interface Template {
  id: string;
  name: string;
  image: string;
}

const Page = () => {
  // State management - templates list, loading, uploading
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  // Refs and modal state
  const fileInputRef = useRef<HTMLInputElement>(null); // File input reference
  const [showModal, setShowModal] = useState(false); // Upload confirmation modal
  const [pendingFile, setPendingFile] = useState<File | null>(null); // Selected file waiting
  const [templateName, setTemplateName] = useState("property_details_share_"); // WATI template name

  /**
   * fetchTemplates - Backend se sab image templates fetch karte hain
   * Templates ko state mein set karte hain, loading state manage karte hain
   */
  const fetchTemplates = async () => {
    try {
      // Backend API call
      const data = await getTemplates();
      if (data.success) {
        setTemplates(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      // Loading complete
      setLoading(false);
    }
  };

  /**
   * handleFileSelect - File input se file select hone par modal show karte hain
   * Modal mein admin WATI template name enter kar sakte hain
   */
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    // File ke array mein se pehla file select karte hain
    const file = e.target.files?.[0];
    if (!file) return;
    
    // File ko temporary state mein store karte hain
    setPendingFile(file);
    // Modal show karte hain - admin template name enter kar sakta hai
    setShowModal(true);
  };

  /**
   * handleConfirmUpload - Modal confirmation mein upload start hota hai
   * File ko WATI provider ke saath upload karte hain
   * Upload success par templates list refresh karte hain
   */
  const handleConfirmUpload = async () => {
    // Validation - file aur template name required
    if (!pendingFile || !templateName) return;

    try {
      // Upload state on
      setUploading(true);
      // Modal close
      setShowModal(false);

      // Provider object - WATI template name ke saath
      const providers = [
        { 
          platform: "wati", 
          templateName, // Admin entered name
          mediaType: "image" 
        },
      ];

      // Backend API se upload karte hain
      const res = await uploadTemplate(pendingFile, providers);

      if (res.success) {
        // Success message
        toast.success("Template uploaded successfully");
        // Templates list refresh karte hain
        fetchTemplates();
      } else {
        toast.error(res.message || "Upload failed");
      }
    } catch {
      toast.error("Upload failed");
    } finally {
      // Upload state off
      setUploading(false);
      // Form reset karte hain
      setTemplateName("");
      setPendingFile(null);
      // File input clear karte hain
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  /**
   * useEffect - Component mount par templates load karte hain
   */
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        // Backend se templates fetch karte hain
        const data = await getTemplates();

        if (data.success) {
          setTemplates(data.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        // Loading complete
        setLoading(false);
      }
    };

    void loadTemplates();
  }, []);

  /**
   * handleDelete - Template ko delete karte hain with confirmation
   * id: template ID jo delete karna hai
   */
  const handleDelete = (id: string) => {
    // Confirmation toast show karte hain
    const toastId = toast("Are you sure you want to delete?", {
      action: {
        label: "Delete",
        onClick: async () => {
          try {
            // Confirmation dialog close
            toast.dismiss(toastId);
            // Backend API se delete karte hain
            await deleteTemplate(id);
            // Success message
            toast.success("Template deleted");
            // Templates list refresh karte hain
            fetchTemplates();
          } catch {
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

          {/* SIZE NOTE */}
          <div className="flex items-stretch gap-0 border border-gray-200 rounded-lg overflow-hidden w-full mt-2 bg-white">
            <div className="w-1 bg-blue-500 flex-shrink-0" />
            <div className="flex flex-col gap-1.5 px-3.5 py-2.5 bg-white">
              {/* Vertical */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-medium text-gray-400 w-16 shrink-0">
                  Vertical
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {["512×640px", "606×606px"].map((size) => (
                    <span
                      key={size}
                      className="text-[11px] font-medium text-gray-700 bg-gray-100 border border-gray-200 rounded px-2 py-0.5"
                    >
                      {size}
                    </span>
                  ))}
                </div>
              </div>

              {/* Horizontal */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-medium text-gray-400 w-16 shrink-0">
                  Horizontal
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {["512×288px"].map((size) => (
                    <span
                      key={size}
                      className="text-[11px] font-medium text-gray-700 bg-gray-100 border border-gray-200 rounded px-2 py-0.5"
                    >
                      {size}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
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
                  <Image
                    src={template.image}
                    alt="Template"
                    width={800}
                    height={800}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain"
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
              placeholder="e.g. property_details_share_"
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

export default Page;
