"use client";
import Link from "next/link";
import { Box, Container, Typography } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

export default function ExploreHeader() {
  return (
    <Box
      sx={{
        mx: "calc(50% - 50vw)",
        width: "100vw",
        background:
          "linear-gradient(90deg, #0fd39c 0%, #94a8ad 55%, #ff5aa5 100%)",
        color: "#fff",
      }}
    >
      <Container maxWidth={false} sx={{ py: { xs: 3, md: 5 } }}>
        <Box
          component={Link}
          href="/"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 1,
            color: "inherit",
            textDecoration: "none",
            opacity: 0.95,
            "&:hover": { opacity: 1, textDecoration: "underline" },
          }}
        >
          <ArrowBackIosNewIcon sx={{ fontSize: 18 }} />
          <Typography sx={{ fontWeight: 500 }}>Back</Typography>
        </Box>

        <Typography
          variant="h3"
          align="center"
          sx={{
            mt: { xs: 1, md: -1 },
            letterSpacing: "0.2em",
            fontWeight: 800,
            textTransform: "uppercase",
            textShadow: "0 1px 2px rgba(0,0,0,.25)",
          }}
        >
          Explore a Campaign
        </Typography>
      </Container>
    </Box>
  );
}
