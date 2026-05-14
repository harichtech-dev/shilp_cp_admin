// "use client";

// import { useAuth } from "@/hooks/useAuth";
// import { getDashboardStats } from "@/services/dashboard.service";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";

// export default function page() {
//   const router = useRouter();
//   useAuth();
//   const [stats, setStats] = useState({
//     users: 0,
//     imageTemplates: 0,
//     videoTemplates: 0,
//   });

//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         const data = await getDashboardStats();
//         setStats(data);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchStats();
//   }, []);

//   return (
//     <div className="bg-gray-100">
//       {/* Header */}
//       <h1 className="text-2xl font-bold mb-6 text-gray-800">Dashboard</h1>

//       {/* Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

//         {/* Users */}
//         <div
//           className="cursor-pointer bg-white p-6 rounded-2xl shadow hover:shadow-lg transition"
//           onClick={() => router.push("/users")}
//         >
//           <h2 className="text-sm text-gray-500">Total Users</h2>
//           <p className="text-3xl font-bold text-black mt-2">
//             {loading ? "..." : stats.users}
//           </p>
//         </div>

//         {/* Image Templates */}
//         <div
//           className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition"
//           onClick={() => router.push("/image-template")}
//         >
//           <h2 className="text-sm text-gray-500">Image Templates</h2>
//           <p className="text-3xl font-bold text-black mt-2">
//             {loading ? "..." : stats.imageTemplates}
//           </p>
//         </div>

//         {/* Video Templates */}
//         <div
//           className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition"
//           onClick={() => router.push("/video-template")}
//         >
//           <h2 className="text-sm text-gray-500">Video Templates</h2>
//           <p className="text-3xl font-bold text-black mt-2">
//             {loading ? "..." : stats.videoTemplates}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useAuth } from "@/hooks/useAuth";
import {
  getDashboardStats,
  getDeliveryVolume,
  type DeliveryVolume,
} from "@/services/dashboard.service";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Chart,
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  LinearScale,
  Tooltip,
  Filler,
} from "chart.js";

Chart.register(
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  LinearScale,
  Tooltip,
  Filler,
);

/**
 * Formats "2026-05-08" → "May 8" for short display,
 * or "Mon" / "Day N" for 7-day range.
 */
function formatLabel(dateStr: string, totalDays: number): string {
  if (totalDays === 7) {
    const day = new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "short",
      timeZone: "UTC",
    });
    return day; // "Mon", "Tue" …
  }
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }); // "May 8"
}

export default function Page() {
  const router = useRouter();
  useAuth();

  // ── Stat cards ──────────────────────────────────────────────────────────
  const [stats, setStats] = useState({
    users: 0,
    imageTemplates: 0,
    videoTemplates: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  // ── Delivery volume ─────────────────────────────────────────────────────
  const [range, setRange] = useState<7 | 14 | 30>(7);
  const [volumeData, setVolumeData] = useState<DeliveryVolume | null>(null);
  const [volumeLoading, setVolumeLoading] = useState(true);
  const [volumeError, setVolumeError] = useState(false);

  const volRef = useRef<HTMLCanvasElement>(null);
  const volChart = useRef<Chart | null>(null);

  // ── Fetch stats ─────────────────────────────────────────────────────────
  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setStatsLoading(false));
  }, []);

  // ── Fetch delivery volume whenever range changes ─────────────────────────
  // useEffect(() => {
  //   setVolumeLoading(true);
  //   setVolumeError(false);
  //   getDeliveryVolume(range)
  //     .then(setVolumeData)
  //     .catch(() => setVolumeError(true))
  //     .finally(() => setVolumeLoading(false));
  // }, [range]);

