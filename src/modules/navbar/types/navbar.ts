export interface SearchResult {
    id: string;
    type: "user" | "post";
    name: string;
    thumbnail?: string;
    creator?: string;
    }

export interface SearchResponse {
    results: SearchResult[];
    }

