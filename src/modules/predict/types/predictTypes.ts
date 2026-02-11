export interface PredictInput {
  goal: number;
  name: string;
  blurb: string;
  start_date: string;
  end_date: string;
  country_displayable_name: string;
  category_group: string;
  has_video: number;
  has_photo: number;
}

export interface HeadResult {
  pred: number;
  label: string;
  confidence: number;
  probs: number[];
}

export interface PredictResponse {
  success_cls: HeadResult;
  risk_level: HeadResult;
  days_to_state_change: HeadResult;
  goal_eval: HeadResult;
  stretch_potential_cls: HeadResult;
}
