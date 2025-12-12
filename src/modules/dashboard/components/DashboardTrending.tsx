import { BarChart } from "@mui/x-charts/BarChart";
import { TrendingPost } from "../types/dashboard";

export default function DashboardTrending({ data }: { data: TrendingPost[] }) {
  if (!data.length) return <p>No trending posts</p>;

  return (
    <BarChart
      xAxis={[
        {
          scaleType: "band",
          data: data.map((p) => p.post_header),
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