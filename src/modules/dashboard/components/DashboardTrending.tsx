import { BarChart } from "@mui/x-charts/BarChart";
import { TrendingCampaign } from "../types/dashboard";

export default function DashboardTrending({ data }: { data: TrendingCampaign[] }) {
  if (!data.length) return <p>No trending campaigns</p>;

  return (
    <BarChart
      xAxis={[
        {
          scaleType: "band",
          data: data.map((p) => p.campaign_header),
        },
      ]}
      series={[
        {
          data: data.map((p) => p.donate_count),
          label: "จำนวนครั้งที่ Donate",
        },
      ]}
      height={300}
    />
  );
}