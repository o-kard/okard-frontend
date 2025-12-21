import { Box, Typography } from "@mui/material";
import { Post } from "@/modules/post/types/post";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import IconButton from "@mui/material/IconButton";
import { useState } from "react";
import Link from "next/dist/client/link";

type ResponsiveNumber = number | { xs?: number; sm?: number; md?: number; lg?: number; xl?: number };

type ImageCardProps = {
  campaign: Post;
  big?: boolean;
  minHeight?: ResponsiveNumber;
};

export default function ImageCard({
  campaign,
  big = false,
}: ImageCardProps) {
    const [bookmarked, setBookmarked] = useState(false);
  return (
    <Link
      href={`/post/show/${campaign.id}`}
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
        height: {xs: "200px", md:"300px"},
        "&:hover .favorite": {
            transform: "translateY(0)",
            opacity: 1
          },
      }}
    >
      {/* Image */}
      <Box
        component="img"
        src={ campaign?.images?.[0]?.path
        ? `${process.env.NEXT_PUBLIC_API_URL}${campaign.images[0].path}`
        : undefined}
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
        background:"linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.5))",
        
        "&:hover":{
        transition: "all 0.3s ease",
        boxShadow: "0 12px 32px rgba(0,0,0,0.25)",
        background:"linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.7))",

            }
        }}
      />
        {/* Bookmark button */}
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
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setBookmarked((prev) => !prev);
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
              <BookmarkIcon sx={{ color: "rgba(255, 204, 0, 1)" }} />
            ) : (
              <BookmarkBorderIcon sx={{ color: "#333" }} />
            )}
          </IconButton>
        </Box>
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
        <Typography fontWeight={600} fontSize={big ? "1.25rem" :"1rem"} sx={{fontFamily: "var(--font-montserrat)",}}>
        {campaign.post_header}
        </Typography>

          <Typography
            fontWeight={600}
            fontSize={big ? "1rem" :"0.75rem"}
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
              width: 24,
              height: 24,
              borderRadius: "50%",
              overflow: "hidden",
              bgcolor: campaign.user.image?.path ? "transparent" : "gray",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {campaign.user.image?.path ? (
              <Box
                component="img"
                src={`${process.env.NEXT_PUBLIC_API_URL}${campaign.user.image.path}`}
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
          <Box display="flex" flexDirection="row" justifyContent="flex-start">
            <Typography fontSize={big ? "0.8rem" : "0.75rem"} sx={{whiteSpace:"normal", wordBreak:"break-word"}}>
                {campaign.current_amount?.toLocaleString() ?? 0} USD raised | <span style={{ color: "#12C998" }}>{campaign.progress}%</span> funded
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
