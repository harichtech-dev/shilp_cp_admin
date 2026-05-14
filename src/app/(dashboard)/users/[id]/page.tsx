"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getUserById } from "@/services/user.service";
import Image from "next/image";

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  logo?: string;
}

export default function ViewUser() {
  const { id } = useParams();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
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

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (!user) {
    return <div className="text-center py-10 text-red-500">User not found</div>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-100">

      {/* Header */}
      <div className="flex items-center gap-4 border-b pb-4">
        <Image
          src={
            user.logo
              ? `${user.logo}`
              : "/default-avatar.png"
          }
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
      <div className="grid grid-cols-2 gap-6 mt-6 text-sm">

        <div>
          <p className="text-gray-500">Phone</p>
          <p className="font-medium text-black">{user.phone || "-"}</p>
        </div>

        <div>
          <p className="text-gray-500">Company</p>
          <p className="font-medium text-black">{user.company || "-"}</p>
        </div>

        {/* <div>
          <p className="text-gray-500">Role</p>
          <p className="font-medium text-black">{user.role || "-"}</p>
        </div> */}

        {/* <div>
          <p className="text-gray-500">User ID</p>
          <p className="font-medium text-xs break-all">{user.id}</p>
        </div> */}

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