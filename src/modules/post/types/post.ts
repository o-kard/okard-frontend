type PostCategoryType = "tech" | "education" | "health" | "other";
type PostStatusType = "active" | "inactive";
type PostStateType = "draft" | "published" | "archived";

export type Post = {
  id: string;
  user_id: string;
  create_at?: string;
  effective_start_from: string | null;
  effective_end_date: string | null;
  state: PostStateType;
  status: PostStatusType;
  category: PostCategoryType;
  post_header: string;
  post_description: string;
  goal_amount: number;
  current_amount: number;
  supporter: number | null;
  images?: Image[] | [];
};

export type Image = {
  path: string;
};
