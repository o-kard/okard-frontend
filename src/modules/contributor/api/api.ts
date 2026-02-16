import { request } from "@/api/api";
import { ContributorWithPost } from "../types";

const API_PATH = "/api/contributor";

export async function getContributeByUserId(userId: string): Promise<ContributorWithPost[]> {
    return request<ContributorWithPost[]>(`${API_PATH}/${userId}`);
}
