import { Post } from "../types/post";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/post`;

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
