import { Box, Typography } from "@mui/material";
import { CategoryStats } from "../types/types";

export default function SummaryCards({ stats }: { stats: CategoryStats[] }) {
  const totalProjects = stats.reduce((s, c) => s + c.total_projects, 0);
  const fundedProjects = stats.reduce((s, c) => s + c.funded_projects, 0);
  const totalRaised = stats.reduce((s, c) => s + c.total_raised, 0);

  const items = [
    { label: "Total Campaigns", value: totalProjects },
    { label: "Goal Reached", value: fundedProjects },
    { label: "Total Raised", value: `$${totalRaised.toLocaleString()}` },
  ];

  return (
    <Box
      display="grid"
      gridTemplateColumns={{ xs: "1fr", md: "repeat(3, 1fr)" }}
      gap={3}
    >
      {items.map((item) => (
        <Box
          key={item.label}
          sx={{
            p: 3,
            borderRadius: 3,
            bgcolor: "#fff",
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          }}
        >
          <Typography fontSize="0.85rem" color="text.secondary">
            {item.label}
          </Typography>
          <Typography fontSize="1.8rem" fontWeight={700}>
            {item.value}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
