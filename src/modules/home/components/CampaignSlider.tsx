"use client";

import useEmblaCarousel from "embla-carousel-react";
import { Box } from "@mui/material";
import { Project, HomeCampaign } from "../types/types";
import CampaignCard from "./CampaignCard";
import { useEffect } from "react";

type Props = {
  campaigns: HomeCampaign[];
  resetKey: string;
  onHoverBackground?: (img: string | null) => void;
};

export default function CampaignSlider({ campaigns, resetKey, onHoverBackground }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    dragFree: true,
    containScroll: "trimSnaps",
  });

    useEffect(() => {
    if (emblaApi) {
      emblaApi.scrollTo(0, true);
    }
  }, [resetKey, emblaApi]);

  return (
    <Box sx={{ overflow: "hidden", width: "100%", py: 1 }} ref={emblaRef}>
      <Box sx={{ display: "flex", gap: 1 }}>
        {campaigns.map((campaign) => (
          <Box key={campaign.id} sx={{ flex: "0 0 auto", width: { xs: 320, md: 420 }}}>
            <CampaignCard campaign={campaign} key={campaign.id} onHoverBackground={onHoverBackground} />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
