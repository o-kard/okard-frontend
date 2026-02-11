"use client";

import { Box, Typography, Container } from "@mui/material";
import { useState, useEffect } from "react";
import CategorySelector from "../components/CategorySelector";
import SummaryCards from "../components/SummaryCards";
import CategoryBarChart from "../components/CategoryBarChart";
import CategoryPieChart from "../components/CategoryPieChart";
import { CategoryStats } from "../types/types";
import { getCategoryStats } from "../api/api";

export default function CategoryDashboardSection() {
  const [campaigns, setCampaigns] = useState<CategoryStats[]>([]);
  const [selected, setSelected] = useState<string[]>(["ALL"]);
  const [loading, setLoading] = useState(true);

  // ✅ fetch data ที่ถูกต้องสำหรับ client
  useEffect(() => {
    getCategoryStats()
      .then(setCampaigns)
      .finally(() => setLoading(false));
  }, []);

  const categories = campaigns.map((s) => s.category);

  const toggleCategory = (cat: string) => {
    setSelected((prev) => {
      if (cat === "ALL") return ["ALL"];

      const withoutAll = prev.filter((c) => c !== "ALL");

      if (withoutAll.includes(cat)) {
        const next = withoutAll.filter((c) => c !== cat);
        return next.length ? next : ["ALL"];
      }

      return [...withoutAll, cat];
    });
  };

  const filteredStats =
    selected.includes("ALL")
      ? campaigns
      : campaigns.filter((s) => selected.includes(s.category));

  return (
    <Box
      sx={{
        width: "100%",
        py: { xs: 6, md: 10 },

      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: { xs: "100%", md: "80%" },
          mx: "auto",
          px: { xs: 2, md: 0 },
        }}
      >
        <Typography fontSize={{ xs: "2rem", sm: "3rem", md: "3.5rem" }} fontWeight={700} mb={1}>
          Category Insights
        </Typography>
        <Typography color="text.secondary" mb={4}>
          Compare crowdfunding performance by category
        </Typography>

        <CategorySelector
          categories={categories}
          selected={selected}
          onToggle={toggleCategory}
        />

        <SummaryCards stats={filteredStats} />

        <Box
          mt={6}
          display="grid"
          gridTemplateColumns={{ xs: "1fr", md: "2fr 1fr" }}
          gap={4}
        >
          <CategoryBarChart stats={filteredStats} />
          <CategoryPieChart stats={filteredStats} />
        </Box>
      </Box>
    </Box>
  );
}
