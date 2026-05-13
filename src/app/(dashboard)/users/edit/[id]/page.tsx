"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getUserById, updateUser } from "@/services/user.service";
import { toast } from "sonner";

export default function EditUser() {
  const router = useRouter();
  const { id } = useParams();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    role: "",
  });

  const [logo, setLogo] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(""); // existing logo
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch user
  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUserById(id as string);

      setForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        company: user.company || "",
        role: user.role || "",
      });

      setPreview(user.logo); // existing image
    };

    fetchUser();
  }, [id]);

  // 🔹 Submit
  const handleSubmit = async () => {
    const toastId = toast.loading("Updating user...");
    try {
      setLoading(true);

      await updateUser(id as string, {
        ...form,
        logo,
      });

      toast.success("User updated successfully", { id: toastId });

      router.push("/users");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Update failed", {
        id: toastId,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
      {/* Title */}
      <h1 className="text-xl font-semibold text-gray-900">Edit User</h1>

      <div className="space-y-4">
        {/* Name */}
        <div>
          <label className="text-sm text-gray-600">Name</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full text-black mt-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* Email */}
        <div>
          <label className="text-sm text-gray-600">Email</label>
          <input
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full text-black mt-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* Company */}
        <div>
          <label className="text-sm text-gray-600">Company</label>
          <input
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            className="w-full text-black mt-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="text-sm text-gray-600">Phone</label>
          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full text-black mt-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* Logo Upload */}
        <div>
          <label className="text-sm text-gray-600">Logo</label>

          <label className="flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:border-black transition mt-2">
            <span className="text-sm text-gray-500">
              {logo ? logo.name : "Click to upload new logo"}
            </span>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setLogo(e.target.files?.[0] || null)}
              className="hidden"
            />
          </label>

          {/* Preview */}
          {(logo || preview) && (
            <img
              src={
                logo
                  ? URL.createObjectURL(logo)
                  : `${preview}`
              }
              className="h-26 rounded-2xl object-cover border mt-3"
              referrerPolicy="no-referrer"
            />
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-6 border-t mt-6">
        <button
          onClick={() => router.push("/users")}
          className="px-5 py-2 border rounded-lg hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
        >
          {loading ? "Updating..." : "Update User"}
        </button>
      </div>
    </div>
  );
}
