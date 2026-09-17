import { api } from "./api";

/**
 * GET TEMPLATES - List all templates.
 * Output: Available image/video templates
 */
export const getTemplates = async () => {
  const res = await api.get("/whatsapp/templates");
  return res.data;
};

/**
 * UPLOAD TEMPLATE - Upload a new template.
 * Input: file (image/video), providers array
 * Specify which provider platforms should use the template.
 * Process: Send the file and metadata as FormData.
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
 */
export const deleteTemplate = async (id: string) => {
  return api.delete(`/whatsapp/templates/${id}`);
};

/**
 * PREVIEW IMAGE - Generate a template preview with customization options.
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