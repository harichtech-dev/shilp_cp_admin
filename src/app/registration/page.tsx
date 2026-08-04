// "use client";

// import Image from "next/image";
// import { useState } from "react";
// import {
//   Building2,
//   Mail,
//   Phone,
//   Upload,
//   User,
//   CheckCircle2,
// } from "lucide-react";
// import { toast } from "sonner";

// export default function ChannelProviderRegistration() {
//   const [loading, setLoading] = useState(false);

//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     company: "",
//   });

//   const [logo, setLogo] = useState<File | null>(null);

//   const [errors, setErrors] = useState<any>({});
//   const [message, setMessage] = useState("");
//   const [success, setSuccess] = useState(false);

//   const handleChange = (e: any) => {
//     setForm({
//       ...form,
//       [e.target.name]: e.target.value,
//     });

//     setErrors({
//       ...errors,
//       [e.target.name]: "",
//     });
//   };

//   const validate = () => {
//     const newErrors: any = {};

//     if (!form.name.trim()) {
//       newErrors.name = "Full name is required";
//     }

//     if (!form.email.trim()) {
//       newErrors.email = "Email is required";
//     } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(form.email)) {
//       newErrors.email = "Invalid email address";
//     }

//     if (!form.phone.trim()) {
//       newErrors.phone = "Mobile number is required";
//     } else if (!/^[0-9]{10}$/.test(form.phone)) {
//       newErrors.phone = "Enter valid 10 digit number";
//     }

//     if (!form.company.trim()) {
//       newErrors.company = "Company name is required";
//     }

//     setErrors(newErrors);

//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e: any) => {
//     e.preventDefault();

//     if (!validate()) return;

//     setLoading(true);
//     setMessage("");

//     try {
//       const formData = new FormData();

//       formData.append("name", form.name);
//       formData.append("email", form.email);
//       formData.append("phone", form.phone);
//       formData.append("company", form.company);

//       if (logo) {
//         formData.append("logo", logo);
//       }

//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/users/public-register`,
//         {
//           method: "POST",
//           body: formData,
//         },
//       );

//       const result = await response.json();

//       if (result.success) {
//         // 🔥 USER ALREADY EXISTS
//         if (result.message === "User already exists") {
//           toast.error("User already exists with this phone/email");

//           setSuccess(false);
//           setMessage(result.message);

//           return;
//         }
//         // ✅ SUCCESS
//         toast.success("Registration successful");

//         setSuccess(true);
//         setMessage(result.message);

//         setForm({
//           name: "",
//           email: "",
//           phone: "",
//           company: "",
//         });

//         setLogo(null);
//       } else {
//         setSuccess(false);
//         setMessage(result.message);
//       }
//     } catch (error) {
//       setSuccess(false);
//       setMessage("Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="relative overflow-hidden bg-[#f4f7fb]">
//       {/* BACKGROUND DESIGN */}
//       <div className="absolute top-0 left-0 w-[400px] h-[200px] bg-blue-200 rounded-full blur-3xl opacity-30 -translate-x-32 -translate-y-32"></div>

//       <div className="absolute bottom-0 right-0 w-[400px] h-[200px] bg-black rounded-full blur-3xl opacity-10 translate-x-32 translate-y-32"></div>

//       <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-2">
//         <div className="w-full max-w-6xl bg-white rounded-[32px] overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.12)] grid lg:grid-cols-2">
//           {/* LEFT SIDE */}
//           <div className="hidden lg:flex relative bg-black text-white p-10 flex-col justify-between">
//             <div>
//               <Image
//                 src="/1709012973-logo.webp"
//                 alt="Shilp"
//                 width={170}
//                 height={70}
//                 className="bg-white p-2 rounded-xl"
//                 priority
//               />
//             </div>

//             <div>
//               <h1 className="text-5xl font-bold leading-tight">
//                 Partner With SHILP
//               </h1>

//               <p className="mt-6 text-gray-300 text-lg leading-8">
//                 Join our trusted channel partner network and grow your business
//                 with SHILP Building Excellence.
//               </p>

//               <div className="mt-6 space-y-5">
//                 <div className="flex items-center gap-4">
//                   <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
//                     <Building2 size={22} />
//                   </div>

//                   <div>
//                     <h3 className="font-semibold text-lg">Trusted Brand</h3>

//                     <p className="text-gray-400 text-sm">
//                       Work with one of the leading companies.
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-4">
//                   <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
//                     <CheckCircle2 size={22} />
//                   </div>

//                   <div>
//                     <h3 className="font-semibold text-lg">Easy Registration</h3>

//                     <p className="text-gray-400 text-sm">
//                       Simple and quick onboarding process.
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <p className="text-gray-500 text-sm">
//               © 2026 SHILP. All rights reserved.
//             </p>
//           </div>

