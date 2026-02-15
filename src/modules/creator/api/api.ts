import { Creator } from "../types/creator";
import { request } from "../../../api/api";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/creator`;

export async function createCreator(fd: FormData, token: string | null) {
  return await request<Creator>(`${API_URL}`, {
    method: "POST",
    body: fd,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    timeout: 60000,
  });
}

export async function updateCreator(id: string, fd: FormData, token: string | null) {
  return await request<Creator>(`${API_URL}/${id}`, {
    method: "PUT",
    body: fd,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}