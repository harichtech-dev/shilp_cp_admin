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

/**
 * Route: /image-template
 * Manages image templates used for WhatsApp image campaigns. Lists uploaded
 * templates, supports upload (with a WATI template name) and delete, and
 * links each template to the send campaign flow.
 */
interface Template {
  id: string;
  name: string;
  image: string;
}

/**
 * Page - Image template library for WhatsApp marketing.
 * Loads templates on mount, uploads new ones through a confirmation modal,
 * and lets admins delete existing templates.
 */
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
   * fetchTemplates - Fetches all image templates from the backend.
   * Stores the returned templates in state and manages the loading state.
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
   * handleFileSelect - Opens the modal when a file is selected.
   * In the modal the admin can enter the WATI template name.
   */
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Take the first selected file from the input
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Store the selected file in temporary state
    setPendingFile(file);
    // Open the modal so the admin can enter the template name
    setShowModal(true);
  };

  /**
   * handleConfirmUpload - Starts the upload when the modal is confirmed.
   * Uploads the file to the WATI provider and refreshes the template list.
   */
  const handleConfirmUpload = async () => {
    // Validation: a file and a template name are required
    if (!pendingFile || !templateName) return;

    try {
      // Turn on the uploading state
      setUploading(true);
      // Close the modal
      setShowModal(false);

      // Provider entry carries the WATI template name
      const providers = [
        { 
          platform: "wati", 
          templateName, // Admin entered name
          mediaType: "image" 
        },
      ];

      // Upload the file to the backend API
      const res = await uploadTemplate(pendingFile, providers);

      if (res.success) {
        // Success message
        toast.success("Template uploaded successfully");
        // Refresh the templates list
        fetchTemplates();
      } else {
        toast.error(res.message || "Upload failed");
      }
    } catch {
      toast.error("Upload failed");
    } finally {
      // Turn off the uploading state
      setUploading(false);
      // Reset the form fields
      setTemplateName("");
      setPendingFile(null);
      // Clear the file input value
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  /**
   * useEffect - Loads templates when the component mounts.
   */
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        // Fetch templates from the backend
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
   * handleDelete - Deletes a template after user confirmation.
   * id: the template ID to delete
   */
  const handleDelete = (id: string) => {
    // Show a confirmation toast
    const toastId = toast("Are you sure you want to delete?", {
      action: {
        label: "Delete",
        onClick: async () => {
          try {
            // Dismiss the confirmation dialog
            toast.dismiss(toastId);
            // Delete the template via the backend API
            await deleteTemplate(id);
            // Success message
            toast.success("Template deleted");
            // Refresh the templates list
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

      {/* Upload confirmation modal */}
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
