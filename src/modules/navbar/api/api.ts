import { SearchResponse } from "../types/navbar";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/search`;

export async function search(query: string): Promise<SearchResponse> {
    const url = `${API_URL}/?query=${encodeURIComponent(query)}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error("Search failed");

    return res.json();
}

export async function getAllCampaigns() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/campaign?state=all`);
    if (!res.ok) throw new Error("Failed to fetch campaigns");
    return res.json();
}
