import { Box, Typography } from "@mui/material";
import { Campaign, CampaignSummary } from "@/modules/campaign/types/campaign";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import IconButton from "@mui/material/IconButton";
import { toggleBookmark } from "@/modules/campaign/api/api";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/dist/client/link";
import { resolveMediaUrl } from "@/utils/mediaUrl";
import { dispatchBookmarkToggled, subscribeToBookmarkToggled } from "@/utils/events";

type ResponsiveNumber =
  | number
  | { xs?: number; sm?: number; md?: number; lg?: number; xl?: number };

type ImageCardProps = {
  campaign: Campaign | CampaignSummary;
  big?: boolean;
  minHeight?: ResponsiveNumber;
};

export default function ImageCard({ campaign, big = false }: ImageCardProps) {
  const { getToken, isSignedIn } = useAuth();
  const [bookmarked, setBookmarked] = useState(campaign.is_bookmarked ?? false);
  const router = useRouter();

  useEffect(() => {
    setBookmarked(campaign.is_bookmarked ?? false);
  }, [campaign.is_bookmarked]);

  useEffect(() => {
    const unsubscribe = subscribeToBookmarkToggled((payload) => {
      if (payload.campaignId === campaign.id) {
        setBookmarked(payload.isBookmarked);
      }
    });
    return unsubscribe;
  }, [campaign.id]);

  return (
    <Link
      href={`/campaign/show/${campaign.id}`}
      style={{ textDecoration: "none" }}
    >
      <Box
        className="campaign-card"
        sx={{
          position: "relative",
          // aspectRatio: big ? "16 / 9" : "4 / 3",
          borderRadius: 3,
          overflow: "hidden",
          bgcolor: "#eee",
          height: { xs: "200px", md: "300px" },
          "&:hover .favorite": {
            transform: "translateY(0)",
            opacity: 1,
          },
        }}
      >
        {/* Image */}
        <Box
          component="img"
          src={
            campaign?.images?.[0]?.path
              ? resolveMediaUrl(campaign.images[0].path)
              : undefined
          }
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        {/* Gradient overlay */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.7))",

            "&:hover": {
              transition: "all 0.3s ease",
              boxShadow: "0 12px 32px rgba(0,0,0,0.25)",
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.8))",
            },
          }}
        />
        {/* Bookmark button */}
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
                    router.push("/sign-in");
                    return;
                  }
                  const res = await toggleBookmark(campaign.id, token);
                  setBookmarked(res.bookmarked);
                  dispatchBookmarkToggled(campaign.id, res.bookmarked);
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
                <BookmarkIcon sx={{ color: "rgba(18, 201, 152,1)" }} />
              ) : (
                <BookmarkBorderIcon sx={{ color: "#333" }} />
              )}
            </IconButton>
          </Box>
        )}ดรป
        {/* Text */}
        <Box
          sx={{
            position: "absolute",
            bottom: 12,
            left: 12,
            right: 12,
            color: "#fff",
          }}
        >
          {/* Campaign Title */}
          <Typography
            fontWeight={600}
            sx={{
              fontFamily: "var(--font-montserrat)",
              textShadow:
                "0 2px 8px rgba(0,0,0,0.8), 0 1px 3px rgba(0,0,0,0.9)",
              fontSize: {
                xs: big ? "0.95rem" : "0.85rem",
                sm: big ? "1.1rem" : "0.95rem",
                md: big ? "1.25rem" : "1rem",
              },
            }}
          >
            {campaign.campaign_header}
          </Typography>

          {/* User Info */}
          <Typography
            component="div"
            fontWeight={600}
            sx={{
              fontFamily: "var(--font-montserrat)",
              display: "flex",
              alignItems: "center",
              gap: 1,
              textShadow:
                "0 1px 4px rgba(0,0,0,0.7), 0 1px 2px rgba(0,0,0,0.8)",
              fontSize: {
                xs: big ? "0.75rem" : "0.7rem",
                sm: big ? "0.85rem" : "0.75rem",
                md: big ? "1rem" : "0.8rem",
              },
            }}
          >
            {/* Avatar */}
            <Box
              sx={{
                width: { xs: 20, sm: 22, md: 24 },
                height: { xs: 20, sm: 22, md: 24 },
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
                    fontSize: { xs: 12, sm: 13, md: 14 },
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.8)",
                    lineHeight: 1,
                    textTransform: "uppercase",
                  }}
                >
                  {campaign.user.username?.[0] ?? "?"}
                </Typography>
              )}
            </Box>

            {/* Name */}
            {campaign.user?.username}
          </Typography>

          {/* Progress Info */}
          <Box display="flex" flexDirection="row" justifyContent="flex-start">
            <Typography
              sx={{
                whiteSpace: "normal",
                wordBreak: "break-word",
                textShadow:
                  "0 1px 4px rgba(0,0,0,0.7), 0 1px 2px rgba(0,0,0,0.8)",
                fontSize: {
                  xs: big ? "0.7rem" : "0.65rem",
                  sm: big ? "0.75rem" : "0.7rem",
                  md: big ? "0.8rem" : "0.75rem",
                },
              }}
            >
              {campaign.current_amount?.toLocaleString() ?? 0} USD raised |{" "}
              <span style={{ color: "#12C998" }}>{campaign.progress}%</span>{" "}
              funded
            </Typography>
          </Box>
        </Box>
        {/* Bottom progress bar */}
        <Box
          sx={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 6,
            zIndex: 4,
            bgcolor: "rgba(255,255,255,0.25)",
            overflow: "hidden",
          }}
        >
          {/* static bar */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              bgcolor: "#f06292",
              transform: `scaleX(${(campaign.progress ?? 0) / 100})`,
              transformOrigin: "left",
              transition: "opacity 0.2s ease",
              ".campaign-card:hover &": {
                opacity: 0,
              },
            }}
          />

          {/* animated bar */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              bgcolor: "#f06292",
              transform: "scaleX(0)",
              transformOrigin: "left",
              transition: "transform 1s ease",
              ".campaign-card:hover &": {
                transform: `scaleX(${(campaign.progress ?? 0) / 100})`,
              },
            }}
          />
        </Box>
      </Box>
    </Link>
  );
}
