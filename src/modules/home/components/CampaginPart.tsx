"use client";

import { useMemo, useState, useEffect } from "react";
import { Box } from "@mui/material";
import { TabKey, Project, HomeCampaign } from "../types/types";
import CampaignTabs from "./CampaignTabs";
import CampaignSlider from "./CampaignSlider";
import { getTopPledgedCampaigns } from "../api/api";

const DEFAULT_LIMIT = 10

type Props = {
  // projects: Project[];
  onHoverBackground?: (img: string | null) => void;
};

export default function CampaignPart({onHoverBackground }: Props) {

  const [tab, setTab] = useState<TabKey>("popular")
  const [category, setCategory] = useState<string | null>(null) // สำหรับ popular
  const [campaigns, setCampaigns] = useState<HomeCampaign[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)

    getTopPledgedCampaigns({
      category: category ?? undefined,
      limit: DEFAULT_LIMIT,
    })
      .then(setCampaigns)
      .finally(() => setLoading(false))
  }, [category])

  return (
    <Box
        display="flex"
        flexDirection="column"
        sx={{
            alignItems: {
            xs: "center", 
            lg: "flex-start", 
            },
        }}
        >
    <CampaignTabs activeTab={tab} onChange={setTab}  />
    <CampaignSlider campaigns={campaigns} resetKey={tab} onHoverBackground={onHoverBackground}  />
    </Box>
  );
}
