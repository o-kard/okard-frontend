import { Media } from "../../post/types/post";

export type ReportType = "fraud" | "spam" | "inappropriate_content" | "other";
export type ReportStatus = "pending" | "reviewed" | "dismissed";

export interface Report {
  id: string;
  post_id?: string;
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
