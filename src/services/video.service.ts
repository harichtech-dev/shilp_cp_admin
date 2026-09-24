// video.service.ts - Manage video templates: list, upload, preview, bulk-send
// and delete them through the video endpoints of the backend.

import { api } from "./api";

/**
 * GET VIDEO TEMPLATES - List of all available video templates.
 * Calls: GET /videos/templates
 */
export const getVideoTemplates = async () => {
  const res = await api.get("/videos/templates");
  return res.data;
};

/**
 * UPLOAD VIDEO TEMPLATE - Upload a new video template.
 * Calls: POST /videos/upload-template (multipart/form-data)
 * Parameters: file (the video), layout (numeric layout type) and the list of
 * providers that should use this template.
 * Sends the file plus layout and provider metadata as FormData.
 */
export const uploadVideoTemplate = async (
  file: File,
  layout: number,
  providers: { platform: string; templateName: string; mediaType: string }[],
) => {
  const formData = new FormData();
  formData.append("template", file);
  formData.append("layout", String(layout)); // Layout type
  formData.append("providers", JSON.stringify(providers)); // Which platforms use this

  const res = await api.post("/videos/upload-template", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};

/**
 * SEND BULK VIDEO - Send a template video to all users.
 * Calls: POST /videos/send-bulk
 * Parameters: templateId, platform and optional color overrides.
 * The video is dispatched to every user on the selected platform.
 */
export const sendBulkVideo = async ({
  templateId,
  platform,
  bgColor,
  textColor,
}: {
  templateId: string;
  platform: string;
  bgColor?: string;
  textColor?: string;
}) => {
  const res = await api.post("/videos/send-bulk", {
    templateId,
    platform,
    bgColor,
    textColor,
  });

  return res.data;
};

/**
 * DELETE VIDEO TEMPLATE - Delete a video template.
 * Calls: DELETE /videos/templates/:id
 */
export const deleteVideoTemplate = async (id: string) => {
  return api.delete(`/videos/templates/${id}`);
};

/**
 * PREVIEW VIDEO - Generate a preview of a video template.
 * Calls: POST /videos/preview
 * Parameters: templateId plus optional background/text color overrides.
 */
// preview video
export const previewVideo = async ({
  templateId,
  bgColor,
  textColor,
}: {
  templateId: string;
  bgColor?: string;
  textColor?: string;
}) => {
  const res = await api.post("/videos/preview", {
    templateId,
    bgColor,
    textColor,
  });

  return res.data;
};
// export const sendBulkVideo = async (templateId : string) => {
//     const res = await api.post("/videos/send-bulk" , {templateId})
//     return res.data;
// }
