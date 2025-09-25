export type DashboardSummary = {
  user_id: string;
  post_count: number;
  unique_investor_count: number;
  total_raised: number;
  hit_goal_post_count: number
};

export type DashboardPost = {
  post_id: string;
  title: string;
  goal_amount: number;
  current_amount: number;
  progress_pct: number;
  investor_count: number;
  hit_goal: boolean;
};
