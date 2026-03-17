"use client";

import { useEffect, useState } from "react";
import { SignedIn, SignedOut, RedirectToSignIn, useAuth } from "@clerk/nextjs";
import { Box, CircularProgress, Typography, Button } from "@mui/material";
import Link from "next/link";
import DashboardComponent from "@/modules/dashboard/DashboardComponent";
import { getUser } from "@/modules/user/api/api";

function CreatorGuard({ children }: { children: React.ReactNode }) {
  const { getToken } = useAuth();
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRole() {
      try {
        const token = await getToken();
        if (token) {
          const user = await getUser(token);
          setRole(user.role);
        }
      } catch (err) {
        console.error("Failed to fetch user role:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchRole();
  }, [getToken]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (role !== "creator") {
    return (
      <Box sx={{ textAlign: "center", mt: 8 }}>
        <Typography variant="h5" color="error" gutterBottom>
          Access Denied
        </Typography>
        <Typography>
          Only users with the <strong>Creator</strong> role can access the dashboard.
        </Typography>
        <Button component={Link} href="/" variant="outlined" sx={{ mt: 3 }}>
          Back to Home
        </Button>
      </Box>
    );
  }

  return <>{children}</>;
}

export default function DashboardPage() {
  return (
    <>
      <SignedIn>
        <CreatorGuard>
          <DashboardComponent />
        </CreatorGuard>
      </SignedIn>

      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