//           {/* RIGHT SIDE */}
//           <div className="p-8 md:p-10 bg-white">
//             {/* MOBILE LOGO */}
//             <div className="flex justify-center lg:hidden mb-8">
//               <Image
//                 src="/1709012973-logo.webp"
//                 alt="Shilp"
//                 width={140}
//                 height={60}
//                 priority
//               />
//             </div>

//             <div className="mb-6">
//               <h2 className="text-3xl font-bold text-gray-900">Registration</h2>

//               <p className="text-gray-500 mt-2 text-base">
//                 Fill in your company details to become a channel partner.
//               </p>
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-4">
//               {/* NAME */}
//               <div>
//                 <label className="text-sm font-semibold text-gray-700 mb-2 block">
//                   Full Name
//                 </label>

//                 <div
//                   className={`flex items-center border rounded-2xl px-4 h-12 transition ${
//                     errors.name
//                       ? "border-red-500"
//                       : "border-gray-200 focus-within:border-black"
//                   }`}
//                 >
//                   <User size={18} className="text-gray-400" />

//                   <input
//                     type="text"
//                     name="name"
//                     value={form.name}
//                     onChange={handleChange}
//                     placeholder="Enter your full name"
//                     className="w-full h-full px-3 outline-none bg-transparent"
//                   />
//                 </div>

//                 {errors.name && (
//                   <p className="text-red-500 text-sm mt-1">{errors.name}</p>
//                 )}
//               </div>

//               {/* EMAIL */}
//               <div>
//                 <label className="text-sm font-semibold text-gray-700 mb-2 block">
//                   Email Address
//                 </label>

//                 <div
//                   className={`flex items-center border rounded-2xl px-4 h-12 transition ${
//                     errors.email
//                       ? "border-red-500"
//                       : "border-gray-200 focus-within:border-black"
//                   }`}
//                 >
//                   <Mail size={18} className="text-gray-400" />

//                   <input
//                     type="email"
//                     name="email"
//                     value={form.email}
//                     onChange={handleChange}
//                     placeholder="Enter your email"
//                     className="w-full h-full px-3 outline-none bg-transparent"
//                   />
//                 </div>

//                 {errors.email && (
//                   <p className="text-red-500 text-sm mt-1">{errors.email}</p>
//                 )}
//               </div>

//               {/* PHONE */}
//               <div>
//                 <label className="text-sm font-semibold text-gray-700 mb-2 block">
//                   Mobile Number
//                 </label>

//                 <div
//                   className={`flex items-center border rounded-2xl px-4 h-12 transition ${
//                     errors.phone
//                       ? "border-red-500"
//                       : "border-gray-200 focus-within:border-black"
//                   }`}
//                 >
//                   <Phone size={18} className="text-gray-400" />

//                   <input
//                     type="text"
//                     name="phone"
//                     value={form.phone}
//                     onChange={handleChange}
//                     placeholder="Enter mobile number"
//                     className="w-full h-full px-3 outline-none bg-transparent"
//                   />
//                 </div>

//                 {errors.phone && (
//                   <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
//                 )}
//               </div>

//               {/* COMPANY */}
//               <div>
//                 <label className="text-sm font-semibold text-gray-700 mb-2 block">
//                   Company Name
//                 </label>

//                 <div
//                   className={`flex items-center border rounded-2xl px-4 h-12 transition ${
//                     errors.company
//                       ? "border-red-500"
//                       : "border-gray-200 focus-within:border-black"
//                   }`}
//                 >
//                   <Building2 size={18} className="text-gray-400" />

//                   <input
//                     type="text"
//                     name="company"
//                     value={form.company}
//                     onChange={handleChange}
//                     placeholder="Enter company name"
//                     className="w-full h-full px-3 outline-none bg-transparent"
//                   />
//                 </div>

//                 {errors.company && (
//                   <p className="text-red-500 text-sm mt-1">
//                     {errors.company}
//                   </p>
//                 )}
//               </div>

//               {/* LOGO */}
//               <div>
//                 <label className="text-sm font-semibold text-gray-700 mb-2 block">
//                   Company Logo
//                 </label>

//                 <label className="border-2 border-dashed border-gray-300 rounded-2xl px-4 py-3 flex items-center gap-3 cursor-pointer hover:border-black transition">
//                   <Upload size={18} className="text-gray-500 shrink-0" />
//                   <div>
//                     <p className="font-medium text-gray-700 text-sm">
//                       Upload Company Logo
//                     </p>
//                     <p className="text-xs text-gray-400">PNG, JPG or WEBP</p>
//                   </div>

//                   {logo && (
//                     <p className="text-sm text-black mt-3 font-medium">
//                       {logo.name}
//                     </p>
//                   )}

