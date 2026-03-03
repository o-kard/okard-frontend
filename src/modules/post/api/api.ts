import { request } from "@/api/api";
import { LikeResp, Post, PostComment } from "../types/post";

const API_PATH = "/api/post";
const API_PATH_COMMENT = "/api/comment";
const API_URL = "http://localhost:8000/api/post";

export const fetchPosts = async (
  category?: string,
  searchQuery?: string,
  sort?: string,
  state?: string,
  clerkId?: string,
): Promise<Post[]> => {
  const params = new URLSearchParams();
  if (category) params.append("category", category);
  if (searchQuery) params.append("q", searchQuery);
  if (sort) params.append("sort", sort);
  if (state) params.append("state", state);
  if (clerkId) params.append("clerk_id", clerkId);

  const qs = params.toString();
  return request<Post[]>(`${API_PATH}?${qs}`);
};

export async function createPostWithImages(
  data: Omit<Post, "id" | "user_id">,
  clerkId: string,
  files: File[],
) {
  const formData = new FormData();
  formData.append("post_data", JSON.stringify(data));
  files.forEach((file) => formData.append("images", file));

  await request(`${API_PATH}/with-images?clerk_id=${clerkId}`, {
    method: "POST",
    body: formData,
  });

  return true;
}

export async function createPostWithCampaigns(fd: FormData, clerkId: string) {
  return request(`${API_PATH}/with-campaigns?clerk_id=${clerkId}`, {
    method: "POST",
    body: fd,
  });
}

export async function updatePostWithImages(
  id: string,
  data: Omit<Post, "id" | "user_id">,
  clerkId: string,
  files: File[],
) {
  const formData = new FormData();
  formData.append("post_data", JSON.stringify(data));
  files.forEach((file) => formData.append("images", file));

  await request(`${API_PATH}/${id}/with-images?clerk_id=${clerkId}`, {
    method: "PUT",
    body: formData,
  });

  return true;
}

export async function deletePost(id: string, clerkId: string) {
  await request(`${API_PATH}/${id}?clerk_id=${clerkId}`, {
    method: "DELETE",
  });
  return true;
}

export async function updatePostWithCampaigns(
  postId: string,
  fd: FormData,
  clerkId: string,
) {
  return request(
    `${API_PATH}/${postId}/with-campaigns?clerk_id=${encodeURIComponent(
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
  return request<PostComment>(
    `${API_PATH_COMMENT}?clerk_id=${encodeURIComponent(clerkId)}`,
    {
      method: "POST",
      body: fd,
    },
  );
}

export async function fetchComments(postId: string, clerk_id: string | null) {
  return request<PostComment[]>(
    `${API_PATH_COMMENT}/post/${postId}?clerk_id=${encodeURIComponent(
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

export async function reorderPostImages(
  postId: string,
  clerkId: string,
  items: { id: string; order: number }[],
) {
  const fd = new FormData();
  fd.append("images_reorder", JSON.stringify(items));
  return request(
    `${API_PATH}/${postId}/with-campaigns?clerk_id=${encodeURIComponent(
      clerkId,
    )}`,
    { method: "PUT", body: fd },
  );
}

export async function changeState(
  postId: string,
  state: string,
  token: string | null,
) {
  return request<Post>(
    `${API_PATH}/${postId}/state?state=${encodeURIComponent(state)}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
}
export async function getForYouCampaigns(token: string): Promise<Post[]> {
  const data = await request<{
    campaigns: {
      campaign: Post;
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
      campaign.post_header,
    );
  });

  return data.campaigns.map((c) => c.campaign);
}

export async function fetchPostById(postId: string): Promise<Post> {
  return request<Post>(`${API_PATH}/${postId}`);
}

export async function fetchPostsByUserId(userId: string): Promise<Post[]> {
  return request<Post[]>(`${API_PATH}/campaign-by-user/${userId}`);
}

// Bookmarks API
export async function toggleBookmark(
  postId: string,
  token: string | null,
): Promise<{ bookmarked: boolean }> {
  return request<{ bookmarked: boolean }>(`/api/bookmarks/${postId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function fetchBookmarks(token: string | null): Promise<Post[]> {
  return request<Post[]>(`/api/bookmarks/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function fetchRecommendedPosts(
  postId: string,
  limit: number = 4,
): Promise<{
  source_post_id: string;
  recommendations: { post_id: string; score: number }[];
}> {
  return request<{
    source_post_id: string;
    recommendations: { post_id: string; score: number }[];
  }>(`${API_PATH}/${postId}/recommend?limit=${limit}`);
}
