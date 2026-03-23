import { User, UserPublicResponse } from "@/modules/user/types/user";

export type CampaignCategoryType =
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
export type CampaignStateType =
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

export interface CountrySupporterStat {
  country: string;
  supporter: number;
}

export interface CampaignCommunity {
  total_supporters: number;
  top_countries: CountrySupporterStat[];
}

export type Campaign = {
  id: UUID;
  user_id: UUID;
  effective_start_from: string | null;
  effective_end_date: string | null;
  created_at?: string;
  updated_at?: string;
  state: CampaignStateType;
  category: CampaignCategoryType;
  campaign_header: string;
  campaign_description: string;
  goal_amount: number;
  progress: number | null;
  current_amount: number;
  supporter: number | null;
  media?: Media[] | [];
  images?: Media[] | [];
  video?: Media | null;
  informations?: Information[] | [];
  rewards?: Reward[] | [];
  comments?: CampaignComment[] | [];
  user: UserPublicResponse;
  is_bookmarked?: boolean;
  ai_label?: AIPrediction | null;
};

export type Information = {
  id?: UUID;
  campaign_id: UUID;
  created_at?: string;
  information_header: string;
  information_description: string;
  display_order: number;
  media?: Media[] | [];
};

export type Reward = {
  id?: UUID;
  campaign_id: UUID;
  created_at?: string;
  reward_header: string;
  reward_description: string;
  reward_amount: number;
  backup_amount: number;
  display_order: number;
  media?: Media[] | [];
};

export type CampaignComment = {
  id?: string;
  campaign_id: string;
  parent_id?: string | null;
  user_id: string;
  content: string;
  likes: number;
  created_at?: string;
  is_liked?: boolean;
  author: UserPublicResponse;
  children?: CampaignComment[] | null;
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

export type CampaignSummary = {
  id: string;
  user_id: string;
  category: CampaignCategoryType;

  campaign_header: string;
  campaign_description: string;

  goal_amount: number;
  current_amount: number;
  supporters: number;
  progress: number;
  suupporter: number | null;
  effective_start_from?: string | null;
  effective_end_date?: string | null;
  state: CampaignStateType;
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
