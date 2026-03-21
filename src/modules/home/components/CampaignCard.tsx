"use client";

import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Chip,
  Box,
  Button,
} from "@mui/material";
import { Campaign, CampaignSummary } from "@/modules/campaign/types/campaign";
import { FundingProgress } from "./LinearProgress";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import IconButton from "@mui/material/IconButton";
import { resolveMediaUrl } from "@/utils/mediaUrl";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CATEGORY_COLORS } from "../utils/categoryColors";
import { useAuth } from "@clerk/nextjs";
import { toggleBookmark } from "@/modules/campaign/api/api";

export default function ProjectCard({
  campaign,
  onHoverBackground,
}: {
  campaign: Campaign | CampaignSummary;
  onHoverBackground?: (img: string | null) => void;
}) {
  const { getToken, isSignedIn } = useAuth();
  const [bookmarked, setBookmarked] = useState(campaign.is_bookmarked ?? false);

  useEffect(() => {
    setBookmarked(campaign.is_bookmarked ?? false);
  }, [campaign.is_bookmarked]);

  const router = useRouter();
  const categoryKey = String(campaign.category) as keyof typeof CATEGORY_COLORS;

  const category = CATEGORY_COLORS[categoryKey] ?? CATEGORY_COLORS.all;
  return (
    <Link
      href={`/campaign/show/${campaign.id}`}
      style={{ textDecoration: "none" }}
    >
      <Card
        onMouseEnter={() => {
          const img = campaign.images?.[0]?.path
            ? resolveMediaUrl(campaign.images[0].path)
            : null;

          onHoverBackground?.(img);
        }}
        onMouseLeave={() => onHoverBackground?.(null)}
        sx={{
          width: { xs: 320, md: 420 },
          height: { xs: 420, md: 540 },
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: 3,
          position: "relative",
          "&:hover .hoverContent": {
            transform: "translateY(0)",
            opacity: 1,
          },
          "&:hover .favorite": {
            transform: "translateY(0)",
            opacity: 1,
          },
          "&:hover img": {
            filter: "blur(5px)",
          },
        }}
      >
        {/* Image */}
        <CardMedia
          component="img"
          image={
            campaign.images?.[0]?.path
              ? resolveMediaUrl(campaign.images[0].path)
              : ""
          }
          alt={campaign.campaign_header}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "filter 0.3s ease",
          }}
        />

        {/* 🔖 Bookmark button */}
        {isSignedIn && (
          <Box
            className="favorite"
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              zIndex: 3,

              opacity: 0,
              transform: "scale(0.9)",
              transition: "all 0.25s ease",
            }}
          >
            <IconButton
              onPointerDown={(e) => e.stopPropagation()}
              onClick={async (e) => {
                e.preventDefault();
                e.stopPropagation();

                try {
                  const token = await getToken();
                  if (!token) {
                    // Maybe redirect to sign-in or show a message
                    router.push("/sign-in");
                    return;
                  }
                  const res = await toggleBookmark(campaign.id, token);
                  setBookmarked(res.bookmarked);
                } catch (err) {
                  console.error("Failed to toggle bookmark", err);
                }
              }}
              sx={{
                width: 44,
                height: 44,
                borderRadius: "50%",

                background: "rgba(255,255,255,0.65)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",

                boxShadow: "0 6px 20px rgba(0,0,0,0.25)",

                "&:hover": {
                  background: "rgba(255,255,255,0.85)",
                },
              }}
            >
              {bookmarked ? (
                <BookmarkIcon sx={{ color: "rgba(18, 201, 152, 1)" }} />
              ) : (
                <BookmarkBorderIcon sx={{ color: "#333" }} />
              )}
            </IconButton>
          </Box>
        )}

        {/* Gradient shadow */}
        <Box
          sx={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: "60%",
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.8))",
            pointerEvents: "none",
          }}
        />

        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            px: 2,
            pb: 2,
            color: "#fff",
            // bgcolor: "red",
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Chip
            label={category.label}
            size="small"
            sx={{
              fontFamily: "var(--font-montserrat)",
              alignSelf: "flex-start",
              fontWeight: 700,
              bgcolor: category.color,
              color: "#fff",
            }}
          />

          <Typography
            fontWeight={600}
            fontSize="1.25rem"
            sx={{
              fontFamily: "var(--font-montserrat)",
              textShadow:
                "0 2px 8px rgba(0,0,0,0.8), 0 1px 3px rgba(0,0,0,0.9)",
            }}
          >
            {campaign.campaign_header}
          </Typography>
          <Typography
            component="div"
            fontWeight={600}
            fontSize="1rem"
            sx={{
              fontFamily: "var(--font-montserrat)",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            {/* Avatar */}
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                overflow: "hidden",
                bgcolor: campaign.user.media?.path ? "transparent" : "gray",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {campaign.user.media?.path ? (
                <Box
                  component="img"
                  src={resolveMediaUrl(campaign.user.media.path)}
                  alt={campaign.user.username}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <Typography
                  sx={{
                    fontSize: 14,
                    fontWeight: 600,
                    textShadow:
                      "0 2px 8px rgba(0,0,0,0.8), 0 1px 3px rgba(0,0,0,0.9)",
                    color: "#rgba(255, 255, 255, 0.14)",
                    lineHeight: 1,
                    textTransform: "uppercase",
                  }}
                >
                  {campaign.user.username?.charAt(0) || "?"}
                </Typography>
              )}
            </Box>

            {/* Name */}
            {campaign.user.username}
          </Typography>
        </Box>

        <Box
          className="hoverContent"
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            px: 2,
            py: 2,
            height: "50%",
            bgcolor: "white",
            transform: "translateY(100%)",
            opacity: 0,
            transition: "all 0.3s ease",
            borderRadius: "16px 16px 0 0",

            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* 🔹 Top: Description (flexible) */}
          <Box
            sx={{
              flexGrow: 1,
              overflow: "hidden",
            }}
          >
            <Typography
              fontWeight={600}
              fontSize={16}
              sx={{
                display: "-webkit-box",
                WebkitLineClamp: 5,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {campaign.campaign_description}
            </Typography>
          </Box>

          {/* 🔹 Bottom: Fixed actions */}
          <Box
            sx={{
              pt: 2,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <FundingProgress
              current={campaign.current_amount ?? 0}
              goal={campaign.goal_amount ?? 0}
            />

            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              width="100%"
            >
              <Box>
                {(() => {
                  const now = new Date();
                  const startDate = campaign.effective_start_from
                    ? new Date(campaign.effective_start_from.replace(" ", "T"))
                    : null;
                  const endDate = campaign.effective_end_date
                    ? new Date(campaign.effective_end_date.replace(" ", "T"))
                    : null;

                  const isExpired = endDate ? endDate < now : false;
                  const isUpcoming = startDate ? startDate > now : false;
                  const isSuspended = campaign.state === "suspend";
                  const isOngoing =
                    (campaign.state === "published" ||
                      campaign.state === "success") &&
                    !isExpired &&
                    !isUpcoming;

                  if (isSuspended)
                    return (
                      <Chip
                        label="SUSPENDED"
                        size="small"
                        sx={{
                          fontWeight: 700,
                          bgcolor: "error.main",
                          color: "white",
                        }}
                      />
                    );
                  if (isUpcoming)
                    return (
                      <Chip
                        label="UPCOMING"
                        size="small"
                        sx={{
                          fontWeight: 700,
                          bgcolor: "info.main",
                          color: "white",
                        }}
                      />
                    );
                  if (isExpired)
                    return (
                      <Chip
                        label="END"
                        size="small"
                        sx={{
                          fontWeight: 700,
                          bgcolor: "grey.500",
                          color: "white",
                        }}
                      />
                    );
                  if (isOngoing)
                    return (
                      <Chip
                        label="ONGOING"
                        size="small"
                        sx={{
                          fontWeight: 700,
                          bgcolor: "warning.main",
                          color: "black",
                        }}
                      />
                    );
                  return null;
                })()}
              </Box>

              <Button
                variant="contained"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  router.push(`/payment/${campaign.id}`);
                }}
                sx={{
                  alignSelf: "center",
                  color: "#fff",
                  bgcolor: "#12C998",
                  borderRadius: 2,
                  fontWeight: "bold",
                  fontFamily: "var(--font-montserrat)",
                  px: 3,
                }}
              >
                <Box display="flex" alignItems="center" gap={1}>
                  Contribute <ThumbUpAltIcon />
                </Box>
              </Button>
            </Box>
          </Box>
        </Box>
      </Card>
    </Link>
  );
}
