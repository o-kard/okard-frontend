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
  user_description: string;
  country_id: string | null;
  country?: string | null;
  birth_date?: string | null;
  role: string | null;
};

export type UserPublicResponse = {
  id: string;
  username: string;
  image: Image | null;
}