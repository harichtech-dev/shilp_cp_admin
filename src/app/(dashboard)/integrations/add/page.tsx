"use client";

import { useState } from "react";
import { api } from "@/services/api";
import { useRouter } from "next/navigation";
import { useRequireAdmin } from "@/hooks/useRequireAdmin";

/**
 * Route: /integrations/add
 * Form to create a new messaging integration. The admin enters a provider
 * name, which is POSTed along with a slug and the standard config fields.
 */

/**
 * Component: AddIntegrationPage
 * Renders the form for adding a new integration. The admin enters a provider
 * name and, on submit, a POST request creates the integration via the API.
 */
export default function AddIntegrationPage() {
  const router = useRouter();
  const canAccess = useRequireAdmin(); // Verifies the admin is authenticated
  const [name, setName] = useState(""); // Holds the integration name entered by the admin


  /**
   * handleCreate - Creates a new integration by POSTing its details to the API.
   * On success the admin is redirected to the integrations list; failures are
   * logged to the console.
   */
  const handleCreate = async () => {
    try {
      // Send the integration details to the backend
      await api.post("/integrations", {
        name, // The integration name
        slug: name.toLowerCase(), // URL-friendly slug derived from the name
        connectionType: "api_url_token", // Authentication type used by the provider

        // Required fields the admin will fill in for this integration
        fields: [
          {
            key: "apiUrl",
            label: "API URL",
            type: "text",
            placeholder: "https://live-mt-server.wati.io/xxxx",
          },
          {
            key: "jwtToken",
            label: "JWT Token",
            type: "password",
            placeholder: "Enter API token",
          },
          {
            key: "channelNumber",
            label: "Channel Number",
            type: "text",
            placeholder: "e.g. 919909961234",
          },
        ],
      });

      // Navigate to the integrations list on success
      router.push("/integrations");
    } catch (err) {
      console.error(err);
    }
  };

  // Show a loading state until admin access is confirmed
  if (!canAccess) return <div className="p-6">Loading...</div>;

  // Render the form for adding a new integration
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Add Integration</h1>

      {/* Input for the integration name (e.g. wati / interakt) */}
      <input
        placeholder="Integration Name (wati / interakt)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 w-full rounded"
      />

      {/* Submit button that triggers handleCreate on click */}
      <button
        onClick={handleCreate}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Create
      </button>
    </div>
  );
}
