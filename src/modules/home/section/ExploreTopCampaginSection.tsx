import { Box } from "@mui/material"
import ExploreTopCampaign from "../components/ExploreTopCampaign"

export default async function ExploreTopCampaignSection() {
  return <Box 
  sx={{
    mx: "auto", 
    maxWidth: "80%",
    py: { xs: 2, md: 4 },
    borderBottom: "1px solid #ddd",
  }}>
    <ExploreTopCampaign />
  </Box>
}