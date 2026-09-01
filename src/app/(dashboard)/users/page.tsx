"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getUsers,
  deleteUser,
  handleStats,
  updateAllUsersStatus,
} from "@/services/user.service";
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
  // State management - users list, search, pagination
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination>({
    pages: 0,
  });
  const router = useRouter();

  // Bulk status logic - sab users active hain ya nahi check karte hain
  // Agar sab active hain to next click se deactivate, else activate
  const allActive = users.length > 0 && users.every((user) => user.status === 1);
  const nextBulkStatus = allActive ? 0 : 1;

  /**
   * downloadCSV - Users ka CSV file download karte hain
   * User ID, Name, Email, Phone, Status, Registration Date ko export karte hain
   * Browser se file download trigger hota hai
   */
  const downloadCSV = () => {
    // CSV headers define karte hain
    const headers = ["ID", "Name", "Email", "Phone", "Status", "Register Date"];

    // Users data ko formatted rows mein convert karte hain
    const rows = users.map((user, index) => [
      index + 1,
      user.name,
      user.email,
      user.phone,
      user.status === 1 ? "Active" : "Inactive", // Status ko readable text mein convert
      new Date(user.createdAt).toLocaleDateString(), // Date ko formatted string mein
    ]);

    // Headers + rows ko CSV format mein convert karte hain
    const csvContent = [headers, ...rows]
      .map((row) =>
        row
          .map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`) // Special chars ko escape
          .join(","), // Columns ko comma se separate
      )
      .join("\n"); // Rows ko newline se separate

    // CSV content ko Blob mein convert karte hain (file-like object)
    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    // Blob se download URL generate karte hain
    const url = URL.createObjectURL(blob);

    // Temporary link element create karte hain
    const link = document.createElement("a");
    link.href = url;
    link.download = `users-${new Date().toISOString().split("T")[0]}.csv`; // Filename - current date ke saath
    link.click(); // Programmatically click karte hain - file download trigger

    // Memory cleanup - URL ko revoke karte hain
    URL.revokeObjectURL(url);
  };

  /**
   * copyRegistrationLink - Registration link ko clipboard mein copy karte hain
   * Users ko ye link diya ja sakta hai taaki wo register kar sakein
   */
  const copyRegistrationLink = async () => {
    try {
      // Registration URL ko clipboard mein copy karte hain
      await navigator.clipboard.writeText("https://cp.shilpgroup.com/registration");
      // Success message show karte hain
      toast.success("Registration link copied to clipboard");
    } catch {
      // Copy fail ho gaya to error message
      toast.error("Failed to copy registration link");
    }
  };

  /**
   * fetchUsers - API se users list fetch karte hain
   * Page number aur search keyword ke sath pagination support
   */
  const fetchUsers = useCallback(async () => {
    // Backend API call with page and search parameters
    const res = await getUsers({ page, search });

    // Response mein data array aur pagination details hote hain
    setUsers(res.data || res);
    setPagination(res.pagination);
  }, [page, search]);

  /**
   * useEffect - Component mount hone par users load karte hain
   * Page ya search change hone par bhi re-fetch hota hai
   */
  useEffect(() => {
    const loadUsers = async () => {
      await fetchUsers();
    };

    void loadUsers();
  }, [fetchUsers]);

  /**
   * handleDelete - Single user ko delete karte hain
   * Confirmation dialog dikhate hain delete se pehle
   */
  const handleDelete = async (_id: string) => {
    // Confirmation toast show karte hain
    const toastId = toast("Are you sure you want to delete this user?", {
      action: {
        label: "Delete",
        onClick: async () => {
          try {
            // Confirmation dialog ko close karte hain
            toast.dismiss(toastId);

            // Backend API se user delete karte hain
            await deleteUser(_id);

            // Success message
            toast.success("User deleted successfully");

            // Users list ko re-fetch karte hain (updated data)
            fetchUsers();
          } catch {
            toast.error("Failed to delete user");
          }
        },
      },
    });
  };

  /**
   * handleStatus - Single user ka status change karte hain (active/inactive)
   * currentStatus pass karte hain aur toggle hota hai
   */
  const handleStatus = async (_id: string, currentStatus: number) => {
    try {
      // API call se status update karte hain
      const res = await handleStats(_id, currentStatus);
      if (res.success) {
        toast.success("Status updated successfully");
        // List ko refresh karte hain updated status ke saath
        fetchUsers();
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  /**
   * handleBulkStatus - Sab users ka status ek saath change karte hain
   * Sab active ho to deactivate, else activate
   */
  const handleBulkStatus = () => {
    const status = nextBulkStatus;
    const label = status === 1 ? "activate" : "deactivate";
    
    // Confirmation dialog show karte hain
    const toastId = toast(`Are you sure you want to ${label} ALL users?`, {
      action: {
        label: status === 1 ? "Activate All" : "Deactivate All",
        onClick: async () => {
          try {
            // Confirmation dialog ko close karte hain
            toast.dismiss(toastId);

            // Backend API se bulk status update karte hain
            const res = await updateAllUsersStatus(status);

            if (res.success) {
              toast.success(`All users ${label}d successfully`);
              // List ko refresh karte hain
              fetchUsers();
            } else {
              toast.error(`Failed to ${label} all users`);
            }
          } catch {
            toast.error(`Failed to ${label} all users`);
          }
        },
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Users</h1>

        <div className="flex gap-3">
          <button
            onClick={downloadCSV}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          >
            Download CSV
          </button>

          <button
            onClick={copyRegistrationLink}
            className="bg-orange-600 text-white px-5 py-2 rounded-lg shadow hover:bg-orange-700 transition"
          >
            Copy Registration Link
          </button>

          <button
            onClick={handleBulkStatus}
            className={`text-white px-5 py-2 rounded-lg shadow transition ${
              nextBulkStatus === 1
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {nextBulkStatus === 1 ? "Activate All" : "Deactivate All"}
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
