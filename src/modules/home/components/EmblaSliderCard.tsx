"use client";

import { Box, Typography, Button } from "@mui/material";
import  CampaignPart  from "./CampaginPart";
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined';

export default function EmblaSliderCard({ onHoverBackground }: { onHoverBackground?: (img: string | null) => void; }) {
  return (
    <Box sx={{ py: 6, display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center' }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          width: "fit-content",
        }}
      >
      {/* Header container */}
      <Box
        sx={{
          py: 2,
          width: "100%",
          textAlign: { xs: "center", md: "left" }, 
        }}
      >
        {/* Title row */}
        <Typography
          fontWeight="bold"
          fontSize={{xs: "2rem", sm: "3rem", md: "3.5rem" }} 
          sx={{
            letterSpacing: { xs: "0.05rem", sm: "0.15rem", md: "0.25rem" },
            fontFamily: "var(--font-montserrat)",
            textShadow: `
              0 2px 8px rgba(0,0,0,0.12),
              0 6px 24px rgba(18,201,152,0.15)
            `,
          }}
        >
          CAMPAIGNS U{" "}
          <span
            style={{
              color: "#12C998",
              textShadow: "0 4px 20px rgba(18,201,152,0.45)",
            }}
          >
            INTEREST IN
          </span>
        </Typography>

        {/* Bottom row */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: { xs: "center", md: "flex-end" }, 
            mt: { xs: 1.5, md: 0 },
          }}
        >
          {/* Subtitle */}
          <Typography
            color="text.secondary"
            fontWeight="bold"
            sx={{
              fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" },
              whiteSpace: "nowrap",
              letterSpacing: "0.2rem",
              fontFamily: "var(--font-montserrat)",
            }}
          >
            TAKE YOUR TIME FOR CHOOSING
          </Typography>
        </Box>
      </Box>
      </Box>

      {/* Slider */}
      <Box
        sx={{
          width: "100%",
          mx: "auto",
          mt: 2,
          px: { xs: 2, md: 2 },
          py: { xs: 2, md: 4 },
        }}
      >
        <CampaignPart onHoverBackground={onHoverBackground} />
      </Box>

    
        {/* Button */}
        <Box sx={{ mt: 2}}>
          <Button
            variant="outlined"
            size="large"
            href="/post"
            sx={{
              bgcolor: "white",
              color: "#000",
              borderRadius: "12px",
              fontWeight: "700",
              fontSize: "1rem",
              borderWidth: 1,
              borderColor: "transparent",
              "&:hover": {
                borderColor: "#12C998",
                color: "#000",
                backgroundColor: "#12C998",
              },
            }}
          >
            SEE ALL CAMPAIGN <ArrowCircleRightOutlinedIcon sx={{ ml: 1, width: 32, height: 32 }} />
          </Button>
      </Box>
    </Box>
  );
}
