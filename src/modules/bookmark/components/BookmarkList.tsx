"use client";

import React from "react";
import { Box, Typography, Stack } from "@mui/material";
import { Campaign } from "@/modules/campaign/types/campaign";
import BookmarkCard from "./BookmarkCard";

interface BookmarkListProps {
  campaigns: Campaign[];
  onUnbookmark: (campaignId: string) => void;
}

export default function BookmarkList({
  campaigns,
  onUnbookmark,
}: BookmarkListProps) {
  if (campaigns.length === 0) {
    return (
      <Box sx={{ py: 8, textAlign: "center" }}>
        <Typography color="text.secondary">
          You haven't bookmarked any campaigns yet.
        </Typography>
      </Box>
    );
  }

  return (
    <Stack
      spacing={2}
      sx={{
        py: 2,
        maxHeight: "100%",
        overflowY: "auto",
        pr: 1, // Space for scrollbar
        "&::-webkit-scrollbar": {
          width: "6px",
        },
        "&::-webkit-scrollbar-track": {
          background: "transparent",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "rgba(0,0,0,0.1)",
          borderRadius: "10px",
          "&:hover": {
            background: "rgba(0,0,0,0.2)",
          },
        },
      }}
    >
      {campaigns.map((campaign) => (
        <BookmarkCard key={campaign.id} campaign={campaign} onUnbookmark={onUnbookmark} />
      ))}
    </Stack>
  );
}
