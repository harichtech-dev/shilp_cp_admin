"use client";

import { useState } from "react";
import { api } from "@/services/api";
import { useRouter } from "next/navigation";
import { useRequireAdmin } from "@/hooks/useRequireAdmin";

/**
 * Component: AddIntegrationPage
 * Ye component naya integration add karne ka form dikhata hai
 * User ko integration name enter karna padta hai aur fir submit karne se
 * API ko POST request jaati hai jo integration create ho jati hai
 */
export default function AddIntegrationPage() {
  const router = useRouter();
  const canAccess = useRequireAdmin(); // Check karte hain ki admin hai ya nahi
  const [name, setName] = useState(""); // Integration ka naam store karne ke liye


  // Naya integration create karne ka function - API ko data bhejta hai
  const handleCreate = async () => {
    try {
      // Backend ko integration ki details bhej rahe hain
      await api.post("/integrations", {
        name, // Integration ka naam
        slug: name.toLowerCase(), // URL friendly naam
        connectionType: "api_url_token", // Authentication type

        // Integration ke liye required fields - ye fields user ko dikhenge
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

      // Success ho to integrations list page par chale jao
      router.push("/integrations");
    } catch (err) {
      console.error(err);
    }
  };

  // Agar admin nahi hai to loading dikha
  if (!canAccess) return <div className="p-6">Loading...</div>;

  // Return - Form dikhana jo integration add karne ke liye
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Add Integration</h1>

      {/* Integration ka naam enter karne ke liye input field */}
      <input
        placeholder="Integration Name (wati / interakt)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 w-full rounded"
      />

      {/* Submit button - Click karne se handleCreate function call hoga */}
      <button
        onClick={handleCreate}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Create
      </button>
    </div>
  );
}
