import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import { Box, Typography } from "@mui/material";
import { CategoryStats } from "../types/types";
import { CATEGORY_COLORS } from "../utils/categoryColors";

interface Props {
  stats: CategoryStats[];
}

export default function CategoryPieChart({ stats }: Props) {
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

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
            <Pie data={pieData} dataKey="total_projects" nameKey="label" outerRadius={120} label>
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
    </Box>
  );
}
