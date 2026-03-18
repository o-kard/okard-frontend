import { Campaign } from "../types/campaign";
import Link from "next/link";
import { resolveMediaUrl } from "@/utils/mediaUrl";
import {
  Box,
  Typography,
  Chip,
  Button,
  LinearProgress,
  IconButton,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { useAuth } from "@clerk/nextjs";
import { CATEGORY_COLORS } from "@/modules/home/utils/categoryColors";
import { toggleBookmark } from "../api/api";
import { useState, useEffect } from "react";

type Props = {
  campaigns: Campaign[];
  onEdit: (campaign: Campaign) => void;
  onDelete: (id: string) => void;
  gridXs?: number;
  gridSm?: number;
  gridMd?: number;
};

// Local component to handle individual campaign state (like bookmarks) without re-rendering the whole list
function CampaignCard({
  campaign,
  goal,
  raised,
  percent,
  isOngoing,
  img,
}: {
  campaign: Campaign;
  goal: number;
  raised: number;
  percent: number;
  isOngoing: boolean;
  img?: string;
}) {
  const { getToken } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(campaign.is_bookmarked || false);
  const [isHoveringBookmark, setIsHoveringBookmark] = useState(false);

  useEffect(() => {
    setIsBookmarked(campaign.is_bookmarked || false);
  }, [campaign.is_bookmarked]);

  const categoryConfig =
    CATEGORY_COLORS[campaign.category as keyof typeof CATEGORY_COLORS] ??
    CATEGORY_COLORS.all;
  const CategoryIcon = categoryConfig?.icon;

  const handleBookmarkClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const token = await getToken();
      if (!token) return;
      const res = await toggleBookmark(campaign.id, token);
      setIsBookmarked(res.bookmarked);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box
      className="card"
      sx={{
        position: "relative",
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: 2,
        bgcolor: "background.paper",
        transition: "box-shadow .2s ease, transform .2s ease",
        "&:hover": { boxShadow: 6, transform: "translateY(-2px)" },

        /* --- hover targets --- */
        "&:hover .imgOverlay": { opacity: 0.75 },
        "&:hover .textOnImage": { transform: "translateY(-35px)" },
        "&:hover .hoverCta": { opacity: 1, transform: "translateY(0)" },
        "&:hover .bookmarkBtn": { opacity: 1 },
      }}
    >
      {/* IMAGE AREA */}
      <Box sx={{ position: "relative", height: 300, bgcolor: "grey.200" }}>
        {img && (
          <Box
            component="img"
            src={img}
            alt={campaign.campaign_header}
            sx={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        )}

        <Chip
          icon={CategoryIcon ? <CategoryIcon /> : undefined}
          label={categoryConfig?.label ?? campaign.category}
          size="small"
          sx={{
            position: "absolute",
            top: 12,
            left: 12,
            zIndex: 8,
            fontWeight: 700,
            textTransform: "capitalize",
            bgcolor: categoryConfig?.color ?? "primary.main",
            color: "white",
            "& .MuiChip-icon": {
              color: "white",
            },
          }}
        />

        {/* Bookmark Icon */}
        <IconButton
          className="bookmarkBtn"
          onClick={handleBookmarkClick}
          onMouseEnter={() => setIsHoveringBookmark(true)}
          onMouseLeave={() => setIsHoveringBookmark(false)}
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            zIndex: 2,
            bgcolor: "rgba(255, 255, 255, 0.8)",
            opacity: isBookmarked ? 1 : 0, // Show if bookmarked, or if hovered via parent CSS
            transition: "opacity 0.2s ease, background-color 0.2s ease",
            "&:hover": {
              bgcolor: "white",
            },
          }}
          size="small"
        >
          {isBookmarked ? (
            <BookmarkIcon color="primary" fontSize="small" />
          ) : isHoveringBookmark ? (
            <BookmarkIcon sx={{ color: "text.secondary" }} fontSize="small" />
          ) : (
            <BookmarkBorderIcon
              sx={{ color: "text.secondary" }}
              fontSize="small"
            />
          )}
        </IconButton>

        {/* gradient overlay */}
        <Box
          className="imgOverlay"
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,1) 100%)",
            opacity: 0,
            transition: "opacity .25s ease",
            pointerEvents: "none",
          }}
        />

        {/* text on image */}
        <Box
          className="textOnImage"
          sx={{
            position: "absolute",
            left: 12,
            right: 12,
            bottom: 12,
            transform: "translateY(0)",
            transition: "transform .25s ease",
            pointerEvents: "none",
          }}
        >
          <Typography
            variant="subtitle1"
            fontWeight={700}
            color="#fff"
            sx={{ textShadow: "0 1px 2px rgba(0,0,0,.6)" }}
          >
            {campaign.campaign_header}
          </Typography>
          <Typography
            variant="h6"
            fontWeight={800}
            color="#fff"
            sx={{ textShadow: "0 1px 2px rgba(0,0,0,.6)" }}
          >
            {goal.toLocaleString()} USD
          </Typography>

          <Box sx={{ mt: 1 }}>
            <LinearProgress
              variant="determinate"
              value={percent}
              sx={{
                height: 6,
                borderRadius: 999,
                backgroundColor: "rgba(255,255,255,.35)",
                "& .MuiLinearProgress-bar": { borderRadius: 999 },
              }}
            />
            <Typography
              variant="caption"
              color="#fff"
              sx={{ display: "block", mt: 0.5, opacity: 0.9 }}
            >
              {raised.toLocaleString()} USD raised | {percent}% funded
            </Typography>
          </Box>
        </Box>

        {/* CTA */}
        <Box
          className="hoverCta"
          sx={{
            position: "absolute",
            left: 12,
            right: 12,
            bottom: 12,
            display: "flex",
            justifyContent: "flex-start",
            opacity: 0,
            transform: "translateY(10px)",
            transition: "opacity .25s ease, transform .25s ease",
          }}
        >
          <Button
            component={Link}
            href={`/campaign/show/${campaign.id}`}
            size="small"
            variant="contained"
            sx={{
              fontWeight: 700,
              borderRadius: 2,
              bgcolor: "common.white",
              color: "text.primary",
              "&:hover": { bgcolor: "grey.100" },
            }}
          >
            VIEW CAMPAIGN
          </Button>
        </Box>
      </Box>

      {/* BODY */}
      <Box sx={{ px: 2, pt: 1.5, pb: 2 }}>
        {campaign.campaign_description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 1,
              display: "-webkit-box",
              WebkitLineClamp: 5,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              height: "100px",
            }}
          >
            {campaign.campaign_description}
          </Typography>
        )}

        <Box sx={{ mt: 1.5, display: "flex", justifyContent: "flex-end" }}>
          {isOngoing && (
            <Chip
              label="ONGOING"
              size="small"
              sx={{
                fontWeight: 700,
                borderRadius: 999,
                bgcolor: "warning.main",
                color: "common.black",
                "& .MuiChip-label": { px: 1 },
              }}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default function CampaignList({
  campaigns,
  gridXs = 12,
  gridSm = 6,
  gridMd = 4,
}: Props) {
  return (
    <Grid container spacing={2}>
      {campaigns.map((campaign) => {
        const img = campaign.images?.[0]?.path
          ? resolveMediaUrl(campaign.images[0].path)
          : undefined;

        const goal = Math.max(0, campaign.goal_amount || 0);
        const raised = Math.max(0, campaign.current_amount || 0);
        const percent =
          goal > 0 ? Math.min(100, Math.round((raised / goal) * 100)) : 0;

        const isOngoing = campaign.state === "published";

        return (
          <Grid key={campaign.id} size={{ xs: gridXs, sm: gridSm, md: gridMd }}>
            <CampaignCard
              campaign={campaign}
              goal={goal}
              raised={raised}
              percent={percent}
              isOngoing={isOngoing}
              img={img}
            />
          </Grid>
        );
      })}
    </Grid>
  );
}
