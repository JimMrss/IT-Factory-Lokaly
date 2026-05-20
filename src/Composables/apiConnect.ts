import axios, { AxiosInstance } from "axios";

const BASE_URL: string = "http://localhost:8000";

export const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});