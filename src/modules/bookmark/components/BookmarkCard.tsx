"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  Chip,
  IconButton,
} from "@mui/material";
import Link from "next/link";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import { keyframes } from "@emotion/react";
import { Post } from "@/modules/post/types/post";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { resolveMediaUrl } from "@/utils/mediaUrl";

const grow = keyframes`
  0% { transform: scaleX(0); }
  100% { transform: scaleX(1); }
`;

interface BookmarkCardProps {
  post: Post;
  onUnbookmark: (postId: string) => void;
}

export default function BookmarkCard({
  post,
  onUnbookmark,
}: BookmarkCardProps) {
  const progress = Math.min(
    100,
    Math.round((post.current_amount / post.goal_amount) * 100),
  );

  const postImage = post.images?.[0]?.path
    ? resolveMediaUrl(post.images[0].path)
    : undefined;

  const handleUnbookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onUnbookmark(post.id);
  };

  return (
    <Card
      sx={{
        mb: 2,
        borderRadius: 3,
        height: { xs: "auto", sm: 160 },
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        border: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
        transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 24px rgba(24, 197, 155, 0.25)",
        },
        "&:hover .progress-bar-fill": {
          animation: `${grow} 1s ease-out forwards`,
        },
      }}
    >
      <Link
        href={`/post/show/${post.id}`}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            height: "100%",
            position: "relative",
          }}
        >
          {/* Unbookmark Button */}
          <IconButton
            onClick={handleUnbookmark}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              bgcolor: "white",
              color: "primary.main",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              "&:hover": { bgcolor: "grey.100", color: "error.main" },
            }}
          >
            <BookmarkIcon fontSize="small" />
          </IconButton>

          {/* Post Image */}
          <Box
            sx={{
              width: { xs: "100%", sm: 200 },
              height: { xs: 200, sm: "100%" },
              bgcolor: "grey.100",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {postImage ? (
              <Box
                component="img"
                src={postImage}
                alt={post.post_header}
                sx={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <VolunteerActivismIcon sx={{ fontSize: 40, color: "grey.300" }} />
            )}
          </Box>

          {/* Content */}
          <CardContent
            sx={{
              flex: 1,
              p: 2,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Stack spacing={1}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="flex-start"
                pr={4}
              >
                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{
                    fontSize: "1.1rem",
                    lineClamp: 1,
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {post.post_header}
                </Typography>
              </Box>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  lineClamp: 2,
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {post.post_description}
              </Typography>
            </Stack>

            <Box mt={1}>
              <Box display="flex" justifyContent="space-between" mb={0.5}>
                <Typography variant="caption" fontWeight={600} color="#18C59B">
                  {progress}% funded
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {post.supporter ?? 0} supporters
                </Typography>
              </Box>
              <Box
                sx={{
                  width: "100%",
                  height: 6,
                  bgcolor: "#eee",
                  borderRadius: 3,
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <Box
                  className="progress-bar-fill"
                  sx={{
                    width: `${progress}%`,
                    height: "100%",
                    bgcolor: "#18C59B",
                    transformOrigin: "left",
                  }}
                />
              </Box>
            </Box>
          </CardContent>
        </Box>
      </Link>
    </Card>
  );
}
