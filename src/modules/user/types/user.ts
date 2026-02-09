import { Image } from "@/modules/post/types/post";

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
  country?: string | null;
  birth_date?: Date | null;
  role: string | null;
  image?: Image | null;
  contribution_number: number;
  status: string;
  created_at: Date;
  updated_at: Date;
};

export type UserPublicResponse = {
  id: string;
  //TODO:
  username: string;
  first_name?: string;
  surname?: string;
  user_description?: string;
  campaign_number?: number;
  contribution_number?: number;
  image: Image | null;
};
