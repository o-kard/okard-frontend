import { PredictInput, PredictResponse } from "../types/predictTypes";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/predict/`;

export async function predictCampaign(
  input: PredictInput,
  clerkId: string
): Promise<PredictResponse> {
  const res = await fetch(`${API_URL}?clerk_id=${encodeURIComponent(clerkId)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }
  return res.json() as Promise<PredictResponse>;
}
