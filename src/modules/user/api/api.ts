import { User } from "../types/user";
import { request } from "../../../api/api";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/user`;

export async function createUser(fd: FormData) {
  return request<User>("/api/user", {
    method: "POST",
    body: fd,
  });
}

export async function getUserById(clerk_id: string) {
  return request<User>(`/api/user/${clerk_id}`);
}

export async function checkUserExists(clerk_id: string) {
  const r = await request<{ exists: boolean }>(`/api/user/exists/${clerk_id}`)
  return r.exists
}