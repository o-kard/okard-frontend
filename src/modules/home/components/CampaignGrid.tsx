import { Box } from "@mui/material";
import ImageCard from "./ImageCard";
import { Post } from "@/modules/post/types/post";

export default function CampaignGrid({ campaigns }: { campaigns: Post[] }) {

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "repeat(2, 1fr)",   
          md: "repeat(4, 1fr)",   
        },
        gap: 3,
        // alignItems: "stretch",
      }}
    >
      {campaigns.slice(0, 7).map((campaign, index) => {
        // FEATURED (ตัวแรก)
        if (index === 0) {
          return (
            <Box key={campaign.id} sx={{ gridColumn: "1 / span 2",  }}>
              <ImageCard campaign={campaign} big  />
            </Box>
          );
        }

        // p2, p3 (อยู่แถวบน)
        if (index === 1 || index === 2) {
          return (
            <ImageCard
              key={campaign.id}
              campaign={campaign}
              // big
            />
          );
        }

        // p4 - p7 (แถวล่าง)
        return (
          <ImageCard
            key={campaign.id}
            campaign={campaign}
          />
        );
      })}
    </Box>
  );
}
