"use client";
import Link from "next/link";
import { Box, Button, Container, Typography } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useRouter } from "next/navigation";

export default function ExploreHeader() {
  const router = useRouter();
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
          <Button
              startIcon={<ArrowBackIosNewIcon />}
              onClick={() => router.back()}
              sx={{ mb: 3, color: "white", textTransform: "none", fontSize: "1rem" }}
          >
              Back
          </Button>

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
          Explore a Creators
        </Typography>
      </Container>
    </Box>
  );
}
