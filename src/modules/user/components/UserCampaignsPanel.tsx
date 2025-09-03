import {
  Box as MuiBox,
  Paper,
  Typography,
} from "@mui/material";

// Campaigns
export default function CampaignsPanel() {
  return (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h5" fontWeight={700}>My Campaigns</Typography>
      {/* TODO: list campaigns */}
    </Paper>
  );
}