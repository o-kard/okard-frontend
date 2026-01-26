import { PostSummary } from "@/modules/post/types/post";
import { CategoryStats } from "../types/types";

const API_URL_Home = `${process.env.NEXT_PUBLIC_API_URL}/api/home`;
const ASSET_BASE = process.env.NEXT_PUBLIC_API_URL;

export async function getTopPledgedCampaigns(params?: {
  category?: string;
  limit?: number;
}): Promise<PostSummary[]> {
  const query = new URLSearchParams();

  if (params?.category) query.append("category", params.category);
  if (params?.limit) query.append("limit", String(params.limit));

  const res = await fetch(
    `${API_URL_Home}/top-pledged-campaigns?${query.toString()}`,
    { cache: "no-store" },
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
