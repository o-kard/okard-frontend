export type UUID = string;
export type PostCategoryType = "art" | "comics" | "crafts" | "dance"
| "design" | "fashion" | "filmVideo" | "food" | "games" | "journalism"
| "music" | "photography" | "publishing" | "technology" | "theater";

export type Image = {
  path: string;
  id?: UUID;
};

export type TabKey = "popular" | "forYou"


export type CategoryStats = {
  category: string;
  total_projects: number;
  funded_projects: number;
  total_raised: number;
};

export type Project = {
  id: string
  name: string
  coverImage: string
  supporters: number
  category: string
  percent?: number
  creator?: {
    name: string
    avatar: string
  }
  supportedAmount?: number
  donatedAmount?: number
  goal?: number
  description: string
}


export type HomeCampaignRaw = {
  id: string
  user_id: string
  category: string
  post_header: string
  post_description?: string | null
  goal_amount: number
  current_amount: number
  progress: number
  images: HomeImage[]
  creator: HomeCreator
}


export type HomeImage = {
  path: string
}

export type HomeCreator = {
  id: string
  name: string
  avatar?: string | null
}

export type HomeCampaign = {
  id: string
  category: string
  post_header: string
  post_description?: string | null
  goal_amount: number
  current_amount: number
  progress: number
  coverImageUrl: string | null
  creatorName: string
  creatorAvatarUrl: string | null
  supporters?: number
}
