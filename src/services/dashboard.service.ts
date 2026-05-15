import { api } from "./api";

export interface DeliveryVolume {
  labels: string[]; // ["2026-05-08", "2026-05-09", ...]
  image: number[]; // daily image template creation counts
  video: number[]; // daily video template creation counts
}

export interface MonthlyMessages {
  labels: string[];
  image: number[];
  video: number[];
}

export const getDashboardStats = async () => {
  const res = await api.get("/dashboard/dashboard");
  return res.data;
};

export const getDeliveryVolume = async (
  days: 7 | 14 | 30 = 7,
): Promise<DeliveryVolume> => {
  const { data } = await api.get(`/dashboard/delivery-volume`, {
    params: { days },
  });
  return data.data;
};

export const getMonthlyMessages =
  async (): Promise<MonthlyMessages> => {
    const { data } = await api.get(
      "/dashboard/monthly-messages"
    );

    return data.data;
  };