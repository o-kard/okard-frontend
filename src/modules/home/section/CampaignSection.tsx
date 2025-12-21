"use client";

import { Box } from "@mui/material"
import EmblaSliderCard from "../components/EmblaSliderCard";
import { useState } from "react";

export default function CampaignSection() {
  const [hoveredBg, setHoveredBg] = useState<string | null>(null);

  return (
    <Box sx={{ position: "relative", py: { xs: 4, md: 6 }, overflow: "hidden" }}>
      {/* Background */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: hoveredBg
            ? `url(${hoveredBg})`
            : "url('/pattern_2.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(10px)",
          transform: "scale(1.05)",
          transition: "background-image 0.4s ease",
          zIndex: 0,
        }}
      />

      {/* Overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: "rgba(255,255,255,0.2)",
          zIndex: 1,
        }}
      />

      {/* Content */}
      <Box sx={{ position: "relative", zIndex: 2 }}>
        <EmblaSliderCard onHoverBackground={setHoveredBg} />
      </Box>
    </Box>
  );
}
