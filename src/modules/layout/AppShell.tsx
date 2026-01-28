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
    <Box sx={{
      position: "relative",
      minHeight: "100vh",
      overflow: "hidden", 
      display: "flex",       
      flexDirection: "column" 
    }}>
      <ClientNavbar isHome={isHome} />
      {isHome ? (
        <Box
          sx={{
            flex: 1, 
            position: "relative",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {children}
        </Box>
      ) : (
        <Box sx={{ pt: 8, flex: 1 }}>{children}</Box> 
      )}
      <Footer />
    </Box>
  );
}
