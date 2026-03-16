import { Box, Typography, Button, Avatar, Paper } from "@mui/material";
import { UserPublicResponse } from "@/modules/user/types/user";
import { resolveMediaUrl } from "@/utils/mediaUrl";

type Props = {
  user: UserPublicResponse;
};

export default function CreatorCard({ user }: Props) {
  const fullName =
    [user.first_name, user.surname].filter(Boolean).join(" ").trim() ||
    user.username ||
    "Unknown User";
  const avatarUrl = user.media?.path
    ? resolveMediaUrl(user.media.path)
    : undefined;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        pt: 6,
        borderRadius: 4,
        border: "1px solid",
        borderColor: "rgba(0,0,0,0.08)",
        position: "relative",
        mt: 5,
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        overflow: "visible",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: -32,
          left: 24,
        }}
      >
        <Avatar
          src={avatarUrl}
          sx={{
            width: 72,
            height: 72,
            border: "4px solid white",
            bgcolor: "#FF4081",
            fontSize: 28,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          {fullName.charAt(0).toUpperCase()}
        </Avatar>
      </Box>

      <Typography variant="h6" fontWeight={800} gutterBottom>
        {fullName}
      </Typography>

      <Typography
        variant="body2"
        fontWeight={600}
        gutterBottom
        sx={{ color: "text.secondary", mb: 2 }}
      >
        {user.campaign_number ?? 0} created • {user.contribution_number ?? 0}{" "}
        backed
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          mb: 3,
          lineHeight: 1.6,
          display: "-webkit-box",
          WebkitLineClamp: 4,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {user.user_description || "No biography available."}
      </Typography>

      <Button
        variant="outlined"
        color="inherit"
        fullWidth
        sx={{
          borderRadius: 3,
          textTransform: "none",
          fontWeight: 700,
          borderColor: "rgba(0,0,0,0.12)",
          "&:hover": {
            borderColor: "rgba(0,0,0,0.3)",
            bgcolor: "rgba(0,0,0,0.02)",
          },
        }}
      >
        See Profile
      </Button>
    </Paper>
  );
}
