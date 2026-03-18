export interface Progress {
  id: string;
  campaign_id: string;
  created_at: string;
  updated_at?: string;
  progress_header: string;
  progress_description?: string;
  media?: {
    id: string;
    path: string;
    orig_name: string;
    display_order: number;
  }[];
}

export interface CreateProgressPayload {
  progress_header: string;
  progress_description?: string;
  campaign_id: string;
}
