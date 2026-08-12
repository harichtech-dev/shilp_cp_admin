import { IntegrationConfig } from "@/types/integration";
import { api } from "./api";

// ✅ Get all integrations
export const getIntegrations = async () => {
  const res = await api.get("/integrations");
  return res.data;
};

// ✅ Get connection status only (safe for any logged-in role, no credentials)
export const getIntegrationStatus = async () => {
  const res = await api.get("/integrations/status");
  return res.data;
};

// ✅ Get single integration (optional)
export const getIntegration = async (slug: string) => {
  const res = await api.get(`/integrations/${slug}`);
  return res.data;
};

// ✅ Update config (connect)
export const updateIntegrationConfig = async (
  slug: string, 
  config: IntegrationConfig
) => {
  const res = await api.put(`/integrations/${slug}/config`, config);
  return res.data;
};

// ✅ Update status (connect / disconnect)
export const updateIntegrationStatus = async (
  slug: string,
  status: "connected" | "disconnected"
) => {
  const res = await api.patch(`/integrations/${slug}/status`, {
    status,
  });
  return res.data;
};