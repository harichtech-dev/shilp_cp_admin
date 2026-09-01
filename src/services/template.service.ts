import { api } from "./api";

/**
 * GET TEMPLATES - Sab templates ki list lena
 * Output: Available image/video templates
 */
export const getTemplates = async () => {
  const res = await api.get("/whatsapp/templates");
  return res.data;
};

/**
 * UPLOAD TEMPLATE - Naya template upload karna
 * Input: file (image/video), providers array
 * Providers mein kaunsi platforms par ye template use hona hai
 * Process: FormData mein file aur metadata bhejte hain
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
 * DELETE TEMPLATE - Existing template delete karna
 */
export const deleteTemplate = async (id: string) => {
  return api.delete(`/whatsapp/templates/${id}`);
};

/**
 * PREVIEW IMAGE - Template ka preview dekh sakte hain
 * Customization ke saath (colors etc.)
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