"use client";

import React from "react";
import { Box, Typography, Stack } from "@mui/material";
import { Post } from "@/modules/post/types/post";
import BookmarkCard from "./BookmarkCard";

interface BookmarkListProps {
  posts: Post[];
  onUnbookmark: (postId: string) => void;
}

export default function BookmarkList({
  posts,
  onUnbookmark,
}: BookmarkListProps) {
  if (posts.length === 0) {
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
      {posts.map((post) => (
        <BookmarkCard key={post.id} post={post} onUnbookmark={onUnbookmark} />
      ))}
    </Stack>
  );
}
