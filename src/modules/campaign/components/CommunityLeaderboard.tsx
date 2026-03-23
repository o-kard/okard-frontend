"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  CircularProgress,
  Divider,
} from "@mui/material";
import { getCampaignCommunity } from "@/modules/campaign/api/api";
import { CampaignCommunity, CountrySupporterStat } from "@/modules/campaign/types/campaign";

interface CommunityLeaderboardProps {
  campaignId: string;
}

export default function CommunityLeaderboard({
  campaignId,
}: CommunityLeaderboardProps) {
  const [data, setData] = useState<CampaignCommunity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommunityData = async () => {
      try {
        const result = await getCampaignCommunity(campaignId);
        setData(result);
      } catch (error) {
        console.error("Failed to fetch community data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunityData();
  }, [campaignId]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress sx={{ color: "#18C59B" }} />
      </Box>
    );
  }

  const totalSupporters = data?.total_supporters || 0;
  const topCountries = data?.top_countries || [];

  return (
    <Box
      sx={{
        width: "100%",
        py: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography
        variant="h6"
        fontWeight={700}
        sx={{
          mb: { xs: 4, sm: 6 },
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          gap: 1,
        }}
        fontSize={{ xs: "1rem", sm: "1.2rem" }}
      >
        <span style={{ color: "#18C59B", fontSize: "1.3em", fontWeight: 800 }}>
          {totalSupporters.toLocaleString()}
        </span>{" "}
        <Box
          component="span"
          sx={{
            display: { xs: "block", sm: "inline-block" },
          }}
        >
          PEOPLE ARE SUPPORTING THIS CAMPAIGN
        </Box>
      </Typography>

      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 480,
          border: "1px solid",
          borderColor: "grey.300",
          borderRadius: 3,
          p: { xs: 3, sm: 5 },
          backgroundColor: "#fff",
        }}
      >
        <Typography
          variant="subtitle1"
          fontWeight={800}
          align="center"
          sx={{ mb: 2 }}
        >
          WHERE ARE BACKERS COME FROM?
        </Typography>

        <Typography
          variant="subtitle2"
          fontWeight={700}
          align="center"
          sx={{ mb: 2 }}
        >
          TOP COUNTRIES
        </Typography>

        <Divider sx={{ mb: 3 }} />

        {topCountries.length === 0 ? (
          <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
            No data available yet.
          </Typography>
        ) : (
          <Stack spacing={2.5}>
            {topCountries.map((item: CountrySupporterStat, index: number) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="body1" fontWeight={500}>
                  {item.country}
                </Typography>
                <Typography
                  variant="body1"
                  fontWeight={600}
                  sx={{ color: "#18C59B" }}
                >
                  {item.supporter.toLocaleString()}
                </Typography>
              </Box>
            ))}
          </Stack>
        )}
      </Paper>
    </Box>
  );
}
