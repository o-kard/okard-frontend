export interface PredictInput {
  goal: number;
  name: string;
  blurb: string;
  start_date: string;
  end_date: string;
  country_displayable_name: string;
  has_video: number;
  has_photo: number;
}

export interface PredictResponse {
  success_cls: number[][][];
  risk_level: number[][][];
  days_to_state_change: number[][][];
  recommend_category: number[][][];
  goal_eval: number[][][];
  stretch_potential_cls: number[][][];
}
