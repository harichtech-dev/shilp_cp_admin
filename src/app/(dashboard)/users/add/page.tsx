"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUser } from "@/services/user.service";
import { toast } from "sonner";

export default function AddUser() {
  const router = useRouter();
  const [errors, setErrors] = useState<any>({});

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
  });

  const [logo, setLogo] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors: any = {};

    if (!form.name) newErrors.name = "Name is required";
    if (!form.email) newErrors.email = "Email is required";
    if (!form.company) newErrors.company = "Company is required";
    if (!form.phone) newErrors.phone = "Phone is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    const toastId = toast.loading("Creating user..."); // 👈 loading

    try {
      setLoading(true);

      await createUser({
        ...form,
        logo,
      });

      toast.success("User created successfully", { id: toastId });

      router.push("/users");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.errors?.[0] || "Failed to create user", {
        id: toastId,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
      {/* Title */}
      <h1 className="text-xl font-semibold text-gray-900">Add New User</h1>

      {/* Form */}
      <div className="space-y-4">
        {/* Name */}
        <div>
          <label className="text-sm text-gray-600">Name</label>
          <input
            type="text"
            placeholder="Enter name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full text-black mt-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="text-sm text-gray-600">Email</label>
          <input
            type="email"
            placeholder="Enter email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full text-black mt-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        {/* Company */}
        <div>
          <label className="text-sm text-gray-600">Company</label>
          <input
            type="text"
            placeholder="Enter company"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            className="w-full text-black mt-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />
          {errors.company && (
            <p className="text-red-500 text-xs mt-1">{errors.company}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="text-sm text-gray-600">Phone</label>
          <input
            type="text"
            placeholder="Enter phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full text-black mt-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
          )}
        </div>

        {/* Logo Upload */}
        <div>
          <label className="flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:border-black transition">
            <span className="text-sm text-gray-500">
              {logo ? logo.name : "Click to upload logo"}
            </span>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setLogo(e.target.files?.[0] || null)}
              className="hidden"
            />
          </label>

          {logo && (
            <div className="mt-3">
              <img
                src={URL.createObjectURL(logo)}
                className="w-16 h-16 rounded-full object-cover border"
              />
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-6 border-t mt-6">
        <button
          onClick={() => router.push("/users")}
          className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
        >
          {loading ? "Saving..." : "Save User"}
        </button>
      </div>
    </div>
  );
}
