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

export default function IntegrationsPage() {
  // State management - integrations list, loading status, saving status
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingSlug, setSavingSlug] = useState<string | null>(null); // Kon sa integration save ho raha hai
  const router = useRouter();
  const canAccess = useRequireAdmin(); // Admin access check - useRequireAdmin hook

  /**
   * loadIntegrations - Backend se integrations list fetch karte hain
   * WATI, INTERAKT jaise sab integrations ke config aur status
   */
  const loadIntegrations = async () => {
    // Backend API call - sab integrations fetch karte hain
    const data = await getIntegrations();
    // Response mein data array ko state mein set karte hain
    setIntegrations(data.data || []);
  };

  /**
   * useEffect - Component mount par integrations load karte hain
   * Loading state manage karte hain, error handle karte hain
   */
  useEffect(() => {
    (async () => {
      try {
        // Backend se integrations fetch karte hain
        const data = await getIntegrations();
        // State update karte hain
        setIntegrations(data.data || []);
      } catch (error) {
        // Error ko console mein log karte hain
        console.error(error);
      } finally {
        // Loading complete - state update karte hain
        setLoading(false);
      }
    })();
  }, []);

  /**
   * handleChange - Integration config fields ko update karte hain
   * User input karte hain to immediately state mein reflect hota hai
   * slug: kaun sa integration (wati/interakt)
   * key: field name (apiUrl, token, channelNumber)
   * value: user ka entered value
   */
  const handleChange = (slug: string, key: string, value: string) => {
    // Integrations array ko map karte hain aur matching integration ko update karte hain
    setIntegrations((prev) =>
      prev.map((int) =>
        int.slug === slug // Matching integration find karte hain
          ? {
              ...int,
              // Config object ko update karte hain - existing values + new value
              config: {
                ...(int.config || {}),
                [key]: value,
              },
            }
          : int, // Non-matching integrations ko unchanged rakho
      ),
    );
  };

  /**
   * saveConfig - Integration config ko backend mein save karte hain
   * WATI API URL, JWT Token, Channel Number jaise credentials save hote hain
   */
  const saveConfig = async (slug: string, config: IntegrationConfig = {}) => {
    try {
      // Saving state on - button disable hota hai loading ke liye
      setSavingSlug(slug);

      // Backend API se config update karte hain
      const res = await updateIntegrationConfig(slug, config);
      // Success message show karte hain
      toast.success(res.message || "Connected successfully");
      // Integrations list ko refresh karte hain (updated status ke saath)
      await loadIntegrations();
    } catch (err: unknown) {
      // Error message ko extract karte hain response se
      const message =
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Error saving config";

      // User ko error message dikhate hain
      toast.error(message);
    } finally {
      // Saving state off - button enable hota hai
      setSavingSlug(null);
    }
  };

  /**
   * toggleStatus - Integration ko connect/disconnect karte hain
   * Connected status ko disconnected mein aur vice versa
   */
  const toggleStatus = async (slug: string, status: string) => {
    try {
      // Backend API se status toggle karte hain
      await updateIntegrationStatus(
        slug,
        // Current status ke opposite mein change karte hain
        status === "connected" ? "disconnected" : "connected",
      );
      // List ko refresh karte hain updated status ke saath
      await loadIntegrations();
    } catch (err) {
      // Error ko log karte hain
      console.error(err);
    }
  };

  // Admin access check - non-admin ko loading dikhe
  if (!canAccess) return <div className="p-6">Loading...</div>;

  // Initial loading state
  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="space-y-6">
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

      {/* 🔥 Empty state */}
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

              {/* ✅ FIXED STATUS BADGE */}
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

            {/* 🔥 Dynamic Fields */}
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
                      disabled={isInterakt} // ✅ DISABLED
                      className="border p-2 rounded w-full mt-1 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                ))}
            </div>

            {/* 🔥 Helper text */}
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
                disabled={savingSlug === integration.slug || isInterakt} // ✅ DISABLED
                className="bg-black text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Config
              </button>

              <button
                onClick={() =>
                  toggleStatus(integration.slug, integration.status)
                }
                disabled={isInterakt} // ✅ DISABLED
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