//                   <input
//                     type="file"
//                     accept="image/*"
//                     hidden
//                     onChange={(e: any) => setLogo(e.target.files[0])}
//                   />
//                 </label>
//               </div>

//               {/* BUTTON */}
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full h-12 rounded-2xl bg-black hover:bg-gray-900 text-white font-semibold text-lg transition duration-300 shadow-lg hover:shadow-2xl"
//               >
//                 {loading ? "Submitting..." : "Register Now"}
//               </button>

//               {/* MESSAGE */}
//               {message && (
//                 <div
//                   className={`text-center text-sm font-medium ${
//                     success ? "text-green-600" : "text-red-500"
//                   }`}
//                 >
//                   {message}
//                 </div>
//               )}
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

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
  ArrowRight,
  Shield,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";

export default function ChannelProviderRegistration() {
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(5);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
  });

  const [logo, setLogo] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Full name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(form.email))
      newErrors.email = "Invalid email address";
    if (!form.phone.trim()) newErrors.phone = "Mobile number is required";
    else if (!/^[0-9]{10}$/.test(form.phone))
      newErrors.phone = "Enter valid 10 digit number";
    if (!form.company.trim()) newErrors.company = "Company name is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("phone", form.phone);
      formData.append("company", form.company);
      if (logo) formData.append("logo", logo);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/public-register`,
        { method: "POST", body: formData },
      );
      const result = await response.json();

      if (result.success) {
        if (result.message === "User already exists") {
          toast.error("User already exists with this phone/email");
          setSuccess(false);
          setMessage(result.message);
          return;
        }
        toast.success("Registration successful");
        setSuccess(true);
        setMessage(result.message);
        setForm({ name: "", email: "", phone: "", company: "" });
        setLogo(null);
        let seconds = 5;

        setCountdown(seconds);
        const timer = setInterval(() => {
          seconds--;

          setCountdown(seconds);

          if (seconds === 0) {
            clearInterval(timer);
            window.location.href = "https://shilp.co.in";
          }
        }, 1000);
      } else {
        setSuccess(false);
        setMessage(result.message);
      }
    } catch {
      setSuccess(false);
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
      setForm({ name: "", email: "", phone: "", company: "" });
    }
  };

  const inputWrapClass = (field: string) =>
    `flex items-center gap-3 h-11 px-4 rounded-xl border transition-all duration-200 ${
      errors[field]
        ? "border-red-400 bg-red-50"
        : focusedField === field
          ? "border-zinc-900 bg-zinc-50 ring-2 ring-zinc-900/10"
          : "border-zinc-200 bg-zinc-50"
    }`;

  const iconColor = (field: string) =>
    errors[field]
      ? "text-red-400"
      : focusedField === field
        ? "text-zinc-900"
        : "text-zinc-300";

  const labelClass =
    "block text-[10px] font-semibold uppercase tracking-widest text-zinc-500 mb-1.5";

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl shadow-black/10 border border-black/5 grid grid-cols-1 lg:grid-cols-2">
        {/* ══════════════ LEFT PANEL ══════════════ */}
        <div className="hidden lg:flex relative bg-zinc-950 text-white flex-col justify-between p-8 sm:p-10 overflow-hidden">
          {/* Dot grid background */}
          <div className="bg-[radial-gradient(circle,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:26px_26px]" />

          {/* Logo */}
          <div className="relative z-10">
            <div className="inline-flex rounded-xl px-3 py-2">
              <Image
                src="/shilp identity-white.png"
                alt="Shilp"
                width={130}
                height={50}
                priority
              />
            </div>
          </div>

          {/* Main content */}
          <div className="relative z-10 mt-10 lg:mt-0">
            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-4 font-sans p-3">
             To Growth Partners

             
            </h1>

            <p className="text-sm text-white/40 leading-relaxed mb-7 font-light">
             Get customized reels and creatives delivered directly for your ready reference. Only one time data required.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              {[
                { n: "55+", l: "Projects" },
                { n: "22+", l: "Years of Experience" },
                { n: "20+", l: "Million Sqr. feet" },
              ].map((s) => (
                <div
                  key={s.l}
                  className="flex flex-col items-center py-3 px-2 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] transition-colors"
                >
                  <span className="text-lg font-bold font-sans">{s.n}</span>
                  <span className="text-[9px] text-white/30 uppercase tracking-wider mt-0.5">
                    {s.l}
                  </span>
                </div>
              ))}
            </div>

            {/* Feature cards — hidden on tablet, shown on desktop */}
            <div className="hidden lg:flex flex-col gap-2">
              {[
                {
                  Icon: TrendingUp,
                  title: "Latest Updates",
                  desc: "Receive new launches and project information directly.",
                },
              ].map((f) => (
                <div
                  key={f.title}
                  className="flex items-start gap-3 p-3.5 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/[0.08] flex items-center justify-center shrink-0">
                    <f.Icon size={15} className="text-white/75" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white mb-0.5">
                      {f.title}
                    </p>
                    <p className="text-xs text-white/35 leading-relaxed">
                      {f.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="relative z-10 text-[11px] text-white/20 mt-8 lg:mt-4">
            © 2026 SHILP. All rights reserved.
          </p>
        </div>

        {/* ══════════════ RIGHT PANEL ══════════════ */}
        <div className="bg-white flex flex-col justify-center p-8 sm:p-10 lg:col-span-1 col-span-2">
          {/* Mobile-only logo */}
          <div className="flex justify-center mb-7 lg:hidden">
            <Image
              src="/1709012973-logo.webp"
              alt="Shilp"
              width={120}
              height={46}
              priority
            />
          </div>

          {/* Heading */}
          <div className="mb-7">
            {/* <div className="w-8 h-[3px] bg-zinc-900 rounded-full mb-4" /> */}
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 font-sans mb-1.5">
              Create Account
            </h2>
            <p className="text-sm text-zinc-400">
              Fill in your details to become a channel partner.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Full Name */}
            <div>
              <label className={labelClass}>Full Name</label>
              <div className={inputWrapClass("name")}>
                <User size={14} className={iconColor("name")} />
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Anderson"
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField(null)}
                  className="flex-1 bg-transparent outline-none text-sm text-zinc-800 placeholder:text-zinc-300"
                />
              </div>
              {errors.name && (
                <p className="text-xs text-red-500 mt-1 ml-0.5">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className={labelClass}>Email Address</label>
              <div className={inputWrapClass("email")}>
                <Mail size={14} className={iconColor("email")} />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="john@company.com"
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  className="flex-1 bg-transparent outline-none text-sm text-zinc-800 placeholder:text-zinc-300"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 mt-1 ml-0.5">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className={labelClass}>Mobile</label>

              <div className={inputWrapClass("phone")}>
                <Phone size={14} className={iconColor("phone")} />

                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="9876543210"
                  onFocus={() => setFocusedField("phone")}
                  onBlur={() => setFocusedField(null)}
                  className="flex-1 bg-transparent outline-none text-sm text-zinc-800 placeholder:text-zinc-300"
                />
              </div>

              {errors.phone && (
                <p className="text-xs text-red-500 mt-1 ml-0.5">
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Company */}
            <div>
              <label className={labelClass}>Company</label>

              <div className={inputWrapClass("company")}>
                <Building2 size={14} className={iconColor("company")} />

                <input
                  type="text"
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  placeholder="Acme Corporation"
                  onFocus={() => setFocusedField("company")}
                  onBlur={() => setFocusedField(null)}
                  className="flex-1 bg-transparent outline-none text-sm text-zinc-800 placeholder:text-zinc-300"
                />
              </div>

              {errors.company && (
                <p className="text-xs text-red-500 mt-1 ml-0.5">
                  {errors.company}
                </p>
              )}
            </div>

            {/* Logo Upload */}
            <div>
              <label className={labelClass}>
                Company Logo{" "}
                <span className="text-zinc-300 normal-case tracking-normal font-normal">
                  (optional)
                </span>
              </label>
              <label className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed border-zinc-200 bg-zinc-50 hover:border-zinc-900 hover:bg-zinc-100 transition-all cursor-pointer">
                <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center shrink-0">
                  <Upload size={14} className="text-zinc-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-zinc-700 truncate">
                    {logo ? logo.name : "Upload Company Logo"}
                  </p>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    PNG, JPG or WEBP · Max 5MB
                  </p>
                </div>
                {logo && (
                  <CheckCircle2 size={16} className="text-green-600 shrink-0" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setLogo(e.target.files?.[0] ?? null)
                  }
                />
              </label>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 active:scale-[0.99] text-white text-sm font-semibold tracking-wide transition-all duration-200 hover:shadow-xl hover:shadow-black/20 disabled:opacity-60 disabled:cursor-not-allowed mt-1"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin shrink-0" />
                  Submitting...
                </>
              ) : (
                <>
                  Register Now
                  <ArrowRight size={16} />
                </>
              )}
            </button>

            {/* Status message */}
            {message && (
              <div
                className={`text-center text-xs font-medium px-4 py-3 rounded-xl border ${
                  success
                    ? "bg-green-50 border-green-200 text-green-700"
                    : "bg-red-50 border-red-200 text-red-600"
                }`}
              >
                <p>{message}</p>

                {success && (
                  <p className="mt-1 text-green-600">
                    Redirecting to SHILP website in {countdown} seconds...
                  </p>
                )}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
