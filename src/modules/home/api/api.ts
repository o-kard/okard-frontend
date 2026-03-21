import { CampaignSummary } from "@/modules/campaign/types/campaign";
import { CategoryStats } from "../types/types";

const API_URL_Home = `${process.env.NEXT_PUBLIC_API_URL}/api/home`;
const ASSET_BASE = process.env.NEXT_PUBLIC_API_URL;

export async function getTopPledgedCampaigns(params?: {
  category?: string;
  limit?: number;
  token?: string;
}): Promise<CampaignSummary[]> {
  const query = new URLSearchParams();

  if (params?.category) query.append("category", params.category);
  if (params?.limit) query.append("limit", String(params.limit));

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (params?.token) {
    headers["Authorization"] = `Bearer ${params.token}`;
  }

  const res = await fetch(
    `${API_URL_Home}/top-pledged-campaigns?${query.toString()}`,
    {
      cache: "no-store",
      headers,
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch top pledged campaigns");
  }

  return res.json();
}

export async function getCategoryStats(): Promise<CategoryStats[]> {
  const res = await fetch(`${API_URL_Home}/category-stats`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch category stats");
  }

  return res.json();
}
