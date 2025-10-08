import { request } from "@/api/api";
import { LikeResp, Post, PostComment } from "../types/post";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/post`;
const API_URL_COMMENT = `${process.env.NEXT_PUBLIC_API_URL}/api/comment`;

export async function fetchPosts(): Promise<Post[]> {
  const res = await fetch(API_URL);
  return res.json();
}

export async function createPostWithImages(
  data: Omit<Post, "id" | "user_id">,
  clerkId: string,
  files: File[]
) {
  const formData = new FormData();
  formData.append("post_data", JSON.stringify(data));
  files.forEach((file) => formData.append("images", file));

  const res = await fetch(`${API_URL}/with-images?clerk_id=${clerkId}`, {
    method: "POST",
    body: formData,
  });

  return res.ok;
}

export async function createPostWithCampaigns(fd: FormData, clerkId: string) {
  const res = await fetch(`${API_URL}/with-campaigns?clerk_id=${clerkId}`, {
    method: "POST",
    body: fd,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function updatePostWithImages(
  id: string,
  data: Omit<Post, "id" | "user_id">,
  clerkId: string,
  files: File[]
) {
  const formData = new FormData();
  formData.append("post_data", JSON.stringify(data));
  files.forEach((file) => formData.append("images", file));

  const res = await fetch(`${API_URL}/${id}/with-images?clerk_id=${clerkId}`, {
    method: "PUT",
    body: formData,
  });

  return res.ok;
}

export async function deletePost(id: string, clerkId: string) {
  const res = await fetch(`${API_URL}/${id}?clerk_id=${clerkId}`, {
    method: "DELETE",
  });
  return res.ok;
}

export async function updatePostWithCampaigns(
  postId: string,
  fd: FormData,
  clerkId: string
) {
  const res = await fetch(
    `${API_URL}/${postId}/with-campaigns?clerk_id=${encodeURIComponent(
      clerkId
    )}`,
    {
      method: "PUT",
      body: fd,
    }
  );
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// Comment API

export async function createComment(fd: FormData, clerkId: string) {
  return request<PostComment>(
    `${API_URL_COMMENT}?clerk_id=${encodeURIComponent(clerkId)}`,
    {
      method: "POST",
      body: fd,
    }
  );
}

export async function fetchComments(postId: string, clerk_id: string | null) {
  return request<PostComment[]>(
    `${API_URL_COMMENT}/post/${postId}?clerk_id=${encodeURIComponent(
      clerk_id || ""
    )}`
  );
}

export async function likeComment(commentId: string, clerkId: string) {
  return request<LikeResp>(
    `${API_URL_COMMENT}/${commentId}/like?clerk_id=${encodeURIComponent(
      clerkId
    )}`,
    {
      method: "PUT",
    }
  );
}

export async function unlikeComment(commentId: string, clerkId: string) {
  return request<LikeResp>(
    `${API_URL_COMMENT}/${commentId}/like?clerk_id=${encodeURIComponent(
      clerkId
    )}`,
    {
      method: "DELETE",
    }
  );
}
export async function reorderPostImages(
  postId: string,
  clerkId: string,
  items: { id: string; order: number }[]
) {
  const fd = new FormData();
  fd.append("images_reorder", JSON.stringify(items));
  const res = await fetch(
    `${API_URL}/${postId}/with-campaigns?clerk_id=${encodeURIComponent(
      clerkId
    )}`,
    { method: "PUT", body: fd }
  );
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
