"use client";

import { FC } from "react";
import { Box, Typography, IconButton, Select, MenuItem } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { CampaignSummary } from "@/modules/campaign/types/campaign";
import { CATEGORY_COLORS } from "../utils/categoryColors";
import { resolveMediaUrl } from "@/utils/mediaUrl";

type Props = {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  activeItem: CampaignSummary | null;
  isMoving: boolean;
  onActionClick: () => void;

  categories: string[];
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
};

const InfiniteMenuUI: FC<Props> = ({
  canvasRef,
  activeItem,
  isMoving,
  onActionClick,
  categories,
  selectedCategory,
  onCategoryChange,
}) => {
  return (
    <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
      {/* Canvas */}
      <Box
        component="canvas"
        ref={canvasRef}
        sx={{
          cursor: "grab",
          width: "100%",
          height: "100%",
          outline: "none",
          "&:active": { cursor: "grabbing" },
        }}
      />
      {/* ===== Category Dropdown ===== */}
      <Box
        sx={{
          position: "absolute",
          top: 96,
          right: { xs: "5%", md: 32 },
          zIndex: 20,
          bgcolor: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(8px)",
          borderRadius: 2,
          px: 2,
          py: 1,
          opacity: isMoving ? 0 : 1,
          pointerEvents: isMoving ? "none" : "auto",
          transition: "0.3s ease",
        }}
      >
        <Typography sx={{ color: "#aaa", fontSize: "16px", mb: 0.5 }}>
          Category
        </Typography>

        <Select
          size="small"
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value as string)}
          MenuProps={{
            PaperProps: {
              sx: {
                bgcolor: "#111",
                color: "#fff",
                borderRadius: 2,
                border: "1px solid rgba(255,255,255,0.15)",
              },
            },
          }}
          sx={{
            minWidth: 160,
            color: "white",
            ".MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(255,255,255,0.3)",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#12C998",
            },
            ".MuiSvgIcon-root": {
              color: "white",
            },
          }}
        >
          <MenuItem value="ALL">All</MenuItem>

          {categories.map((c) => {
            const key = c as keyof typeof CATEGORY_COLORS;
            const label = CATEGORY_COLORS[key]?.label ?? c;

            return (
              <MenuItem key={c} value={c}>
                {label}
              </MenuItem>
            );
          })}
        </Select>
      </Box>
      {/* Left */}

      {activeItem && (
        <>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "1rem",
              width: "24vw",
              transform: "translate(20%, -50%)",
              opacity: isMoving ? 0 : 1,
              pointerEvents: isMoving ? "none" : "auto",
              transition: "0.4s ease",
              "@media (max-width:1500px)": { display: "none" },
              // bgcolor: "red",
            }}
          >
            <Typography
              sx={{
                mb: 1,
                fontSize: "1rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.7)",
              }}
            >
              {activeItem?.category}
            </Typography>
            {/* Title */}
            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                color: "white",
                wordBreak: "break-word",
                overflowWrap: "break-word",
                whiteSpace: "normal",
                lineHeight: 1.1,
              }}
            >
              {activeItem.campaign_header}
            </Typography>
            {/* Creator */}
            <Box
              sx={{
                mt: 1,
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                color: "white",
                fontSize: "1.25rem",
                fontWeight: 500,
              }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: activeItem.user.media?.path
                    ? "transparent"
                    : "rgba(255,255,255,0.25)",
                  overflow: "hidden",
                }}
              >
                {activeItem.user.media?.path ? (
                  <Box
                    component="img"
                    src={resolveMediaUrl(activeItem.user.media.path)}
                    alt={activeItem.user.username}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <Typography
                    sx={{
                      color: "white",
                      fontSize: "0.9rem",
                      fontWeight: 700,
                      lineHeight: 1,
                      textTransform: "uppercase",
                      userSelect: "none",
                    }}
                  >
                    {activeItem.user.username?.charAt(0) ?? "?"}
                  </Typography>
                )}
              </Box>

              {/* Creator name */}
              <Typography
                variant="body2"
                sx={{
                  color: "white",
                  fontWeight: 500,
                  wordBreak: "break-word",
                  fontSize: "1.25rem",
                }}
              >
                {activeItem.user.username}
              </Typography>
            </Box>
          </Box>
          {/* Right */}
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              right: "1rem",
              width: "24vw",
              transform: "translate(-20%, -50%)",
              opacity: isMoving ? 0 : 1,
              pointerEvents: isMoving ? "none" : "auto",
              transition: "0.4s ease",
              "@media (max-width:1500px)": { display: "none" },
              // bgcolor: "blue",

              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {/* Description (ด้านบน) */}
            <Typography
              sx={{
                color: "white",
                wordBreak: "break-word",
                overflowWrap: "break-word",
                whiteSpace: "normal",
                lineHeight: 1.4,
                fontSize: "1rem",
              }}
            >
              {activeItem.campaign_description}
            </Typography>

            {/* Stats row (ด้านล่าง แถวเดียว) */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                pt: 1.5,
                borderTop: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              {/* Supporters */}
              <Box
                sx={{
                  textAlign: "center",
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "1rem",
                    color: "white",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                >
                  Supporters
                </Typography>
                <Typography
                  sx={{
                    fontSize: "1.2rem",
                    fontWeight: 700,
                    color: "white",
                  }}
                >
                  {activeItem.supporters?.toLocaleString() || 0}
                </Typography>
              </Box>

              {/* Pledged */}
              <Box
                sx={{
                  textAlign: "center",
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "1rem",
                    color: "white",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                >
                  Pledged
                </Typography>
                <Typography
                  sx={{
                    fontSize: "1.2rem",
                    fontWeight: 700,
                    color: "white",
                  }}
                >
                  {(activeItem.current_amount ?? 0).toLocaleString()}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Action Button */}
          <IconButton
            onClick={onActionClick}
            sx={{
              position: "absolute",
              left: "50%",
              bottom: isMoving ? "-80px" : "2.0em",
              transform: isMoving
                ? "translateX(-50%) scale(0)"
                : "translateX(-50%) scale(1)",
              opacity: isMoving ? 0 : 1,
              transition: "0.4s ease",
              width: 60,
              height: 60,
              borderRadius: "50%",
              backgroundColor: "#12C998",
              border: "5px solid #000",
              color: "#fff",
              "&:hover": { backgroundColor: "#F472B6" },
            }}
          >
            <OpenInNewIcon sx={{ fontSize: 26 }} />
          </IconButton>
        </>
      )}
    </Box>
  );
};

export default InfiniteMenuUI;
