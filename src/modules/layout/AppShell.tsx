"use client";

import { usePathname } from "next/navigation";
import { Box } from "@mui/material";
import ClientNavbar from "@/modules/navbar/ClientNavbar";
import { useEffect, useState } from "react";
import Footer from "@/modules/footer/Footer"

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <Box sx={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>
      <ClientNavbar isHome={isHome} />
      {isHome ? (
        <Box
          sx={{
            minHeight: "100vh",
            position: "relative",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {children}
        </Box>
      ) : (
        <Box sx={{ pt: 8 }}>{children}</Box>
      )}
      <Footer/>
    </Box>
  );
}
