export interface SearchResult {
    id: string;
    type: "user" | "campaign";
    name: string;
    thumbnail?: string;
    creator?: string;
    }

export interface SearchResponse {
    results: SearchResult[];
    }

