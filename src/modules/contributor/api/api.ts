import { request } from "@/api/api";
import { ContributorWithCampaign } from "../types";

const API_PATH = "/api/contributor";

export async function getContributeByUserId(userId: string): Promise<ContributorWithCampaign[]> {
    return request<ContributorWithCampaign[]>(`${API_PATH}/${userId}`);
}
