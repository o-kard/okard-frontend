// src/modules/notification/NotificationComponent.tsx
"use client";

import { Grid, CircularProgress } from "@mui/material";
import { useUser } from "@clerk/nextjs";
import dynamic from "next/dynamic";

interface NotificationComponentProps {
  isHome?: boolean;
  isHovered?: boolean;
}

const NotificationBell = dynamic(
  () => import("./components/NotificationBell"),
  {
    ssr: false,
  }
);

export default function NotificationComponent({
  isHome = false, 
  isHovered = false
}: NotificationComponentProps) {
  const { user, isLoaded, isSignedIn } = useUser();
  const clerkId = user?.id ?? "";

  if (!isLoaded) return <CircularProgress size={16} />;

  if (!isSignedIn || !clerkId) return null; 

  return (
    <Grid container alignItems="center">
      <Grid size={{ xs: 12, md: 12 }}>
        <NotificationBell clerkId={clerkId} isHome={isHome} isHovered={isHovered} />
      </Grid>
    </Grid>
  );
}
