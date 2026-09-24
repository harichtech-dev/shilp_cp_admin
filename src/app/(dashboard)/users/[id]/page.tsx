"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getUserById } from "@/services/user.service";
import Image from "next/image";

/**
 * Route: /users/[id]
 * View-only page for a single user. Fetches the user by route id and shows
 * their logo, contact details, company and status with a link to edit.
 */
interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  logo?: string;
  status: number;
}

/**
 * ViewUser - Read-only profile for one user.
 * Loads the user on mount, renders loading / not-found states, and offers
 * navigation back to the list or into the edit form.
 */
export default function ViewUser() {
  const { id } = useParams(); // The user id from the route
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null); // The fetched user record
  const [loading, setLoading] = useState(true);

  // Fetch the user by id when the route value changes
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Load the user data by id from the API
        const data = await getUserById(id as string);
        setUser(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  // Show a loading placeholder while the request is in flight
  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  // Handle the case where the user no longer exists
  if (!user) {
    return <div className="text-center py-10 text-red-500">User not found</div>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
      {/* Header */}
      <div className="flex items-center gap-4 border-b pb-4">
        <Image
          src={user.logo ? `${user.logo}` : "/default-avatar.png"}
          height={64}
          width={64}
          alt="User Logo"
          className="w-16 h-16 rounded-full object-cover border"
          referrerPolicy="no-referrer"
        />

        <div>
          <h2 className="text-xl font-semibold text-black">{user.name}</h2>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {/* Phone */}
        <div className="border rounded-xl p-4 bg-gray-50">
          <p className="text-sm text-gray-500 mb-1">Phone</p>
          <p className="font-semibold text-black">{user.phone || "-"}</p>
        </div>

        {/* Company */}
        <div className="border rounded-xl p-4 bg-gray-50">
          <p className="text-sm text-gray-500 mb-1">Company</p>
          <p className="font-semibold text-black">{user.company || "-"}</p>
        </div>

        {/* Status */}
        <div className="border rounded-xl p-4 bg-gray-50">
          <p className="text-sm text-gray-500 mb-2">Status</p>

          <span
            className={`inline-flex items-center px-3 py-1 -ml-1 rounded-full text-xs font-semibold ${
              user.status === 1
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {user.status === 1 ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-6 border-t mt-6">
        <button
          onClick={() => router.push("/users")}
          className="px-4 py-2 border rounded-lg hover:bg-gray-100 text-black"
        >
          Back
        </button>

        <button
          onClick={() => router.push(`/users/edit/${user._id}`)}
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
        >
          Edit
        </button>
      </div>
    </div>
  );
}
