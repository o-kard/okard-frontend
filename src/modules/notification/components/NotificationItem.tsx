import { Grid, Typography, IconButton, Chip } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import type { Notification } from "../types/notification";

function typeLabel(t: Notification["type"]) {
  switch (t) {
    case "goal":
      return "Goal reached";
    case "comment":
      return "Comment";
    case "like":
      return "Like";
    case "reminder":
      return "Reminder";
    case "system_alert":
      return "System";
    default:
      return t;
  }
}

export default function NotificationItem({
  n,
  onDelete,
}: {
  n: Notification;
  onDelete?: (id: string) => void;
}) {
  return (
    <Grid
      container
      spacing={1.5}
      sx={(theme) => ({
        p: 1.5,
        borderRadius: 2,
        "&:hover": { backgroundColor: theme.palette.action.hover },
      })}
      alignItems="flex-start"
    >
      <Grid size={{ xs: 12, md: 12 }}>
        <Chip label={typeLabel(n.type)} size="small" />
      </Grid>

      <Grid size={{ xs: 10, md: 10 }}>
        <Typography variant="subtitle2">{n.notification_title}</Typography>
        {n.notification_message && (
          <Typography variant="body2" color="text.secondary">
            {n.notification_message}
          </Typography>
        )}
        <Typography variant="caption" color="text.disabled">
          {new Date(n.created_at).toLocaleString()}
        </Typography>
      </Grid>

      <Grid size={{ xs: 2, md: 2 }}>
        <IconButton size="small" onClick={() => onDelete?.(n.id)}>
          <CloseRoundedIcon fontSize="small" />
        </IconButton>
      </Grid>
    </Grid>
  );
}
