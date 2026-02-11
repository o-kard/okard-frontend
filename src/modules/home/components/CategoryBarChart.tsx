import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
} from "recharts";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import { CategoryStats } from "../types/types";
import { CATEGORY_COLORS } from "../utils/categoryColors";

interface Props {
  stats: CategoryStats[];
}

export default function CategoryBarChart({ stats }: Props) {
  const isMobile = useMediaQuery("(max-width:1000px)");

  const layout = isMobile ? "vertical" : "horizontal";
  const chartHeight = isMobile ? 500 : 300;

  const formatLabel = (val: string) => {
    const key = val as keyof typeof CATEGORY_COLORS;
    return CATEGORY_COLORS[key]?.label ?? val;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      notation: "compact",
      compactDisplay: "short",
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    }).format(value);
  };

  return (
    <Box
      sx={{
        p: isMobile ? 2 : 3,
        borderRadius: 3,
        bgcolor: "#fff",
        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
        display: "flex",
        flexDirection: "column",
        alignItems: isMobile ? "center" : "stretch",
        textAlign: isMobile ? "center" : "left",
      }}
    >
      <Typography fontWeight={600} mb={2}>
        Total Raised by Category
      </Typography>

      <ResponsiveContainer width="100%" height={chartHeight}>
        <BarChart
          layout={layout}
          data={stats}
          margin={{ top: 16, right: isMobile ? 0 : 16, bottom: 16, left: isMobile ? 0 : 16 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={!isMobile} vertical={isMobile} stroke="#E0E0E0" />
          {isMobile ? (
            /* Mobile: YAxis is Categories, XAxis is Values */
            <>
              <XAxis type="number" hide={false} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#666' }} />
              <YAxis
                dataKey="category"
                type="category"
                width={80}
                tick={{ fontSize: 11, fill: '#333', fontWeight: 500 }}
                tickFormatter={formatLabel}
                interval={0}
                axisLine={false}
                tickLine={false}
              />
            </>
          ) : (
            /* Desktop: XAxis is Categories, YAxis is Values */
            <>
              <XAxis
                dataKey="category"
                interval={0}
                angle={-30}
                textAnchor="end"
                tick={{ dx: -6, dy: 10, fontSize: 12, fill: '#666' }}
                height={80}
                tickFormatter={formatLabel}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={formatCurrency}
                width={45}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#666' }}
              />
            </>
          )}

          <Tooltip
            cursor={{ fill: 'transparent' }}
            formatter={(value?: number) => [
              `$${Number(value || 0).toLocaleString()}`,
              "Total Raised",
            ] as [string, string]}
            labelFormatter={(label) => formatLabel(String(label))}
          />
          <Bar dataKey="total_raised" radius={[4, 4, 4, 4]} barSize={isMobile ? 20 : 32} background={{ fill: '#F5F5F5', radius: 4 }}>
            {stats.map((entry) => {
              const key =
                String(entry.category) as keyof typeof CATEGORY_COLORS;

              const category = CATEGORY_COLORS[key] ?? CATEGORY_COLORS.all;

              return (
                <Cell
                  key={entry.category}
                  fill={category.color}
                />
              );
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}
