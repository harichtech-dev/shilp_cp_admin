import { api } from "./api";

/**
 * DELIVERY VOLUME TYPE - Structure of the chart data.
 * Labels contain dates; image and video arrays contain counts.
 */
export interface DeliveryVolume {
  labels: string[]; // Dates array - ["2026-05-08", "2026-05-09", ...]
  image: number[]; // Daily image sends count
  video: number[]; // Daily video sends count
}

/**
 * MONTHLY MESSAGES TYPE - Monthly chart data
 */
export interface MonthlyMessages {
  labels: string[]; // Month names - ["Jan", "Feb", ...]
  image: number[]; // Monthly image counts
  video: number[]; // Monthly video counts
}

/**
 * GET DASHBOARD STATS - Main dashboard statistics
 * Total users, total messages, success rate etc.
 */
export const getDashboardStats = async () => {
  const res = await api.get("/dashboard/dashboard");
  return res.data;
};

/**
 * GET DELIVERY VOLUME - Message delivery counts for the last N days.
 * Input: days (7, 14, or 30).
 * Output: Chart-ready data with labels and counts.
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
 * GET MONTHLY MESSAGES - Monthly message breakdown for the year.
 * Output: Monthly data for graph display
 */
export const getMonthlyMessages =
  async (): Promise<MonthlyMessages> => {
    const { data } = await api.get(
      "/dashboard/monthly-messages"
    );

    return data.data;
  };