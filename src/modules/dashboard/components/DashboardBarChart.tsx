import { BarChart } from "@mui/x-charts/BarChart";
import dayjs from "dayjs";

export default function PaymentChart({
  data,
}: {
  data: { date: string; total_amount: number }[];
}) {
  const dataMap = new Map(data.map((d) => [d.date, d.total_amount]));

  const last7Days = Array.from({ length: 7 }).map((_, i) =>
    dayjs()
      .subtract(6 - i, "day")
      .format("YYYY-MM-DD")
  );

  const filledData = last7Days.map((date) => ({
    date,
    total_amount: dataMap.get(date) ?? 0,
  }));

  return (
    <BarChart
      xAxis={[{ scaleType: "band", data: filledData.map((d) => d.date) }]}
      series={[
        {
          data: filledData.map((d) => d.total_amount),
          label: "Payments",
        },
      ]}
      height={300}
    />
  );
}
