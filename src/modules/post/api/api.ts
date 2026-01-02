import { request } from "@/api/api";
import { LikeResp, Post, PostComment } from "../types/post";

const API_PATH = "/api/post";
const API_PATH_COMMENT = "/api/comment";

export async function fetchPosts(): Promise<Post[]> {
  return request<Post[]>(API_PATH);
}

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
