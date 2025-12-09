import axios from "axios";
import { cookies } from "next/headers";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
  timeout: 5000,
});

export async function getAxiosWithServerCookie() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  axiosInstance.interceptors.request.use((config) => {
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return axiosInstance
}
