import { request } from "@/api/api";
import { Report, ReportStatus, ReportType } from "../types/report";

const API_URL = process.env.NEXT_PUBLIC_API_URL + "/api/reports";

export const getReports = async (): Promise<Report[]> => {
  return request<Report[]>(API_URL);
};

export const updateReportStatus = async (
  reportId: string,
  status: ReportStatus,
): Promise<Report> => {
  return request<Report>(`${API_URL}/${reportId}/status?status=${status}`, {
    method: "PUT",
  });
};

export const deleteReport = async (reportId: string): Promise<void> => {
  await request(`${API_URL}/${reportId}`, {
    method: "DELETE",
  });
};
