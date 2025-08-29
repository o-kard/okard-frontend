// src/modules/payment/api/index.ts
import type { Payment } from "../types/payment";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/payment`;

export async function createPayment(
  payload: Omit<Payment, "user_id">,
  clerkId: string
) {
  const res = await fetch(`${API_URL}?clerk_id=${clerkId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) return null;
  return res.json();
}
