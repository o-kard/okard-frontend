import { BarChart } from "@mui/x-charts/BarChart";

export default function PaymentChart({
  data,
}: {
  data: { date: string; total_amount: number }[];
}) {
  return (
    <BarChart
      xAxis={[{ scaleType: "band", data: data.map((d) => d.date) }]}
      series={[{ data: data.map((d) => d.total_amount), label: "Payments" }]}
      height={300}
    />
  );
}
