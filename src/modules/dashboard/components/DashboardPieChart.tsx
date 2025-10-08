import { PieChart } from "@mui/x-charts/PieChart";

export default function InvestorPieChart({
  data,
}: {
  data: { country: string; invest_count: number }[];
}) {
  return (
    <PieChart
      series={[
        {
          data: data.map((d, i) => ({
            id: i,
            value: d.invest_count,
            label: d.country,
          })),
        },
      ]}
      height={300}
    />
  );
}
