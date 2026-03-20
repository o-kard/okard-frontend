import { Media } from "@/modules/campaign/types/campaign";
import { Creator } from "@/modules/creator/types/creator";

export type User = {
  id: string;
  clerk_id: string;
  email: string | null;
  username: string;
  first_name: string;
  middle_name?: string | null;
  surname: string;
  tel: string;
  address: string;
  country_id: string | null;
  country?: { en_name: string } | null;
  birth_date?: Date | null;
  role: string | null;
  contribution_number: number;
  status: string;
  created_at: Date;
  updated_at: Date;
  user_description?: string;
  creator?: Creator | null;
  media?: Media | null;
};

export type UserPublicResponse = {
  id: string;
  clerk_id: string;
  username: string;
  first_name?: string;
  surname?: string;
  user_description?: string;
  campaign_number?: number;
  contribution_number?: number;
  media: Media | null;
};