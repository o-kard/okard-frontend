"use client";

import {
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Box,
} from "@mui/material";
import type { DashboardPost } from "../types/dashboard";

export default function DashboardPosts({ posts }: { posts: DashboardPost[] }) {
  return (
    <Grid container spacing={2} mt={2}>
      {posts.map((post) => (
        <Grid size={{ xs: 12, md: 6 }} key={post.post_id}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {post.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Goal: {post.goal_amount.toLocaleString()} | Raised:{" "}
                {post.current_amount.toLocaleString()}
              </Typography>
              <Box mt={1}>
                <LinearProgress
                  variant="determinate"
                  value={post.hit_goal ? 100 : post.progress_pct}
                  sx={{
                    height: 10,
                    borderRadius: 5,
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: post.hit_goal ? "green" : undefined,
                    },
                    backgroundColor: post.hit_goal ? "lightgreen" : undefined,
                  }}
                />
              </Box>
              <Typography variant="body2" mt={1}>
                Investors: {post.investor_count} |{" "}
                {post.hit_goal ? "🎉 Goal Reached" : "In Progress"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
