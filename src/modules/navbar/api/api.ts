import { SearchResponse } from "../types/navbar";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/search`;

export async function search(query: string): Promise<SearchResponse> {
    const url = `${API_URL}?query=${encodeURIComponent(query)}`;

    const res = await fetch(url, { credentials: "include" });
    if (!res.ok) throw new Error("Search failed");

    return res.json();
}

export async function getAllPosts() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/post`);
    if (!res.ok) throw new Error("Failed to fetch posts");
    return res.json();
}
