"use client";

import { useMemo, useState, useEffect } from "react";
import { Box } from "@mui/material";
import { TabKey } from "../types/types";
import { Post } from "@/modules/post/types/post";
import CampaignTabs from "./CampaignTabs";
import CampaignSlider from "./CampaignSlider";
import { getTopPledgedCampaigns} from "../api/api";
import { getForYouCampaigns } from "@/modules/post/api/api";
import { useUser } from "@clerk/nextjs";

const DEFAULT_LIMIT = 10

type Props = {
  onHoverBackground?: (img: string | null) => void;
};

export default function CampaignPart({onHoverBackground }: Props) {
  const { user, isSignedIn } = useUser();
  const clerkId = user?.id;
  const [tab, setTab] = useState<TabKey>("popular")
  const [category, setCategory] = useState<string | null>(null) 
  const [campaigns, setCampaigns] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const fetchData = async () => {
      try {
        let data: Post[] = [];

        if (tab === "popular") {
          data = await getTopPledgedCampaigns({
            category: category ?? undefined,
            limit: DEFAULT_LIMIT,
          });
        }

        if (tab === "forYou" && clerkId) {
          data = await getForYouCampaigns(clerkId);
        }

        if (!cancelled) {
          setCampaigns(data);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    console.log(clerkId)
    fetchData();

    return () => {
      cancelled = true;
    };
  }, [tab, category, clerkId]);

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
