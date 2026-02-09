import { User } from "../types/user";
import { request } from "../../../api/api";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/user`;

export async function createUser(fd: FormData, token: string | null) {
  return request<User>(`${API_URL}`, {
    method: "POST",
    body: fd,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function getUserById(clerk_id: string) {
  return request<User>(`${API_URL}/${clerk_id}`);
}

export async function getUser(token: string) {
  return request<User>(`${API_URL}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function checkUserExists(clerk_id: string) {
  const r = await request<{ exists: boolean }>(`${API_URL}/exists/${clerk_id}`)
  return r.exists
}

export async function updateUser(id: string, fd: FormData) {
  return request<User>(`${API_URL}/update/${id}`, {
    method: "PUT",
    body: fd,
  });
}

export async function listUsers() {
  return request<User[]>(`${API_URL}/list`);
}