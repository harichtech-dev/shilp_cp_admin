"use client";

import { useState } from "react";
import { api } from "@/services/api";
import { useRouter } from "next/navigation";
import { useRequireAdmin } from "@/hooks/useRequireAdmin";

export default function AddIntegrationPage() {
  const router = useRouter();
  const canAccess = useRequireAdmin();
  const [name, setName] = useState("");

  const handleCreate = async () => {
    try {
      await api.post("/integrations", {
        name,
        slug: name.toLowerCase(),
        connectionType: "api_url_token",

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
            key: "channelNumber", // ✅ IMPORTANT
            label: "Channel Number",
            type: "text",
            placeholder: "e.g. 919909961234",
          },
        ],
      });

      router.push("/integrations");
    } catch (err) {
      console.error(err);
    }
  };

  if (!canAccess) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Add Integration</h1>

      <input
        placeholder="Integration Name (wati / interakt)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 w-full rounded"
      />

      <button
        onClick={handleCreate}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Create
      </button>
    </div>
  );
}
