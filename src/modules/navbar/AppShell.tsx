"use client";

import { usePathname } from "next/navigation";
import { Box } from "@mui/material";
import ClientNavbar from "@/modules/navbar/ClientNavbar";
import { useEffect, useState } from "react";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const backgrounds = [
    "url('https://images.unsplash.com/photo-1485470733090-0aae1788d5af?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8d2FsbHBhcGVyJTIwNGt8ZW58MHx8MHx8fDA%3D')",
    "url('https://cdn.wallpapersafari.com/0/81/XhAIN0.jpg')",
  ];

  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % backgrounds.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>
      <ClientNavbar isHome={isHome} />
      {isHome ? (
        <Box
          sx={{
            minHeight: "100vh",
            backgroundImage: isHome ? backgrounds[bgIndex] : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
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
    </Box>
  );
}
