import { request } from "@/api/api";
import { Progress } from "../types";

export function createProgress(data: FormData): Promise<Progress> {
  return request<Progress>("/api/progress", {
    method: "POST",
    body: data,
  });
}

export function updateProgress(id: string, data: FormData): Promise<Progress> {
  return request<Progress>(`/api/progress/${id}`, {
    method: "PUT",
    body: data,
  });
}

export function getProgressByCampaignId(campaignId: string): Promise<Progress[]> {
  return request<Progress[]>(`/api/progress?campaign_id=${campaignId}`);
}
