import { IntegrationConfig } from "@/types/integration";
import { api } from "./api";

/**
 * GET INTEGRATIONS - List all available integrations.
 * Output: Integrations with all fields
 */
export const getIntegrations = async () => {
  const res = await api.get("/integrations");
  return res.data;
};

/**
 * GET INTEGRATION STATUS - Return the connection status of all integrations.
 * Output: Slug, name, and status only; credentials are excluded.
 */
export const getIntegrationStatus = async () => {
  const res = await api.get("/integrations/status");
  return res.data;
};

/**
 * GET INTEGRATION - Return details for one integration.
 * Input: slug (the integration's unique identifier)
 * Output: Full integration with fields configuration
 */
export const getIntegration = async (slug: string) => {
  const res = await api.get(`/integrations/${slug}`);
  return res.data;
};

/**
 * UPDATE INTEGRATION CONFIG - Update integration credentials.
 * Input: slug, config (apiUrl, jwtToken, channelNumber etc.)
 * Use: Connect a WATI or INTERAKT account.
 * Process: The backend verifies the credentials through the provider API.
 */
export const updateIntegrationConfig = async (
  slug: string, 
  config: IntegrationConfig
) => {
  const res = await api.put(`/integrations/${slug}/config`, config);
  return res.data;
};

/**
 * UPDATE INTEGRATION STATUS - Enable or disable an integration.
 * Input: slug, status ("connected" or "disconnected")
 * Use: Allow administrators to control integration availability.
 */
export const updateIntegrationStatus = async (
  slug: string,
  status: "connected" | "disconnected"
) => {
  const res = await api.patch(`/integrations/${slug}/status`, {
    status,
  });
  return res.data;
};