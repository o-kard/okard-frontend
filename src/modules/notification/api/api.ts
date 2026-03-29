import { Notification } from "../types/notification";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/notification`;

export async function listNotifications(
  clerk_id: string
): Promise<Notification[]> {
  const url = `${API_URL}?clerk_id=${clerk_id}`;
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch notifications");
  return res.json();
}

export async function deleteNotification(
  notificationId: string
): Promise<Notification> {
  const res = await fetch(`${API_URL}/${notificationId}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to delete notification");
  return res.json();
}
