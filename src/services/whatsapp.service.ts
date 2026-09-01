import { api } from "./api";
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

// 📡 Check WhatsApp status (unchanged)
export const getWhatsappStatus = async () => {
  const res = await api.get("/whatsapp/status");
  return res.data;
};