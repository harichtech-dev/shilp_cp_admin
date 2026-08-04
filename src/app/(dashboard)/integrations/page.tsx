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
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingSlug, setSavingSlug] = useState<string | null>(null);
  const router = useRouter();
  const canAccess = useRequireAdmin();

  const loadIntegrations = async () => {
  const data = await getIntegrations();
  setIntegrations(data.data || []);
};

  useEffect(() => {
    (async () => {
      try {
        const data = await getIntegrations();
        setIntegrations(data.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleChange = (slug: string, key: string, value: string) => {
    setIntegrations((prev) =>
      prev.map((int) =>
        int.slug === slug
          ? {
              ...int,
              config: {
                ...(int.config || {}),
                [key]: value,
              },
            }
          : int,
      ),
    );
  };

  const saveConfig = async (slug: string, config: IntegrationConfig = {}) => {
    try {
      setSavingSlug(slug);

      const res = await updateIntegrationConfig(slug, config);
      toast.success(res.message || "Connected successfully");
      await loadIntegrations();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Error saving config";

      toast.error(message);
    } finally {
      setSavingSlug(null);
    }
  };

  const toggleStatus = async (slug: string, status: string) => {
    try {
      await updateIntegrationStatus(
        slug,
        status === "connected" ? "disconnected" : "connected",
      );
      await loadIntegrations();
    } catch (err) {
      console.error(err);
    }
  };

  if (!canAccess) return <div className="p-6">Loading...</div>;

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
