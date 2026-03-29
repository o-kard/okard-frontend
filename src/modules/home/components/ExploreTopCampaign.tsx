"use client";

import { Box, Typography, Container } from "@mui/material";
import { useState, useEffect } from "react";
import CategoryTabs from "./CategoryTabs";
import CampaignGrid from "./CampaignGrid";
import Button from "@mui/material/Button";
import ArrowCircleRightOutlinedIcon from "@mui/icons-material/ArrowCircleRightOutlined";
import { CampaignSummary } from "@/modules/campaign/types/campaign";
import { getTopPledgedCampaigns } from "../api/api";
import { useUser, useAuth } from "@clerk/nextjs";

export default function ExploreTopCampaign() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>("art");
  const [campaigns, setCampaigns] = useState<CampaignSummary[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const token = await getToken();

      try {
        const res = await getTopPledgedCampaigns({
          category: selectedCategory,
          token: token || undefined,
        });
        setCampaigns(res ?? []);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCategory, getToken]);

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography
        fontWeight="bold"
        fontSize={{ xs: "2rem", sm: "3rem", md: "3.5rem" }}
        textAlign="center"
        mb={4}
        fontFamily="var(--font-montserrat)"
      >
        Explore Top Campaign
      </Typography>

      {/* Tabs (controlled) */}
      <CategoryTabs value={selectedCategory} onChange={setSelectedCategory} />

      {/* Grid */}
      <CampaignGrid campaigns={campaigns} />

      {!loading && campaigns.length === 0 && (
        <Typography textAlign="center" mt={4} color="text.secondary">
          No campaigns found
        </Typography>
      )}

      <Box textAlign="center" mt={5}>
        <Button
          variant="outlined"
          size="large"
          href={`/campaign?category=${encodeURIComponent(selectedCategory)}`}
          sx={{
            bgcolor: "white",
            color: "#000",
            borderRadius: "12px",
            fontWeight: "700",
            fontSize: "1rem",
            borderWidth: 1,
            borderColor: "black",
            "&:hover": {
              borderColor: "#12C998",
              backgroundColor: "#12C998",
            },
          }}
        >
          SEE ALL FILTERED
          <ArrowCircleRightOutlinedIcon sx={{ ml: 1 }} />
        </Button>
      </Box>
    </Container>
  );
}
