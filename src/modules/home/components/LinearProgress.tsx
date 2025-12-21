import { Box, Typography, LinearProgress } from "@mui/material";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";


export function FundingProgress({ current, goal }: { current: number; goal: number }) {
  const percent = Math.min((current / goal) * 100, 100);
  const left = goal - current;

  return (
    <Box sx={{ width: "100%" }}>
      {/* Top row */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        {/* Left badge */}
        <Box
          sx={{
            bgcolor: "#f8bbd0",
            color: "#880e4f",
            px: 1.5,
            py: 0.25,
            borderRadius: "999px",
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          {left > 0
            ? `${left.toLocaleString()} USD LEFT`
            : left < 0
            ? `+${Math.abs(left).toLocaleString()} USD`
            : "GOAL REACHED"}
        </Box>

        {/* Goal */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <FlagOutlinedIcon sx={{ fontSize: 18 }} />
          <Typography fontSize={14} fontWeight={600}>
            {goal.toLocaleString()} USD
          </Typography>
        </Box>
      </Box>

      {/* Progress bar */}
      <LinearProgress
        variant="determinate"
        value={percent}
        sx={{
          height: 8,
          borderRadius: 999,
          backgroundColor: "#fce4ec",
          "& .MuiLinearProgress-bar": {
            backgroundColor: "#f06292",
            borderRadius: 999,
          },
        }}
      />
    </Box>
  );
}
