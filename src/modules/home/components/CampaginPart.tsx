"use client";

import { useMemo, useState, useEffect } from "react";
import { Box, CircularProgress } from "@mui/material";
import { TabKey } from "../types/types";
import { Campaign, CampaignSummary } from "@/modules/campaign/types/campaign";
import CampaignTabs from "./CampaignTabs";
import CampaignSlider from "./CampaignSlider";
import { getTopPledgedCampaigns } from "../api/api";
import { getForYouCampaigns } from "@/modules/campaign/api/api";
import { useUser, useAuth } from "@clerk/nextjs";

const DEFAULT_LIMIT = 10;

type Props = {
  onHoverBackground?: (img: string | null) => void;
};

export default function CampaignPart({ onHoverBackground }: Props) {
  const { user, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const clerkId = user?.id;
  const [tab, setTab] = useState<TabKey>("popular");
  const [category, setCategory] = useState<string | null>(null);
  const [campaigns, setCampaigns] = useState<(Campaign | CampaignSummary)[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const fetchData = async () => {
      try {
        let data: (Campaign | CampaignSummary)[] = [];

        if (tab === "popular") {
          data = await getTopPledgedCampaigns({
            category: category ?? undefined,
            limit: DEFAULT_LIMIT,
          });
        }

        if (tab === "forYou") {
          const token = await getToken();
          data = await getForYouCampaigns(token || "");
        }

        if (!cancelled) {
          setCampaigns(data);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    console.log(clerkId);
    fetchData();

    return () => {
      cancelled = true;
    };
  }, [tab, category, clerkId, getToken]);

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
      {isSignedIn && <CampaignTabs activeTab={tab} onChange={setTab} />}
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "400px",
            width: "100%",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <CampaignSlider
          campaigns={campaigns}
          resetKey={tab}
          onHoverBackground={onHoverBackground}
        />
      )}
    </Box>
  );
}
