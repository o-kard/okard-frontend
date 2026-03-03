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

export async function updateCreator(
  id: string,
  fd: FormData,
  token: string | null,
) {
  return await request<Creator>(`${API_URL}/${id}`, {
    method: "PUT",
    body: fd,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function getPendingCreators() {
  return await request<Creator[]>(`${API_URL}/requests/pending`, {
    method: "GET",
  });
}

export async function verifyCreator(
  id: string,
  status: "verified" | "rejected" | "pending",
  adminClerkId: string,
  rejectionReason?: string,
) {
  const url = new URL(`${API_URL}/${id}/verify`);
  url.searchParams.append("status", status);
  url.searchParams.append("admin_clerk_id", adminClerkId);
  if (rejectionReason) {
    url.searchParams.append("rejection_reason", rejectionReason);
  }

  return await request<Creator>(url.toString(), {
    method: "PUT",
  });
}
