import { Country } from "../types/country";
import { request } from "../../../api/api";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/country`;

export function getCountryList(opts?: { signal?: AbortSignal }) {
  return request<Country[]>("/api/country", { signal: opts?.signal });
}