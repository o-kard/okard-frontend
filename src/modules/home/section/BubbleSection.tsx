// BubbleSection.tsx
import { Box } from "@mui/material";
import BubbleCarousel from "../components/BubbleCarousel";
import { getTopPledgedCampaigns } from "../api/api";
import { groupByCategory } from "../utils/groupByCategory";

export default async function BubbleSection() {
  const projects = await getTopPledgedCampaigns({
    limit: 20, 
  });

  const groups = groupByCategory(projects ?? []);

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <BubbleCarousel groups={groups} />
    </Box>
  );
}
