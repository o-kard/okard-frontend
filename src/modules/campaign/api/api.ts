import { request } from "@/api/api";
import { LikeResp, Campaign, CampaignComment, CampaignCommunity } from "../types/campaign";

const API_PATH = "/api/campaign";
const API_PATH_COMMENT = "/api/comment";
const API_URL = "http://localhost:8000/api/campaign";

export const fetchCampaigns = async (
  category?: string,
  searchQuery?: string,
  sort?: string,
  state?: string,
  clerkId?: string,
  limit?: number,
  offset?: number,
  includeClosed?: boolean,
): Promise<Campaign[]> => {
  const params = new URLSearchParams();
  if (category) params.append("category", category);
  if (searchQuery) params.append("q", searchQuery);
  if (sort) params.append("sort", sort);
  if (state) params.append("state", state);
  if (clerkId) params.append("clerk_id", clerkId);
  if (limit !== undefined) params.append("limit", limit.toString());
  if (offset !== undefined) params.append("offset", offset.toString());
  if (includeClosed !== undefined) params.append("include_closed", includeClosed.toString());

  const qs = params.toString();
  return request<Campaign[]>(`${API_PATH}?${qs}`);
};

// export async function createCampaignWithImages(
//   data: Omit<Campaign, "id" | "user_id">,
//   clerkId: string,
//   files: File[],
// ) {
//   const formData = new FormData();
//   formData.append("campaign_data", JSON.stringify(data));
//   files.forEach((file) => formData.append("images", file));

//   await request(`${API_PATH}/with-images?clerk_id=${clerkId}`, {
//     method: "POST",
//     body: formData,
//   });

//   return true;
// }

export async function createCampaignWithInformations(fd: FormData, clerkId: string) {
  return request(`${API_PATH}/with-informations?clerk_id=${clerkId}`, {
    method: "POST",
    body: fd,
  });
}

export async function updateCampaignWithImages(
  id: string,
  data: Omit<Campaign, "id" | "user_id">,
  clerkId: string,
  files: File[],
) {
  const formData = new FormData();
  formData.append("campaign_data", JSON.stringify(data));
  files.forEach((file) => formData.append("images", file));

  await request(`${API_PATH}/${id}/with-images?clerk_id=${clerkId}`, {
    method: "PUT",
    body: formData,
  });

  return true;
}

export async function deleteCampaign(id: string, clerkId: string) {
  await request(`${API_PATH}/${id}?clerk_id=${clerkId}`, {
    method: "DELETE",
  });
  return true;
}

export async function updateCampaignWithInformations(
  campaignId: string,
  fd: FormData,
  clerkId: string,
) {
  return request(
    `${API_PATH}/${campaignId}/with-informations?clerk_id=${encodeURIComponent(
      clerkId,
    )}`,
    {
      method: "PUT",
      body: fd,
    },
  );
}

// Comment API

export async function createComment(fd: FormData, clerkId: string) {
  return request<CampaignComment>(
    `${API_PATH_COMMENT}?clerk_id=${encodeURIComponent(clerkId)}`,
    {
      method: "POST",
      body: fd,
    },
  );
}

export async function fetchCommentsByCampaignId(campaignId: string, clerk_id: string | null) {
  return request<CampaignComment[]>(
    `${API_PATH_COMMENT}/campaign/${campaignId}?clerk_id=${encodeURIComponent(
      clerk_id || "",
    )}`,
  );
}

export async function likeComment(commentId: string, clerkId: string) {
  return request<LikeResp>(
    `${API_PATH_COMMENT}/${commentId}/like?clerk_id=${encodeURIComponent(
      clerkId,
    )}`,
    {
      method: "PUT",
    },
  );
}

export async function unlikeComment(commentId: string, clerkId: string) {
  return request<LikeResp>(
    `${API_PATH_COMMENT}/${commentId}/like?clerk_id=${encodeURIComponent(
      clerkId,
    )}`,
    {
      method: "DELETE",
    },
  );
}

export async function reorderCampaignImages(
  campaignId: string,
  clerkId: string,
  items: { id: string; order: number }[],
) {
  const fd = new FormData();
  fd.append("images_reorder", JSON.stringify(items));
  return request(
    `${API_PATH}/${campaignId}/with-informations?clerk_id=${encodeURIComponent(
      clerkId,
    )}`,
    { method: "PUT", body: fd },
  );
}

export async function changeCampaignState(
  campaignId: string,
  state: string,
  token: string | null,
) {
  return request<Campaign>(
    `${API_PATH}/${campaignId}/state?state=${encodeURIComponent(state)}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
}
export async function getForYouCampaigns(token: string): Promise<Campaign[]> {
  const data = await request<{
    campaigns: {
      campaign: Campaign;
      score: number;
    }[];
  }>(`${API_PATH}/for-you`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!data || !data.campaigns) {
    throw new Error("Failed to fetch for-you campaigns");
  }

  // Log the full data object for inspection
  console.log("[FOR_YOU] full data:", data);

  data.campaigns.forEach(({ campaign, score }, i) => {
    console.log(
      `[FOR_YOU #${i}] score=${score.toFixed(3)}`,
      campaign.campaign_header,
    );
  });

  return data.campaigns.map((c) => c.campaign);
}

export async function fetchCampaignById(
  campaignId: string,
  token?: string,
): Promise<Campaign> {
  const headers: HeadersInit = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return request<Campaign>(`${API_PATH}/${campaignId}`, {
    headers,
  });
}

export async function fetchCampaignsByUserId(userId: string): Promise<Campaign[]> {
  return request<Campaign[]>(`${API_PATH}/campaign-by-user/${userId}`);
}

export async function getCampaignCommunity(campaignId: string): Promise<CampaignCommunity> {
  return request<CampaignCommunity>(`${API_PATH}/${campaignId}/community`);
}

// Bookmarks API
export async function toggleBookmark(
  campaignId: string,
  token: string | null,
): Promise<{ bookmarked: boolean }> {
  return request<{ bookmarked: boolean }>(`/api/bookmarks/${campaignId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function fetchBookmarks(token: string | null): Promise<Campaign[]> {
  return request<Campaign[]>(`/api/bookmarks/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function fetchRecommendedCampaigns(
  campaignId: string,
  limit: number = 4,
): Promise<{
  source_campaign_id: string;
  recommendations: { campaign_id: string; score: number }[];
}> {
  return request<{
    source_campaign_id: string;
    recommendations: { campaign_id: string; score: number }[];
  }>(`/api/campaign_recommend/${campaignId}/recommend?limit=${limit}`);
}
