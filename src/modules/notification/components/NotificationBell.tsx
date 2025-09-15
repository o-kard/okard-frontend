import { useState } from "react";
import {
  Badge,
  Box,
  Divider,
  Grid,
  IconButton,
  Popover,
  Typography,
  Button,
} from "@mui/material";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import { useNotifications } from "./useNotifications";
import NotificationItem from "./NotificationItem";

export default function NotificationBell({ userId }: { userId?: string }) {
  const { items, unreadCount, loading, error, removeOne, refetch } =
    useNotifications({ userId, pollMs: 15000 });

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton
        onClick={(e) => setAnchorEl(open ? null : e.currentTarget)}
        color="inherit"
        aria-label="notifications"
        size="large"
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsNoneRoundedIcon />
        </Badge>
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{ sx: { width: 380, maxHeight: "70vh" } }}
      >
        <Box sx={{ p: 1.5 }}>
          <Grid container alignItems="center">
            <Grid size={{ xs: 9, md: 9 }}>
              <Typography variant="subtitle1" fontWeight={700}>
                Notifications
              </Typography>
            </Grid>
            <Grid size={{ xs: 3, md: 3 }}>
              <Button size="small" onClick={refetch}>
                Refresh
              </Button>
            </Grid>
          </Grid>
        </Box>
        <Divider />

        {loading && (
          <Box sx={{ p: 2 }}>
            <Typography variant="body2">Loading…</Typography>
          </Box>
        )}
        {error && (
          <Box sx={{ p: 2 }}>
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          </Box>
        )}
        {!loading && !error && items.length === 0 && (
          <Box sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary">
              No notifications
            </Typography>
          </Box>
        )}

        <Box sx={{ p: 1.5, display: "grid", gap: 1 }}>
          {items.map((n) => (
            <NotificationItem key={n.id} n={n} onDelete={removeOne} />
          ))}
        </Box>
      </Popover>
    </>
  );
}
