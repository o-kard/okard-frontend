import { User, UserPublicResponse } from "@/modules/user/types/user";

export type PostCategoryType =
  | "art"
  | "comics"
  | "crafts"
  | "dance"
  | "design"
  | "fashion"
  | "filmVideo"
  | "food"
  | "games"
  | "journalism"
  | "music"
  | "photography"
  | "publishing"
  | "technology"
  | "theater";
export type PostStateType =
  | "draft"
  | "published"
  | "fail"
  | "success"
  | "suspend";

export type UUID = string;

export interface AIPrediction {
  success_label: string | null;
  risk_label: string | null;
  days_to_state_label: string | null;
  goal_eval_label: string | null;
  stretch_label: string | null;
}

export type Post = {
  id: UUID;
  user_id: UUID;
  effective_start_from: string | null;
  effective_end_date: string | null;
  created_at?: string;
  updated_at?: string;
  state: PostStateType;
  category: PostCategoryType;
  post_header: string;
  post_description: string;
  goal_amount: number;
  progress: number | null;
  current_amount: number;
  supporter: number | null;
  media?: Media[] | [];
  images?: Media[] | [];
  video?: Media | null;
  campaigns?: Campaign[] | [];
  rewards?: Reward[] | [];
  comments?: PostComment[] | [];
  user: UserPublicResponse;
  is_bookmarked?: boolean;
  ai_label?: AIPrediction | null;
};

export type Campaign = {
  id?: UUID;
  post_id: UUID;
  created_at?: string;
  campaign_header: string;
  campaign_description: string;
  display_order: number;
  media?: Media[] | [];
};

export type Reward = {
  id?: UUID;
  post_id: UUID;
  created_at?: string;
  reward_header: string;
  reward_description: string;
  reward_amount: number;
  backup_amount: number;
  display_order: number;
  media?: Media[] | [];
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

export type Media = {
  path: string;
  id?: UUID;
  display_order?: number;
  media_type?: string;
  thumbnail_path?: string;
};

export type UserMedia = {
  id: string;
  path: string;
};

export type PostSummary = {
  id: string;
  user_id: string;
  category: PostCategoryType;

  post_header: string;
  post_description: string;

  goal_amount: number;
  current_amount: number;
  supporters: number;
  progress: number;
  suupporter: number | null;
  state: PostStateType;
  created_at?: string;
  updated_at?: string;
  media: Media[];
  images?: Media[];
  video?: Media | null;
  user: {
    id: string;
    username: string;
    media?: UserMedia | null;
  };
  is_bookmarked?: boolean;
  ai_label?: AIPrediction | null;
};
