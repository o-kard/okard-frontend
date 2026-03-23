// app/payment/[campaignId]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { SignedIn, SignedOut, RedirectToSignIn, useUser, useAuth } from "@clerk/nextjs";
import PaymentComponent from "@/modules/payment/PaymentComponent";
import { useParams } from "next/navigation";
import { getUser } from "@/modules/user/api/api";
import { User } from "@/modules/user/types/user";
import { Box, CircularProgress } from "@mui/material";

export default function PaymentPage() {
  const { campaignId } = useParams<{ campaignId: string }>();
  const { user } = useUser();
  const { getToken } = useAuth();
  const [dbUser, setDbUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      try {
        const token = await getToken();
        if (token) {
          const userData = await getUser(token);
          setDbUser(userData);
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
      } finally {
        setLoading(true);
      }
    }
    fetchUser();
  }, [getToken]);

  if (!loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <SignedIn>
        <PaymentComponent
          campaignId={campaignId}
          userId={user?.id ?? ""}
          initialFullName={dbUser ? `${dbUser.first_name || ""} ${dbUser.surname || ""}`.trim() : (user?.fullName ?? "")}
          initialEmail={dbUser?.email ?? (user?.primaryEmailAddress?.emailAddress ?? "")}
        />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
