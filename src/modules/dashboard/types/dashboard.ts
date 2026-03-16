export type DashboardSummary = {
  user_id: string;
  campaign_count: number;
  unique_investor_count: number;
  total_raised: number;
  hit_goal_campaign_count: number
};

export type DashboardCampaign = {
  campaign_id: string;
  title: string;
  goal_amount: number;
  current_amount: number;
  progress_pct: number;
  investor_count: number;
  hit_goal: boolean;
};

export type TrendingCampaign = {
  campaign_id: string
  campaign_header: string
  payment_count: number
}
