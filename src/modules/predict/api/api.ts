import { PredictInput, PredictResponse } from "../types/predictTypes";

// const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/predict`;

export async function predictApi(input: PredictInput): Promise<PredictResponse> {
  const res = await fetch(`${API_URL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    throw new Error("Prediction API failed");
  }
  return res.json();
}
