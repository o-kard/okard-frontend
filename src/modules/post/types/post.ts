import { User, UserPublicResponse } from "@/modules/user/types/user";

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
  comments?: PostComment[] | [];
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

export type PostComment = {
  id?: string;
  post_id: string;
  parent_id?: string | null;
  user_id: string;
  content: string;
  likes: number;
  created_at?: string;
  is_liked?: boolean;
  author: UserPublicResponse;
  children?: PostComment[] | null;
};

export type LikeResp = {
  comment_id: string;
  likes: number;
  is_liked: boolean;
};

export type Image = {
  path: string;
};
