export type User = {
  id: string;
  clerk_id: string;
  email: string;
  username: string;
  first_name: string;
  middle_name?: string | null;
  surname: string;
  tel: string;
  address: string;
  user_description: string;
  country?: string | null;
  birth_date?: string | null;
  image_id?: string | null;
};
