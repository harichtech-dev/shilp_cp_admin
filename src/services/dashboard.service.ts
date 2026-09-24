// dashboard.service.ts - Fetches dashboard statistics and chart data for the
// admin overview page (stat cards plus delivery-volume and monthly graphs).

import { api } from "./api";

/**
 * DELIVERY VOLUME TYPE - Shape of the delivery volume chart data.
 * Labels hold dates, image/video arrays hold the matching daily counts.
 */
export interface DeliveryVolume {
  labels: string[]; // Dates array - ["2026-05-08", "2026-05-09", ...]
  image: number[]; // Daily image sends count
  video: number[]; // Daily video sends count
}

/**
 * MONTHLY MESSAGES TYPE - Shape of the monthly chart data.
 */
export interface MonthlyMessages {
  labels: string[]; // Month names - ["Jan", "Feb", ...]
  image: number[]; // Monthly image counts
  video: number[]; // Monthly video counts
}

/**
 * GET DASHBOARD STATS - Main dashboard statistics.
 * Calls: GET /dashboard/dashboard
 * Returns: totals such as total users, total messages, success rate, etc.
 */
export const getDashboardStats = async () => {
  const res = await api.get("/dashboard/dashboard");
  return res.data;
};

/**
 * GET DELIVERY VOLUME - Message delivery count for the last N days.
 * Calls: GET /dashboard/delivery-volume?days=<n>
 * Parameters: days (7, 14 or 30) - defaults to 7
 * Returns: chart-ready data with labels and per-day counts.
 */
export const getDeliveryVolume = async (
  days: 7 | 14 | 30 = 7,
): Promise<DeliveryVolume> => {
  const { data } = await api.get(`/dashboard/delivery-volume`, {
    params: { days },
  });
  return data.data;
};

/**
 * GET MONTHLY MESSAGES - Monthly breakdown for the whole year.
 * Calls: GET /dashboard/monthly-messages
 * Returns: monthly data for the graph display.
 */
export const getMonthlyMessages =
  async (): Promise<MonthlyMessages> => {
    const { data } = await api.get(
      "/dashboard/monthly-messages"
    );

    return data.data;
  };