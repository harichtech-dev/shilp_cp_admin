"use client";

import { useEffect, useState } from "react";
import {
  getIntegrations,
  updateIntegrationConfig,
  updateIntegrationStatus,
} from "@/services/integration.service";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useRequireAdmin } from "@/hooks/useRequireAdmin";

/**
 * Route: /integrations
 * Lists the messaging providers (WATI, Interakt etc.) with their config
 * fields and connection status. Admins can save credentials and toggle
 * connect/disconnect per integration.
 */
interface IntegrationField {
  key: string;
  label: string;
  type?: string;
  placeholder?: string;
}

interface IntegrationConfig {
  [key: string]: string;
}

interface Integration {
  _id: string;
  slug: string;
  name: string;
  status: "connected" | "disconnected";
  config?: IntegrationConfig;
  fields?: IntegrationField[];
}

/**
 * IntegrationsPage - Displays and manages messaging provider integrations.
 * Loads integrations on mount, lets admins edit config, save it and toggle
 * connection status. Interakt is currently read-only ("coming soon").
 */
export default function IntegrationsPage() {
  // State management - integrations list, loading flag and the slug being saved
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingSlug, setSavingSlug] = useState<string | null>(null); // The slug currently being saved
  const router = useRouter();
  const canAccess = useRequireAdmin(); // Only admins can access this page

  /**
   * loadIntegrations - Fetches the integrations list from the backend,
   * including each provider's config fields and connection status.
   */
  const loadIntegrations = async () => {
    // Fetch all integrations from the API
    const data = await getIntegrations();
    // Store the returned array in state
    setIntegrations(data.data || []);
  };

  /**
   * useEffect - Loads integrations on mount.
   * Manages the loading state and logs any fetch errors.
   */
  useEffect(() => {
    (async () => {
      try {
        // Fetch integrations from the backend
        const data = await getIntegrations();
        // Update the state with the response
        setIntegrations(data.data || []);
      } catch (error) {
        // Log the error to the console
        console.error(error);
      } finally {
        // Mark loading as complete
        setLoading(false);
      }
    })();
  }, []);

  /**
   * handleChange - Updates an integration config field as the admin types.
   * slug: which integration (e.g. wati/interakt)
   * key: the field name (apiUrl, token, channelNumber)
   * value: the admin-entered value
   */
  const handleChange = (slug: string, key: string, value: string) => {
    // Map and update the matching integration in the list
    setIntegrations((prev) =>
      prev.map((int) =>
        int.slug === slug // Find the integration by slug
          ? {
              ...int,
              // Merge the new value into the config object
              config: {
                ...(int.config || {}),
                [key]: value,
              },
            }
          : int, // Leave other integrations unchanged
      ),
    );
  };

  /**
   * saveConfig - Saves an integration's config to the backend.
   * Persists provider credentials such as the WATI API URL, JWT token and
   * channel number.
   */
  const saveConfig = async (slug: string, config: IntegrationConfig = {}) => {
    try {
      // Track which slug is being saved (disables its button)
      setSavingSlug(slug);

      // Update the config via the API
      const res = await updateIntegrationConfig(slug, config);
      // Show a success message
      toast.success(res.message || "Connected successfully");
      // Refresh the list so the updated status is reflected
      await loadIntegrations();
    } catch (err: unknown) {
      // Extract the error message from the API response
      const message =
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Error saving config";

      // Show the error to the admin
      toast.error(message);
    } finally {
      // Clear the saving state to re-enable the button
      setSavingSlug(null);
    }
  };

  /**
   * toggleStatus - Connects or disconnects an integration.
   * Flips the status to the opposite value and refreshes the list.
   */
  const toggleStatus = async (slug: string, status: string) => {
    try {
      // Toggle the status via the API
      await updateIntegrationStatus(
        slug,
        // Switch to the opposite of the current status
        status === "connected" ? "disconnected" : "connected",
      );
      // Refresh the list with the updated status
      await loadIntegrations();
    } catch (err) {
      // Log any error to the console
      console.error(err);
    }
  };

  // Show a loading state until admin access is confirmed
  if (!canAccess) return <div className="p-6">Loading...</div>;

  // Initial loading state
  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Integrations</h1>
          <p className="text-sm text-gray-500 mt-1">
            Connect and manage your messaging providers
          </p>
        </div>

        {/* <button
        onClick={() => router.push("/integrations/add")}
        className="bg-black text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:opacity-90"
      >
        + Add Integration
      </button> */}
      </div>

      {/* Empty state */}
      {integrations.length === 0 && (
        <div className="bg-white p-6 rounded shadow text-center">
          <p className="text-gray-600 mb-4">No integrations found</p>

          <button
            onClick={() => router.push("/integrations/add")}
            className="bg-black text-white px-4 py-2 rounded"
          >
            + Add Integration
          </button>
        </div>
      )}

      {/* Existing integrations */}
      {integrations.map((integration) => {
        const isInterakt = integration.slug === "interakt";

        return (
          <div
            key={integration._id}
            className="bg-white shadow rounded-xl p-6 border"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">{integration.name}</h2>

              {/* Status badge */}
              <span
                className={`px-3 py-1 rounded text-sm ${
                  isInterakt
                    ? "bg-gray-100 text-gray-600"
                    : integration.status === "connected"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-600"
                }`}
              >
                {isInterakt ? "Coming Soon" : integration.status}
              </span>
            </div>

            {/* Dynamic config fields rendered from the integration schema */}
            <div className="grid gap-4">
              {Array.isArray(integration.fields) &&
                integration.fields.map((field: IntegrationField) => (
                  <div key={field.key}>
                    <label className="text-sm text-gray-600">
                      {field.label}
                    </label>

                    <input
                      type={field.type === "password" ? "password" : "text"}
                      placeholder={field.placeholder || field.label}
                      value={integration.config?.[field.key] || ""}
                      onChange={(e) =>
                        handleChange(
                          integration.slug,
                          field.key,
                          e.target.value,
                        )
                      }
                      disabled={isInterakt} // Disabled for Interakt
                      className="border p-2 rounded w-full mt-1 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                ))}
            </div>

            {/* Helper text for unavailable integrations */}
            {isInterakt && (
              <p className="text-xs text-gray-500 mt-3">
                Interakt integration is not available yet. This feature will be
                released soon.
              </p>
            )}

            {/* Actions */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => saveConfig(integration.slug, integration.config)}
                disabled={savingSlug === integration.slug || isInterakt} // Disabled while saving or for Interakt
                className="bg-black text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Config
              </button>

              <button
                onClick={() =>
                  toggleStatus(integration.slug, integration.status)
                }
                disabled={isInterakt} // Disabled for Interakt
                className="bg-gray-200 px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {integration.status === "connected" ? "Disconnect" : "Connect"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
