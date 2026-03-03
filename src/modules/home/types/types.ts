export type UUID = string;
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

export type Image = {
  path: string;
  id?: UUID;
};

export type TabKey = "popular" | "forYou";
export type PostStateType =
  | "draft"
  | "published"
  | "fail"
  | "success"
  | "suspend";

export type CategoryStats = {
  category: string;
  total_projects: number;
  funded_projects: number;
  total_raised: number;
};
