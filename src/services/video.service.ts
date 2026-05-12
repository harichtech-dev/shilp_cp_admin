import { api } from "./api";

// GET videos template
export const getVideoTemplates = async () => {
  const res = await api.get("/videos/templates");
  return res.data;
};

// upload video template
export const uploadVideoTemplate = async (
  file: File,
  layout: number,
  providers: { platform: string; templateName: string; mediaType: string }[],
) => {
  const formData = new FormData();
  formData.append("template", file);
  formData.append("layout", String(layout));
  formData.append("providers", JSON.stringify(providers)); // ✅ add this

  const res = await api.post("/videos/upload-template", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};

// send bulk video
export const sendBulkVideo = async ({
  templateId,
  platform,
}: {
  templateId: string;
  platform: string;
}) => {
  const res = await api.post("/videos/send-bulk", {
    templateId,
    platform,
  });

  return res.data;
};

export const deleteVideoTemplate = async (id: string) => {
  return api.delete(`/videos/templates/${id}`);
};
// export const sendBulkVideo = async (templateId : string) => {
//     const res = await api.post("/videos/send-bulk" , {templateId})
//     return res.data;
// }
