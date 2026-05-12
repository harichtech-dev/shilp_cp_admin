"use client";

import { login } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import Image from "next/image";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    if (!password) {
      toast.error("Please enter your password");
      return;
    }

    try {
      setLoading(true);

      const res = await login({ email, password });
      setUser(res.admin);

      toast.success("Login Successfully");

      router.push("/dashboard");
    } catch (error) {
      console.log(error)
      toast.error(
        (error as any)?.response?.data?.message || "Invalid credentials",
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex">
      {/* Left — property image */}
      <div className="hidden lg:flex lg:flex-[1.2] relative overflow-hidden bg-black">
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <Image
            src="/1709012973-logo.webp"
            alt="logo"
            width={320}
            height={100}
            className="object-contain"
            priority
          />
        </div>

        {/* Admin portal badge */}
        <div className="absolute top-10 left-10 z-10">
          <span className="inline-block bg-white/10 border border-white/20 rounded-full px-3 py-1 text-[10px] font-medium text-white/70 tracking-widest uppercase">
            Channel Partner Admin Panel
          </span>
        </div>

        {/* bottom content */}
        <div className="absolute bottom-10 left-10 right-10 z-10">
          <h1 className="text-2xl font-semibold text-white leading-snug mb-2">
            Find the perfect
            <br />
            home for everyone.
          </h1>
          <p className="text-sm font-light text-white/50 leading-relaxed">
            Manage listings, send brochures &amp; close deals — all in one
            place.
          </p>
        </div>
      </div>

      {/* Right — login form */}
      <div className="flex flex-1 items-center justify-center bg-white px-8 py-12">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-10">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <svg
                className="w-4 h-4 stroke-white fill-none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-gray-900 tracking-tight">
              Channel Partner Admin Panel
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-2xl font-semibold text-gray-900 mb-1">
            Welcome back
          </h2>
          <p className="text-sm font-light text-gray-400 mb-8">
            Sign in to your admin account
          </p>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-400 mb-1.5 tracking-wide">
              Email address
            </label>
            <input
              type="email"
              placeholder="you@company.com"
              className="w-full px-4 py-3 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 focus:bg-white transition-colors"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="mb-2">
            <label className="block text-xs font-medium text-gray-400 mb-1.5 tracking-wide">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 focus:bg-white transition-colors"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Forgot */}
          {/* <div className="text-right mb-6">
            <button className="text-xs text-gray-400 hover:text-gray-700 transition-colors">
              Forgot password?
            </button>
          </div> */}

          {/* Submit */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-gray-900 text-white text-sm font-medium py-3 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </div>
      </div>
    </div>
  );

  // return (
  //   <div className="min-h-screen flex items-center justify-center bg-gray-100">
  //     <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
  //       {/* Title */}
  //       <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
  //         Admin Login
  //       </h2>

  //       {/* Email */}
  //       <div className="mb-4">
  //         <label className="block text-sm text-gray-600 mb-1">Email</label>
  //         <input
  //           type="email"
  //           placeholder="Enter your email"
  //           className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
  //           onChange={(e) => setEmail(e.target.value)}
  //         />
  //       </div>

  //       {/* Password */}
  //       <div className="mb-6">
  //         <label className="block text-sm text-gray-600 mb-1">Password</label>
  //         <input
  //           type="password"
  //           placeholder="Enter your password"
  //           className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
  //           onChange={(e) => setPassword(e.target.value)}
  //         />
  //       </div>

  //       {/* Button */}
  //       <button
  //         onClick={handleLogin}
  //         disabled={loading}
  //         className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition duration-200 disabled:opacity-50"
  //       >
  //         {loading ? "Logging in..." : "Login"}
  //       </button>
  //     </div>
  //   </div>
  // );
};

export default Login;
