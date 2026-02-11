import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { CategoryStats } from "../types/types";
import { CATEGORY_COLORS } from "../utils/categoryColors";

interface Props {
  stats: CategoryStats[];
}

export default function CategoryPieChart({ stats }: Props) {
  const isMobile = useMediaQuery("(max-width:1000px)");

  const chartHeight = 300;

  const pieData = stats.map((s) => {
    const key = s.category as keyof typeof CATEGORY_COLORS;

    return {
      ...s,
      label: CATEGORY_COLORS[key]?.label ?? s.category,
    };
  });

  return (
    <Box
      sx={{
        p: isMobile ? 2 : 3,
        borderRadius: 3,
        bgcolor: "#fff",
        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box sx={{ flex: isMobile ? '0 0 auto' : '1', width: '100%', minWidth: 280, height: 300, mb: isMobile ? 2 : 0, textAlign: isMobile ? "center" : "left" }}>
        <Typography fontWeight={600} mb={-1} align={isMobile ? "center" : "left"}>
          Distribution
        </Typography>

        <ResponsiveContainer width="100%" height={chartHeight}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="total_projects"
              nameKey="label"
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={isMobile ? 80 : 100}
              paddingAngle={2}
            >
              {pieData.map((entry) => {
                const key =
                  String(entry.category) as keyof typeof CATEGORY_COLORS;

                const category = CATEGORY_COLORS[key] ?? CATEGORY_COLORS.all;

                return (
                  <Cell
                    key={entry.category}
                    fill={category.color}
                    stroke="none"
                  />
                );
              })}
            </Pie>
            <Tooltip
              cursor={{ fill: 'transparent' }}
              formatter={(value?: number, name?: string) => [`${value || 0} Projects`, name || ''] as [string, string]}
              contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </Box>

      {isMobile && (
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignContent: 'center',
            gap: 1.5,
            width: '100%',
            maxHeight: 'none',
            overflowY: 'auto',
            pl: 0
          }}
        >
          {pieData.map((entry) => {
            const key = String(entry.category) as keyof typeof CATEGORY_COLORS;
            const category = CATEGORY_COLORS[key] ?? CATEGORY_COLORS.all;
            return (
              <Box key={entry.category} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 10, height: 10, bgcolor: category.color, borderRadius: '50%', flexShrink: 0 }} />
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                  {entry.label}
                </Typography>
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
}
