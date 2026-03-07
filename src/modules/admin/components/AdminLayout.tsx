"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Box, CircularProgress, Typography } from "@mui/material";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoaded, userId } = useAuth();
  const { getToken } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkRole() {
      if (isLoaded) {
        if (!userId) {
          router.push("/");
          return;
        }
        try {
          const token = await getToken();
          if (token) {
            const { getUser } = await import("@/modules/user/api/api");
            const dbUser = await getUser(token);
            if (dbUser && dbUser.role === "admin") {
              setIsAdmin(true);
            } else {
              router.push("/");
            }
          } else {
            router.push("/");
          }
        } catch (err) {
          console.error("Admin verification failed", err);
          router.push("/");
        }
      }
    }
    checkRole();
  }, [isLoaded, userId, getToken, router]);

  if (isAdmin === null) {
    return (
      <Box
        sx={{
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#f8fafc",
      }}
    >
      <main
        style={{
          flex: 1,
          padding: "2.5rem 2.5rem 2.5rem 2rem",
          background: "#ffffff",
          color: "#222222",
          minHeight: "100vh",
          transition: "background 0.2s",
        }}
      >
        {children}
      </main>
    </div>
  );
}
