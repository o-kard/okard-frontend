"use client";

import { useMemo, useRef } from "react";
import { Box, Button, Grid, Stack, Typography, Chip } from "@mui/material";
import { Progress } from "../types";
import { useActiveSection } from "@/modules/post/hooks/useActiveSection";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

type Props = {
  items?: Progress[];
  apiBaseUrl?: string;
  scrollMarginTop?: number;
  title?: string;
};

const formatDate = (dateStr?: string) => {
  if (!dateStr) return "-";
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(new Date(dateStr));
};

export default function ProgressSection({
  items,
  apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "",
  scrollMarginTop = 100,
  title = "Progress Updates",
}: Props) {
  const data = useMemo(
    () =>
      (items ?? [])
        .slice()
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        ), // Newest first
    [items],
  );

  const sectionRefs = useRef<Array<HTMLDivElement | null>>([]);
  const activeIdx = useActiveSection(sectionRefs, data.length);

  const handleNavClick = (i: number) => {
    const node = sectionRefs.current[i];
    if (node) node.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (!data?.length) {
    return (
      <Box
        sx={{
          mt: 6,
          textAlign: "center",
          py: 4,
          bgcolor: "grey.50",
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" color="text.secondary">
          No updates yet.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 6 }}>
      <Typography variant="h4" fontWeight={900} sx={{ mb: 2 }}>
        {title}
      </Typography>

      <Grid container spacing={3} alignItems="flex-start">
        {/* LEFT: TOC */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Box sx={{ position: { md: "sticky" }, top: { md: 96 } }}>
            <Stack component="nav" spacing={1.2} sx={{ pr: { md: 2 } }}>
              {data.map((item, i) => {
                const isActive = i === activeIdx;
                const label = formatDate(item.created_at);
                return (
                  <Button
                    key={item.id}
                    variant="text"
                    onClick={() => handleNavClick(i)}
                    sx={{
                      justifyContent: "flex-start",
                      textTransform: "none",
                      fontWeight: 800,
                      color: isActive ? "primary.main" : "text.primary",
                      bgcolor: isActive ? "primary.50" : "transparent",
                      borderRadius: 2,
                      px: 1,
                      "&:hover": { bgcolor: "primary.50" },
                    }}
                  >
                    {label}
                  </Button>
                );
              })}
            </Stack>
          </Box>
        </Grid>

        {/* RIGHT: Sections */}
        <Grid size={{ xs: 12, md: 9 }}>
          <Stack spacing={4}>
            {data.map((item, i) => {
              const img = item.images?.[0]?.path
                ? `${apiBaseUrl}${item.images[0].path}`
                : undefined;

              return (
                <Box
                  key={item.id}
                  ref={(el) => {
                    sectionRefs.current[i] = el as HTMLDivElement | null;
                  }}
                  sx={{ scrollMarginTop }}
                >
                  <Box
                    sx={{
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 4,
                      p: 3,
                      boxShadow: 1,
                      bgcolor: "background.paper",
                    }}
                  >
                    <Stack spacing={2}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <AccessTimeIcon fontSize="inherit" />
                          {formatDate(item.created_at)}
                        </Typography>
                      </Stack>

                      <Typography variant="h5" fontWeight={900}>
                        {item.progress_header}
                      </Typography>

                      {img && (
                        <Box
                          component="img"
                          src={img}
                          alt={item.progress_header}
                          sx={{
                            width: "100%",
                            maxHeight: 400,
                            objectFit: "contain", // Use contain for user clarity, or cover for aesthetics. Let's start with cover but maxheight.
                            borderRadius: 2,
                            bgcolor: "grey.100",
                          }}
                        />
                      )}

                      {item.progress_description && (
                        <Typography
                          sx={{
                            whiteSpace: "pre-line",
                            color: "text.secondary",
                          }}
                        >
                          {item.progress_description}
                        </Typography>
                      )}

                      {/* If multiple images, show gallery? For now, just show first one as per simple implementation. 
                            If we want to support multiple, we can check item.images.length > 1.
                        */}
                    </Stack>
                  </Box>
                </Box>
              );
            })}
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
