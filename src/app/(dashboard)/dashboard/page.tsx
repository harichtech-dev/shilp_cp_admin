"use client";

import { useAuth } from "@/hooks/useAuth";
import { getDashboardStats } from "@/services/dashboard.service";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function page() {
  const router = useRouter();
  useAuth();
  const [stats, setStats] = useState({
    users: 0,
    imageTemplates: 0,
    videoTemplates: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="bg-gray-100">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Dashboard</h1>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Users */}
        <div
          className="cursor-pointer bg-white p-6 rounded-2xl shadow hover:shadow-lg transition"
          onClick={() => router.push("/users")}
        >
          <h2 className="text-sm text-gray-500">Total Users</h2>
          <p className="text-3xl font-bold text-black mt-2">
            {loading ? "..." : stats.users}
          </p>
        </div>

        {/* Image Templates */}
        <div
          className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition"
          onClick={() => router.push("/image-template")}
        >
          <h2 className="text-sm text-gray-500">Image Templates</h2>
          <p className="text-3xl font-bold text-black mt-2">
            {loading ? "..." : stats.imageTemplates}
          </p>
        </div>

        {/* Video Templates */}
        <div
          className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition"
          onClick={() => router.push("/video-template")}
        >
          <h2 className="text-sm text-gray-500">Video Templates</h2>
          <p className="text-3xl font-bold text-black mt-2">
            {loading ? "..." : stats.videoTemplates}
          </p>
        </div>
      </div>
    </div>
  );
}
