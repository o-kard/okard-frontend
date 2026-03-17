"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";
import { Box, CircularProgress } from "@mui/material";

export default function ProfileGatekeeper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn || !user) {
      setIsVerifying(false);
      return;
    }

    if (pathname?.startsWith("/user/setup")) {
      setIsVerifying(false);
      return;
    }

    let isMounted = true;

    async function checkProfile() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/user/exists/${user!.id}`,
        );
        if (!res.ok) {
          throw new Error("Failed to check user existence");
        }
        const data = await res.json();

        if (isMounted) {
          if (!data.exists) {
            router.replace(
              `/user/setup?returnTo=${encodeURIComponent(pathname || "/")}`,
            );
          } else {
            setIsVerifying(false);
          }
        }
      } catch (err) {
        console.error("Profile gatekeeper error:", err);
        if (isMounted) setIsVerifying(false);
      }
    }

    checkProfile();

    return () => {
      isMounted = false;
    };
  }, [isLoaded, isSignedIn, user, pathname, router]);

  if (isVerifying && isSignedIn) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100%",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return <>{children}</>;
}
