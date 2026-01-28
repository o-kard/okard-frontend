import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import { CategoryStats } from "../types/types";
import { CATEGORY_COLORS } from "../utils/categoryColors";

interface Props {
  stats: CategoryStats[];
}

export default function CategoryBarChart({ stats }: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); 

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
        p: 3,
        borderRadius: 3,
        bgcolor: "#fff",
        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
      }}
    >
      <Typography fontWeight={600} mb={2}>
        Total Raised by Category
      </Typography>

      <ResponsiveContainer width="100%" height={chartHeight}>
        <BarChart
          layout={layout}
          data={stats}
          margin={{ top: 16, right: 16, bottom: 16, left: isMobile ? 0 : 16 }}
        >
          {isMobile ? (
            /* Mobile: YAxis is Categories, XAxis is Values */
            <>
              <XAxis type="number" hide />
              <YAxis
                dataKey="category"
                type="category"
                width={100}
                tick={{ fontSize: 12 }}
                tickFormatter={formatLabel}
                interval={0}
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
                height={70}
                tickFormatter={formatLabel}
              />
              <YAxis
                tickFormatter={formatCurrency}
                width={60}
              />
            </>
          )}

          <Tooltip
            cursor={{ fill: 'transparent' }}
            formatter={(value) => [
              `$${Number(value).toLocaleString()}`,
              "Total Raised",
            ]}
            labelFormatter={formatLabel}
          />
          <Bar dataKey="total_raised" radius={isMobile ? [0, 6, 6, 0] : [6, 6, 0, 0]}>
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
