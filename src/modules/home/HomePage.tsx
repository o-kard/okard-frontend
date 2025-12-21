import { Box } from "@mui/material"
import BubbleSection from "./section/BubbleSection"
import CampaignSection from "./section/CampaignSection"
import ExploreTopCampaignSection from "./section/ExploreTopCampaginSection"
import CategoryDashboardSection from "./section/CategoryDashboardSection"

export default function HomePage() {
  return (
    <Box>
      <BubbleSection />
      <CampaignSection />
      <ExploreTopCampaignSection />
      <CategoryDashboardSection />
    </Box>
  )
}
