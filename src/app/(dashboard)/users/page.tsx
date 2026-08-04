"use client";

import { useCallback, useEffect, useState } from "react";
import { getUsers, deleteUser, handleStats } from "@/services/user.service";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  logo?: string;
  status: number;
  createdAt: string;
}

interface Pagination {
  pages: number;
  total?: number;
  currentPage?: number;
}



export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination>({
    pages: 0,
  });
  const router = useRouter();

  const downloadCSV = () => {
  const headers = [
    "ID",
    "Name",
    "Email",
    "Phone",
    "Status",
    "Register Date",
  ];

  const rows = users.map((user, index) => [
    index + 1,
    user.name,
    user.email,
    user.phone,
    user.status === 1 ? "Active" : "Inactive",
    new Date(user.createdAt).toLocaleDateString(),
  ]);

  const csvContent = [
    headers,
    ...rows,
  ]
    .map((row) =>
      row
        .map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`)
        .join(",")
    )
    .join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `users-${new Date().toISOString().split("T")[0]}.csv`;
  link.click();

  URL.revokeObjectURL(url);
};

  const fetchUsers = useCallback(async () => {
    const res = await getUsers({ page, search });

    setUsers(res.data || res);
    setPagination(res.pagination);
  }, [page, search]);

  useEffect(() => {
    const loadUsers = async () => {
      await fetchUsers();
    };

    void loadUsers();
  }, [fetchUsers]);

  const handleDelete = async (_id: string) => {
    const toastId = toast("Are you sure you want to delete this user?", {
      action: {
        label: "Delete",
        onClick: async () => {
          try {
            toast.dismiss(toastId);

            await deleteUser(_id);

            toast.success("User deleted successfully");

            fetchUsers();
          } catch {
            toast.error("Failed to delete user");
          }
        },
      },
    });
  };

  const handleStatus = async (_id: string, currentStatus: number) => {
    try {
      const res = await handleStats(_id, currentStatus);
      if (res.success) {
        toast.success("Status updated successfully");
        fetchUsers();
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Users</h1>

        <div className="flex gap-3">
  <button
    onClick={downloadCSV}
    className="bg-green-600 text-white px-5 py-2 rounded-lg shadow hover:bg-green-700 transition"
  >
    Download CSV
  </button>

  <button
    onClick={() => router.push("/users/add")}
    className="bg-primary text-primary-foreground px-5 py-2 rounded-lg shadow hover:scale-105 transition"
  >
    + Add User
  </button>
</div>
      </div>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={(e) => {
          setPage(1);
          setSearch(e.target.value);
        }}
        className="w-full border rounded-lg px-3 py-2 text-black"
      />

      {/* Table */}
      <div className="bg-white rounded-xl shadow border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          {/* Header */}
          <thead className="bg-gray-950 text-white">
            <tr>
              <th className="px-3 md:px-6 py-3 text-left font-semibold">ID</th>
              <th className="px-3 md:px-6 py-3 text-left font-semibold">
                User
              </th>
              <th className="px-3 md:px-6 py-3 text-center font-semibold">
                Logo
              </th>
              <th className="px-3 md:px-6 py-3 text-center font-semibold">
                Mobile Number
              </th>
              <th className="px-3 md:px-6 py-3 text-center font-semibold">
                Email
              </th>
              <th className="px-3 md:px-6 py-3 text-center font-semibold">
                Register Date
              </th>
              <th className="px-3 md:px-6 py-3 text-center font-semibold">
                Status
              </th>
              <th className="px-3 md:px-6 py-3 text-center font-semibold">
                Actions
              </th>
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y">
            {users.map((user, index) => (
              <tr
                key={user._id}
                className={`border-b ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-gray-100 transition`}
              >
                <td className="px-3 md:px-6 py-3 text-center font-medium">
                  {(page - 1) * 10 + index + 1}
                </td>
                {/* User */}
                <td className="px-3 md:px-6 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-semibold text-gray-900">
                      {user.name}
                    </span>
                  </div>
                </td>

                {/* LOGO */}
                <td className="px-3 md:px-6 py-3 text-center">
                  {user.logo ? (
                    <Image
                      src={user.logo}
                      alt="logo"
                      width={60}
                      height={60}
                      referrerPolicy="no-referrer"
                      className="object-contain mx-auto rounded-md border"
                    />
                  ) : (
                    <span className="text-xs text-gray-400">—</span>
                  )}
                </td>

                {/* MOBILE NUMBER */}
                <td className="px-3 md:px-6 py-3 text-center text-gray-700">
                  {user.phone}
                </td>

                {/* EMAIL */}
                <td className="px-3 md:px-6 py-3 text-center text-gray-700">
                  {user.email}
                </td>

                {/* REGISTER DATE */}
                <td className="px-3 md:px-6 py-3 text-center text-gray-700">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>

                {/* STATUS */}
                <td className="px-3 md:px-6 py-3 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      user.status === 1
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {user.status === 1 ? "Active" : "Inactive"}
                  </span>
                </td>

                {/* ACTIONS */}
                <td className="px-3 md:px-6 py-3 text-center">
                  <div className="flex flex-wrap justify-center gap-2">
                    <button
                      onClick={() => router.push(`/users/${user._id}`)}
                      className="px-3 py-1 text-xs font-medium rounded-md border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition"
                    >
                      View
                    </button>

                    <button
                      onClick={() => router.push(`/users/edit/${user._id}`)}
                      className="px-3 py-1 text-xs font-medium rounded-md border border-green-500 text-green-500 hover:bg-green-500 hover:text-white transition"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(user._id)}
                      className="px-3 py-1 text-xs font-medium rounded-md border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition"
                    >
                      Delete
                    </button>

                    <button
                      onClick={() => handleStatus(user._id, user.status)}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition ${
                        user.status === 1
                          ? "border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
                          : "border border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                      }`}
                    >
                      {user.status === 1 ? "Deactivate" : "Activate"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* PAGINATION */}
      {pagination.pages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: pagination.pages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded ${
                page === i + 1 ? "bg-black text-white" : "bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
