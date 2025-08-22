export type PostCategoryType = "tech" | "education" | "health" | "other";
export type PostStatusType = "active" | "inactive";
export type PostStateType = "draft" | "published" | "archived";

export type Post = {
  id: string;
  user_id: string;
  effective_start_from: string | null;
  effective_end_date: string | null;
  created_at?: string;
  state: PostStateType;
  status: PostStatusType;
  category: PostCategoryType;
  post_header: string;
  post_description: string;
  goal_amount: number;
  current_amount: number;
  supporter: number | null;
  images?: Image[] | [];
  campaigns?: Campaign[] | [];
};

export type Campaign = {
  id?: string;
  post_id: string;
  created_at?: string;
  campaign_header: string;
  campaign_description: string;
  order: number;
  images?: Image[] | [];
};

export type Image = {
  path: string;
};
