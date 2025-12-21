import { HomeCampaignRaw, HomeCampaign, CategoryStats } from "../types/types";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/home`;
const ASSET_BASE = process.env.NEXT_PUBLIC_API_URL;

function resolveUrl(path?: string | null) {
  if (!path) return null
  return `${ASSET_BASE}${path}`
}

export async function getTopPledgedCampaigns(params?: {
  category?: string
  limit?: number
}): Promise<HomeCampaign[]> {
  const query = new URLSearchParams()

  if (params?.category) query.append("category", params.category)
  if (params?.limit) query.append("limit", String(params.limit))

  const res = await fetch(
    `${API_URL}/top-pledged-campaigns?${query.toString()}`,
    { cache: "no-store" }
  )

  if (!res.ok) {
    throw new Error("Failed to fetch top pledged campaigns")
  }

  const data: HomeCampaignRaw[] = await res.json()

  return data.map((c) => ({
    id: c.id,
    category: c.category,
    post_header: c.post_header,
    post_description : c.post_description,
    goal_amount: c.goal_amount,
    current_amount: c.current_amount,
    progress: c.progress,

    coverImageUrl: resolveUrl(c.images?.[0]?.path),
    creatorName: c.creator.name,
    creatorAvatarUrl: resolveUrl(c.creator.avatar),
  }))
}

export async function getCategoryStats(): Promise<CategoryStats[]> {
  const res = await fetch(`${API_URL}/category-stats`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch category stats");
  }

  return res.json();
}