useEffect(() => {
  (async () => {
    try {
      setVolumeLoading(true);
      setVolumeError(false);

      const data = await getDeliveryVolume(range);

      setVolumeData(data);
    } catch {
      setVolumeError(true);
    } finally {
      setVolumeLoading(false);
    }
  })();
}, [range]);

  // ── Render / update chart whenever volumeData changes ───────────────────
  useEffect(() => {
    if (!volRef.current || !volumeData) return;

    const labels = volumeData.labels.map((l) => formatLabel(l, range));

    if (volChart.current) {
      // Update existing chart in place (no flicker)
      volChart.current.data.labels = labels;
      volChart.current.data.datasets[0].data = volumeData.image;
      volChart.current.data.datasets[1].data = volumeData.video;
      volChart.current.update();
      return;
    }

    volChart.current = new Chart(volRef.current, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Image",
            data: volumeData.image,
            borderColor: "#378ADD",
            backgroundColor: "rgba(55,138,221,0.07)",
            tension: 0.4,
            pointRadius: 3,
            fill: true,
            borderWidth: 2,
          },
          {
            label: "Video",
            data: volumeData.video,
            borderColor: "#1D9E75",
            backgroundColor: "rgba(29,158,117,0.06)",
            tension: 0.4,
            pointRadius: 3,
            fill: true,
            borderWidth: 2,
            borderDash: [4, 3],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { mode: "index", intersect: false },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              font: { size: 11 },
              color: "#888",
              autoSkip: range > 14,
              maxRotation: 0,
            },
          },
          y: {
            grid: { color: "rgba(128,128,128,0.1)" },
            ticks: { font: { size: 11 }, color: "#888", precision: 0 },
            beginAtZero: true,
          },
        },
      },
    });

    return () => {
      volChart.current?.destroy();
      volChart.current = null;
    };
  }, [volumeData, range]);

  // ── Totals from volume data (for mini summary) ───────────────────────────
  const totalImage = volumeData?.image.reduce((a, b) => a + b, 0) ?? 0;
  const totalVideo = volumeData?.video.reduce((a, b) => a + b, 0) ?? 0;

  return (
    <div className="bg-gray-100">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Dashboard</h1>

      {/* ── Stat Cards ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div
          className="cursor-pointer bg-white p-6 rounded-2xl shadow hover:shadow-lg transition"
          onClick={() => router.push("/users")}
        >
          <h2 className="text-sm text-gray-500">Total Users</h2>
          <p className="text-3xl font-bold text-black mt-2">
            {statsLoading ? "..." : stats.users}
          </p>
        </div>
        <div
          className="cursor-pointer bg-white p-6 rounded-2xl shadow hover:shadow-lg transition"
          onClick={() => router.push("/image-template")}
        >
          <h2 className="text-sm text-gray-500">Image Templates</h2>
          <p className="text-3xl font-bold text-black mt-2">
            {statsLoading ? "..." : stats.imageTemplates}
          </p>
        </div>
        <div
          className="cursor-pointer bg-white p-6 rounded-2xl shadow hover:shadow-lg transition"
          onClick={() => router.push("/video-template")}
        >
          <h2 className="text-sm text-gray-500">Video Templates</h2>
          <p className="text-3xl font-bold text-black mt-2">
            {statsLoading ? "..." : stats.videoTemplates}
          </p>
        </div>
      </div>

      {/* ── Delivery Volume Chart ─────────────────────────────────────── */}
      <div className="bg-white p-6 rounded-2xl shadow">
        {/* Card header */}
        <div className="flex items-start justify-between mb-1">
          <div>
            <h2 className="text-sm font-semibold text-gray-800">
              Template creation trend
            </h2>
            <p className="text-xs text-gray-400">
              Image vs video templates added per day
            </p>
          </div>

          {/* Range toggle */}
          <div className="flex gap-1">
            {([7, 14, 30] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`text-xs px-3 py-1 rounded-lg border transition ${
                  range === r
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                }`}
              >
                {r}d
              </button>
            ))}
          </div>
        </div>

        {/* Legend + totals */}
        <div className="flex items-center gap-6 mt-3 mb-4">
          <span className="flex items-center gap-1.5 text-xs text-gray-500">
            <span
              className="w-3 h-2 rounded-sm inline-block"
              style={{ background: "#378ADD" }}
            />
            Image
            {!volumeLoading && (
              <span className="ml-1 font-medium text-gray-700">
                {totalImage}
              </span>
            )}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-gray-500">
            <span
              className="w-3 h-2 rounded-sm inline-block"
              style={{ background: "#1D9E75" }}
            />
            Video
            {!volumeLoading && (
              <span className="ml-1 font-medium text-gray-700">
                {totalVideo}
              </span>
            )}
          </span>
        </div>

        {/* Chart area */}
        <div className="relative h-56">
          {volumeLoading && (
            <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-400">
              Loading...
            </div>
          )}
          {volumeError && !volumeLoading && (
            <div className="absolute inset-0 flex items-center justify-center text-sm text-red-400">
              Failed to load data. Please try again.
            </div>
          )}
          <canvas
            ref={volRef}
            className={
              volumeLoading || volumeError ? "opacity-0" : "opacity-100"
            }
          />
        </div>
      </div>
    </div>
  );
}
