import { api } from "./api";

// ✅ Get templates
export const getTemplates = async () => {
  const res = await api.get("/whatsapp/templates");
  return res.data;
};

// ✅ Upload template
export const uploadTemplate = async (file: File, providers: { platform: string; templateName: string; mediaType: string }[]) => {
  const formData = new FormData();
  formData.append("template", file);
  formData.append("providers", JSON.stringify(providers)); // ✅ add providers

  const res = await api.post("/whatsapp/upload-template", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

// ✅ Delete template (only if backend exists)
export const deleteTemplate = async (id: string) => {
  return api.delete(`/whatsapp/templates/${id}`);
};
