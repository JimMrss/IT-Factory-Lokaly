import axios, { AxiosInstance } from "axios";

const BASE_URL: string = "https://api-lokaly.events-boc.fr";
const LOCAL_URL: string = "http://localhost:8000";

export const api: AxiosInstance = axios.create({
  baseURL: LOCAL_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});