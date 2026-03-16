import { Media } from "../../campaign/types/campaign";

export type ReportType = "fraud" | "spam" | "inappropriate_content" | "other";
export type ReportStatus = "pending" | "reviewed" | "dismissed";

export interface Report {
  id: string;
  campaign_id?: string;
  reporter_id: string;
  type: ReportType;
  header?: string;
  description?: string;
  status: ReportStatus;
  admin_notes?: string;
  created_at: string;
  resolved_at?: string;
  files: Media[];
}
