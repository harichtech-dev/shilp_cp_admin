"use client";

import Image from "next/image";
import { useState } from "react";
import {
  Building2,
  Mail,
  Phone,
  Upload,
  User,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

export default function ChannelProviderRegistration() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    companyName: "",
  });

  const [logo, setLogo] = useState<File | null>(null);

  const [errors, setErrors] = useState<any>({});
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  const validate = () => {
    const newErrors: any = {};

    if (!form.name.trim()) {
      newErrors.name = "Full name is required";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(form.email)) {
      newErrors.email = "Invalid email address";
    }

    if (!form.phone.trim()) {
      newErrors.phone = "Mobile number is required";
    } else if (!/^[0-9]{10}$/.test(form.phone)) {
      newErrors.phone = "Enter valid 10 digit number";
    }

    if (!form.companyName.trim()) {
      newErrors.companyName = "Company name is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("phone", form.phone);
      formData.append("companyName", form.companyName);

      if (logo) {
        formData.append("logo", logo);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/public-register`,
        {
          method: "POST",
          body: formData,
        },
      );

      const result = await response.json();

      if (result.success) {
        // 🔥 USER ALREADY EXISTS
        if (result.message === "User already exists") {
          toast.error("User already exists with this phone/email");

          setSuccess(false);
          setMessage(result.message);

          return;
        }
        // ✅ SUCCESS
        toast.success("Registration successful");

        setSuccess(true);
        setMessage(result.message);

        setForm({
          name: "",
          email: "",
          phone: "",
          companyName: "",
        });

        setLogo(null);
      } else {
        setSuccess(false);
        setMessage(result.message);
      }
    } catch (error) {
      setSuccess(false);
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden bg-[#f4f7fb]">
      {/* BACKGROUND DESIGN */}
      <div className="absolute top-0 left-0 w-[400px] h-[200px] bg-blue-200 rounded-full blur-3xl opacity-30 -translate-x-32 -translate-y-32"></div>

      <div className="absolute bottom-0 right-0 w-[400px] h-[200px] bg-black rounded-full blur-3xl opacity-10 translate-x-32 translate-y-32"></div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-2">
        <div className="w-full max-w-6xl bg-white rounded-[32px] overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.12)] grid lg:grid-cols-2">
          {/* LEFT SIDE */}
          <div className="hidden lg:flex relative bg-black text-white p-10 flex-col justify-between">
            <div>
              <Image
                src="/1709012973-logo.webp"
                alt="Shilp"
                width={170}
                height={70}
                className="bg-white p-2 rounded-xl"
                priority
              />
            </div>

            <div>
              <h1 className="text-5xl font-bold leading-tight">
                Partner With SHILP
              </h1>

              <p className="mt-6 text-gray-300 text-lg leading-8">
                Join our trusted channel partner network and grow your business
                with SHILP Building Excellence.
              </p>

              <div className="mt-6 space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                    <Building2 size={22} />
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg">Trusted Brand</h3>

                    <p className="text-gray-400 text-sm">
                      Work with one of the leading companies.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                    <CheckCircle2 size={22} />
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg">Easy Registration</h3>

                    <p className="text-gray-400 text-sm">
                      Simple and quick onboarding process.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-gray-500 text-sm">
              © 2026 SHILP. All rights reserved.
            </p>
          </div>

          {/* RIGHT SIDE */}
          <div className="p-8 md:p-10 bg-white">
            {/* MOBILE LOGO */}
            <div className="flex justify-center lg:hidden mb-8">
              <Image
                src="/1709012973-logo.webp"
                alt="Shilp"
                width={140}
                height={60}
                priority
              />
            </div>

            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-900">Registration</h2>

              <p className="text-gray-500 mt-2 text-base">
                Fill in your company details to become a channel partner.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* NAME */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Full Name
                </label>

                <div
                  className={`flex items-center border rounded-2xl px-4 h-12 transition ${
                    errors.name
                      ? "border-red-500"
                      : "border-gray-200 focus-within:border-black"
                  }`}
                >
                  <User size={18} className="text-gray-400" />

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full h-full px-3 outline-none bg-transparent"
                  />
                </div>

                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              {/* EMAIL */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Email Address
                </label>

                <div
                  className={`flex items-center border rounded-2xl px-4 h-12 transition ${
                    errors.email
                      ? "border-red-500"
                      : "border-gray-200 focus-within:border-black"
                  }`}
                >
                  <Mail size={18} className="text-gray-400" />

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full h-full px-3 outline-none bg-transparent"
                  />
                </div>

                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* PHONE */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Mobile Number
                </label>

                <div
                  className={`flex items-center border rounded-2xl px-4 h-12 transition ${
                    errors.phone
                      ? "border-red-500"
                      : "border-gray-200 focus-within:border-black"
                  }`}
                >
                  <Phone size={18} className="text-gray-400" />

                  <input
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Enter mobile number"
                    className="w-full h-full px-3 outline-none bg-transparent"
                  />
                </div>

                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>

              {/* COMPANY */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Company Name
                </label>

                <div
                  className={`flex items-center border rounded-2xl px-4 h-12 transition ${
                    errors.companyName
                      ? "border-red-500"
                      : "border-gray-200 focus-within:border-black"
                  }`}
                >
                  <Building2 size={18} className="text-gray-400" />

                  <input
                    type="text"
                    name="companyName"
                    value={form.companyName}
                    onChange={handleChange}
                    placeholder="Enter company name"
                    className="w-full h-full px-3 outline-none bg-transparent"
                  />
                </div>

                {errors.companyName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.companyName}
                  </p>
                )}
              </div>

              {/* LOGO */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Company Logo
                </label>

                <label className="border-2 border-dashed border-gray-300 rounded-2xl px-4 py-3 flex items-center gap-3 cursor-pointer hover:border-black transition">
                  <Upload size={18} className="text-gray-500 shrink-0" />
                  <div>
                    <p className="font-medium text-gray-700 text-sm">
                      Upload Company Logo
                    </p>
                    <p className="text-xs text-gray-400">PNG, JPG or WEBP</p>
                  </div>

                  {logo && (
                    <p className="text-sm text-black mt-3 font-medium">
                      {logo.name}
                    </p>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e: any) => setLogo(e.target.files[0])}
                  />
                </label>
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-2xl bg-black hover:bg-gray-900 text-white font-semibold text-lg transition duration-300 shadow-lg hover:shadow-2xl"
              >
                {loading ? "Submitting..." : "Register Now"}
              </button>

              {/* MESSAGE */}
              {message && (
                <div
                  className={`text-center text-sm font-medium ${
                    success ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {message}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
