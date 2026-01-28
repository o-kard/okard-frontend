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
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));


  const radius = isMobile ? 80 : isTablet ? 100 : 120;
  // Standard height for everyone (Legend is external on mobile)
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
        p: 3,
        borderRadius: 3,
        bgcolor: "#fff",
        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
      }}
    >
      <Typography fontWeight={600} mb={2}>
        Distribution
      </Typography>

      <ResponsiveContainer width="100%" height={chartHeight}>
        <PieChart>
          <Pie
            data={pieData}
            dataKey="total_projects"
            nameKey="label"
            outerRadius={radius}
            // cy default (50%) works best now that legend is external
            label={isDesktop}
          >
            {pieData.map((entry) => {
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

          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      {!isDesktop && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1.5, mt: 0 }}>
          {pieData.map((entry) => {
            const key = String(entry.category) as keyof typeof CATEGORY_COLORS;
            const category = CATEGORY_COLORS[key] ?? CATEGORY_COLORS.all;
            return (
              <Box key={entry.category} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 10, height: 10, bgcolor: category.color, borderRadius: '50%' }} />
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
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
