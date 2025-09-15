// src/modules/notification/NotificationComponent.tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Grid, CircularProgress } from "@mui/material";
import dynamic from "next/dynamic";
import { getUserById } from "../user/api/api";

const NotificationBell = dynamic(
  () => import("./components/NotificationBell"),
  { ssr: false }
);

export default function NotificationComponent({ userId }: { userId?: string }) {
  const { user } = useUser();
  const [dbUserId, setDbUserId] = useState<string>();
  const fetchedRef = useRef(false);

  const effectiveUserId = userId ?? dbUserId;

  useEffect(() => {
    if (userId || !user?.id || fetchedRef.current) return;
    fetchedRef.current = true;

    (async () => {
      try {
        const me = await getUserById(user.id);
        if (me?.id) setDbUserId(me.id);
      } catch (err) {
        console.error("Failed to fetch DB user", err);
      }
    })();
  }, [userId, user?.id]);

  if (!effectiveUserId) return <CircularProgress size={16} />;

  return (
    <Grid container alignItems="center">
      <Grid size={{ xs: 12, md: 12 }}>
        <NotificationBell userId={effectiveUserId} />
      </Grid>
    </Grid>
  );
}
