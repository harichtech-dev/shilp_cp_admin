// template.service.ts - Create, list, delete and preview WhatsApp image/video
// templates, including uploading them (with provider metadata) to the backend.

import { api } from "./api";

/**
 * GET TEMPLATES - List of all templates.
 * Calls: GET /whatsapp/templates
 * Returns: the available image/video templates.
 */
export const getTemplates = async () => {
  const res = await api.get("/whatsapp/templates");
  return res.data;
};

/**
 * UPLOAD TEMPLATE - Upload a new template.
 * Calls: POST /whatsapp/upload-template (multipart/form-data)
 * Parameters: file (image/video), providers array (declares which platforms
 * should use this template).
 * Sends the file plus the provider metadata as a JSON-encoded string inside
 * FormData.
 */
export const uploadTemplate = async (file: File, providers: { platform: string; templateName: string; mediaType: string }[]) => {
  const formData = new FormData();
  formData.append("template", file);
  formData.append("providers", JSON.stringify(providers)); // Metadata as JSON string

  const res = await api.post("/whatsapp/upload-template", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

/**
 * DELETE TEMPLATE - Delete an existing template.
 * Calls: DELETE /whatsapp/templates/:id
 * Parameters: id (the template's unique identifier)
 */
export const deleteTemplate = async (id: string) => {
  return api.delete(`/whatsapp/templates/${id}`);
};

/**
 * PREVIEW IMAGE - Generate a preview of a template image.
 * Calls: POST /whatsapp/preview-image
 * Parameters: templateId plus optional customization colors (bg/text/name).
 */
export const previewImage = async ({
  templateId,
  bgColor,
  textColor,
  nameColor,
}: {
  templateId: string;
  bgColor?: string;
  textColor?: string;
  nameColor?: string;
}) => {
  const res = await api.post("/whatsapp/preview-image", {
    templateId,
    bgColor,
    textColor,
    nameColor,
  });

  return res.data;
};