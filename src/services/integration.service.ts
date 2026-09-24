// integration.service.ts - Manage messaging integrations (e.g. WATI, INTERAKT).
// Covers listing integrations, checking connection status, and updating their
// configuration or enabling/disabling them.

import { IntegrationConfig } from "@/types/integration";
import { api } from "./api";

/**
 * GET INTEGRATIONS - List of all available integrations.
 * Calls: GET /integrations
 * Returns: integrations with all their fields.
 */
export const getIntegrations = async () => {
  const res = await api.get("/integrations");
  return res.data;
};

/**
 * GET INTEGRATION STATUS - Connection status of every integration.
 * Calls: GET /integrations/status
 * Returns: only slug, name and status (credentials are never included).
 * Safe because it does not leak sensitive data.
 */
export const getIntegrationStatus = async () => {
  const res = await api.get("/integrations/status");
  return res.data;
};

/**
 * GET INTEGRATION - Details of one specific integration.
 * Calls: GET /integrations/:slug
 * Parameters: slug (the integration's unique identifier)
 * Returns: the full integration including its fields configuration.
 */
export const getIntegration = async (slug: string) => {
  const res = await api.get(`/integrations/${slug}`);
  return res.data;
};

/**
 * UPDATE INTEGRATION CONFIG - Update an integration's credentials.
 * Calls: PUT /integrations/:slug/config
 * Parameters: slug, config (apiUrl, jwtToken, channelNumber, etc.)
 * Used when an admin wants to connect a WATI/INTERAKT account.
 * The backend verifies the credentials by calling the WATI API.
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
 * Calls: PATCH /integrations/:slug/status
 * Parameters: slug, status ("connected" or "disconnected")
 * Lets an admin turn an integration on or off.
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