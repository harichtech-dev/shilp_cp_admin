"use client";

import { useState } from "react";
import { api } from "@/services/api";
import { useRouter } from "next/navigation";
import { useRequireAdmin } from "@/hooks/useRequireAdmin";

/**
 * Component: AddIntegrationPage
 * Render the form used to create a new integration.
 * The submitted integration name is sent to the API in a POST request.
 */
export default function AddIntegrationPage() {
  const router = useRouter();
  const canAccess = useRequireAdmin(); // Restrict this page to administrators.
  const [name, setName] = useState(""); // Store the integration name.


  // Create the integration through the API.
  const handleCreate = async () => {
    try {
      // Send the integration details to the backend.
      await api.post("/integrations", {
        name, // Integration display name.
        slug: name.toLowerCase(), // URL-friendly identifier.
        connectionType: "api_url_token", // Authentication type

        // Define the configuration fields shown to the user.
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

      // Return to the integrations list after creation.
      router.push("/integrations");
    } catch (err) {
      console.error(err);
    }
  };

  // Show a loading state while access is being checked.
  if (!canAccess) return <div className="p-6">Loading...</div>;

  // Render the integration creation form.
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Add Integration</h1>

      {/* Integration name field */}
      <input
        placeholder="Integration Name (wati / interakt)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 w-full rounded"
      />

      {/* Submit the form */}
      <button
        onClick={handleCreate}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Create
      </button>
    </div>
  );
}
