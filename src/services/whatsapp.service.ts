// import { api } from "./api";

// // 📤 Send image bulk
// export const sendBulkImage = async (templateId: string) => {
//   const res = await api.post("/whatsapp/send-bulk", {
//     templateId,
//   });
//   return res.data;
// };

// // 🎥 Send video bulk
// export const sendBulkVideo = async (templateId: string) => {
//   const res = await api.post("/video/send-bulk", {
//     templateId,
//   });
//   return res.data;
// };

// // 📡 Check WhatsApp status
// export const getWhatsappStatus = async () => {
//   const res = await api.get("/whatsapp/status");
//   return res.data;
// };

import { api } from "./api";

// 📤 Send image bulk (FIXED)
export const sendBulkImage = async ({
  templateId,
  platform,
}: {
  templateId: string;
  platform: string;
}) => {
  const res = await api.post("/whatsapp/send-bulk", {
    templateId,
    platform,
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