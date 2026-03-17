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

export async function getUserById(id: string) {
  return request<User>(`${API_URL}/${id}`);
}

export async function getUser(token: string) {
  return request<User>(`${API_URL}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function checkUserExists(clerk_id: string) {
  const r = await request<{ exists: boolean }>(`${API_URL}/exists/${clerk_id}`);
  return r.exists;
}

export async function updateUser(fd: FormData, token: string | null) {
  return request<User>(`${API_URL}/update`, {
    method: "PUT",
    body: fd,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function listUsers() {
  return request<User[]>(`${API_URL}/list`);
}

export async function deleteUser(userId: string) {
  return request(`${API_URL}/delete/${userId}`, {
    method: "DELETE",
  });
}

export async function suspendUser(userId: string) {
  return request(`${API_URL}/${userId}/suspend`, {
    method: "PUT",
  });
}
