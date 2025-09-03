import {
  Box as MuiBox,
  Paper,
  Typography,
} from "@mui/material";

// Contributions
export default function ContributionsPanel() {
  return (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h5" fontWeight={700}>Contributions</Typography>
      {/* TODO: list contributions */}
    </Paper>
  );
}