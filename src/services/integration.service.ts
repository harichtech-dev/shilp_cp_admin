import { IntegrationConfig } from "@/types/integration";
import { api } from "./api";

/**
 * GET INTEGRATIONS - Sab available integrations ki list
 * Output: Integrations with all fields
 */
export const getIntegrations = async () => {
  const res = await api.get("/integrations");
  return res.data;
};

/**
 * GET INTEGRATION STATUS - Sab integrations ka connection status check
 * Output: Slug, name, status only (credentials nahi bhejta)
 * Ye safe hai kyunki sensitive data nahi bhejta
 */
export const getIntegrationStatus = async () => {
  const res = await api.get("/integrations/status");
  return res.data;
};

/**
 * GET INTEGRATION - Specific integration ki details
 * Input: slug (integration ka unique identifier)
 * Output: Full integration with fields configuration
 */
export const getIntegration = async (slug: string) => {
  const res = await api.get(`/integrations/${slug}`);
  return res.data;
};

/**
 * UPDATE INTEGRATION CONFIG - Integration ke credentials update karna
 * Input: slug, config (apiUrl, jwtToken, channelNumber etc.)
 * Use: Jab user WATI/INTERAKT account connect karna chahta hai
 * Process: Backend WATI API ko call kar ke verify karta hai
 */
export const updateIntegrationConfig = async (
  slug: string, 
  config: IntegrationConfig
) => {
  const res = await api.put(`/integrations/${slug}/config`, config);
  return res.data;
};

/**
 * UPDATE INTEGRATION STATUS - Integration ko enable/disable karna
 * Input: slug, status ("connected" ya "disconnected")
 * Use: Admin integration ko on/off kar sakte hain
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