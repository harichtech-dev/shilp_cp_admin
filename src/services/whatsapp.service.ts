// whatsapp.service.ts - Send bulk WhatsApp messages (image/video), poll bulk
// job progress and check the WhatsApp connection status.

import { api } from "./api";

/**
 * SEND BULK IMAGE - Send a template image in bulk to all users.
 * Calls: POST /whatsapp/send-bulk
 * Parameters: templateId, platform and optional color customizations.
 * Returns: the send job result.
 */
export const sendBulkImage = async ({
  templateId,
  platform,
  bgColor,
  textColor,
  nameColor,
}: {
  templateId: string;
  platform: string;
  bgColor?: string;
  textColor?: string;
  nameColor?: string;
}) => {
  const res = await api.post("/whatsapp/send-bulk", {
    templateId,
    platform,
    bgColor,
    textColor,
    nameColor,
  });
  return res.data;
};

// 🎥 Send video bulk (FIXED)
/**
 * SEND BULK VIDEO - Send a template video in bulk via the video endpoints.
 * Calls: POST /videos/send-bulk
 * Parameters: templateId and the target platform.
 */
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

// 🔄 Poll bulk job status
/**
 * GET BULK JOB STATUS - Poll the progress/status of a bulk send job.
 * Calls: GET /whatsapp/bulk/:jobId
 */
export const getBulkJobStatus = async (jobId: string) => {
  const res = await api.get(`/whatsapp/bulk/${jobId}`);
  return res.data;
};

// 📡 Check WhatsApp status (unchanged)
/**
 * GET WHATSAPP STATUS - Check whether WhatsApp is connected/online.
 * Calls: GET /whatsapp/status
 */
export const getWhatsappStatus = async () => {
  const res = await api.get("/whatsapp/status");
  return res.data;
};