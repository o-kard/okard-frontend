import { Grid, Typography, IconButton, Chip } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

  const handleClick = () => {
    if (n.post_id) {
      router.push(`/post/show/${n.post_id}`);
    }
  };

  return (
    <Grid
      container
      spacing={1.5}
      onClick={handleClick}
      sx={(theme) => ({
        p: 1.5,
        borderRadius: 2,
        cursor: n.post_id ? "pointer" : "default",
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

      <Grid size={{ xs: 2, md: 2 }} sx={{ textAlign: "right" }}>
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.(n.id);
          }}
        >
          <CloseRoundedIcon fontSize="small" />
        </IconButton>
      </Grid>
    </Grid>
  );
}
