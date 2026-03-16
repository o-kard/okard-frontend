"use client";

import {
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Box,
} from "@mui/material";
import type { DashboardCampaign } from "../types/dashboard";

export default function DashboardCampaigns({ campaigns }: { campaigns: DashboardCampaign[] }) {
  return (
    <Grid container spacing={2} mt={2}>
      {campaigns.map((campaign) => (
        <Grid size={{ xs: 12, md: 6 }} key={campaign.campaign_id}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {campaign.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Goal: {campaign.goal_amount.toLocaleString()} | Raised:{" "}
                {campaign.current_amount.toLocaleString()}
              </Typography>
              <Box mt={1}>
                <LinearProgress
                  variant="determinate"
                  value={campaign.hit_goal ? 100 : campaign.progress_pct}
                  sx={{
                    height: 10,
                    borderRadius: 5,
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: campaign.hit_goal ? "green" : undefined,
                    },
                    backgroundColor: campaign.hit_goal ? "lightgreen" : undefined,
                  }}
                />
              </Box>
              <Typography variant="body2" mt={1}>
                Investors: {campaign.investor_count} |{" "}
                {campaign.hit_goal ? "🎉 Goal Reached" : "In Progress"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
