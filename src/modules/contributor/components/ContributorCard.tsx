"use client";

import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Stack,
  Chip,
  keyframes,
} from "@mui/material";
import { ContributorWithPost } from "../types";
import Link from "next/link";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import { resolveMediaUrl } from "@/utils/mediaUrl";

const grow = keyframes`
  0% { transform: scaleX(0); }
  100% { transform: scaleX(1); }
`;

interface ContributorCardProps {
  contribution: ContributorWithPost;
}

export default function ContributorCard({
  contribution,
}: ContributorCardProps) {
  const { post, total_amount, updated_at } = contribution;
  const progress = Math.min(
    100,
    Math.round((post.current_amount / post.goal_amount) * 100),
  );

  const postImage = post.images?.[0]?.path
    ? resolveMediaUrl(post.images[0].path)
    : undefined;

  return (
    <Card
      sx={{
        mb: 2,
        borderRadius: 3,
        height: { xs: "auto", sm: 200 },
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        border: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
        transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 24px rgba(18, 201, 152, 0.25)",
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
          }}
        >
          {/* Post Image */}
          <Box
            sx={{
              width: { xs: "100%", sm: 240 },
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
            <Stack spacing={1.5}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="flex-start"
              >
                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{
                    lineClamp: 1,
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {post.post_header}
                </Typography>
                <Chip
                  label={`฿${total_amount.toLocaleString()}`}
                  size="small"
                  color="success"
                  variant="outlined"
                  sx={{ fontWeight: 700 }}
                />
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
                  minHeight: 40,
                }}
              >
                {post.post_description}
              </Typography>
            </Stack>

            <Box>
              <Box display="flex" justifyContent="space-between" mb={0.5}>
                <Typography variant="caption" fontWeight={600} color="#12C998">
                  {progress}% funded
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Last updated: {new Date(updated_at).toLocaleDateString()}
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
                    bgcolor: "#12C998",
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
