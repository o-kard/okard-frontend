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
  rewards?: Reward[] | [];
};

export type Campaign = {
  id?: string;
  post_id: string;
  created_at?: string;
  campaign_header: string;
  campaign_description: string;
  order: number;
  image?: Image[] | [];
};

export type Reward = {
  id?: string;
  post_id: string;
  created_at?: string;
  reward_header: string;
  reward_description: string;
  reward_amount: number;
  backup_amount: number;
  order: number;
  image?: Image[] | [];
};

export type Image = {
  path: string;
  id?: string;
};
