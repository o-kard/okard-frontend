import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";
import { Box, Typography } from "@mui/material";
import { CategoryStats } from "../types/types";
import { CATEGORY_COLORS } from "../utils/categoryColors";

interface Props {
  stats: CategoryStats[];
}

export default function CategoryBarChart({ stats }: Props) {
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

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={stats} margin={{ top: 16, right: 16, bottom: 16, left: 16 }}>
          <XAxis
            dataKey="category"
            interval={0}              
            angle={-30}              
            textAnchor="end"
            height={70}    
            tickFormatter={(value) => {
                const key = value as keyof typeof CATEGORY_COLORS;
                return CATEGORY_COLORS[key]?.label ?? value;
              }}           
            />
          <YAxis   tickFormatter={(v) => `$${(v / 1_000_000).toFixed(1)}M`}
            width={60}/>
          <Tooltip 
            formatter={(value) => [
            `$${Number(value).toLocaleString()}`,
            "Total Raised",
          ]}
          labelFormatter={(label) => {
            const key = label as keyof typeof CATEGORY_COLORS;
            return CATEGORY_COLORS[key]?.label ?? label;
          }}
          />
          <Bar dataKey="total_raised" radius={[6, 6, 0, 0]}>
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
