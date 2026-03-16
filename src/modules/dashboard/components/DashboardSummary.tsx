"use client";

import { Grid, Card, CardContent, Typography } from "@mui/material";
import type { DashboardSummary } from "../types/dashboard";

export default function DashboardSummary({
  summary,
}: {
  summary: DashboardSummary;
}) {
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 3 }}>
        <Card>
          <CardContent>
            <Typography variant="h6">Total Campaigns</Typography>
            <Typography variant="h4">{summary.campaign_count}</Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, md: 3 }}>
        <Card>
          <CardContent>
            <Typography variant="h6">Total Investors</Typography>
            <Typography variant="h4">{summary.unique_investor_count}</Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, md: 3 }}>
        <Card>
          <CardContent>
            <Typography variant="h6">Hit Goal Campaign Count</Typography>
            <Typography variant="h4">
              {summary.hit_goal_campaign_count.toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, md: 3 }}>
        <Card>
          <CardContent>
            <Typography variant="h6">Current Amount</Typography>
            <Typography variant="h4">
              {summary.total_raised.toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
