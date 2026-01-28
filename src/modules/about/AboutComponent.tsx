"use client";

import React from "react";
import { Box } from "@mui/material";
import AboutHero from "./components/AboutHero";
import PlatformFeatures from "./components/PlatformFeatures";
import CreatorJourney from "./components/CreatorJourney";
import MissionVision from "./components/MissionVision";
import OurValues from "./components/OurValues";
import TeamSection from "./components/TeamSection";
import AboutCTA from "./components/AboutCTA";

const AboutComponent = () => {
  return (
    <Box sx={{ bgcolor: "#fafafa", overflowX: "hidden" }}>
      <AboutHero />
      <PlatformFeatures />
      <CreatorJourney />
      <MissionVision />
      <OurValues />
      <TeamSection />
      <AboutCTA />
    </Box>
  );
};

export default AboutComponent;
