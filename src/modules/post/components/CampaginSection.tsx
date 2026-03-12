"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import type { Campaign } from "@/modules/post/types/post";
import { useActiveSection } from "../hooks/useActiveSection";
import { resolveMediaUrl } from "@/utils/mediaUrl";

const slugify = (s?: string) =>
  (s || "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 60);

type Props = {
  campaigns?: Campaign[] | null;
  apiBaseUrl?: string;
  scrollMarginTop?: number;
  title?: string;
};

export default function CampaignSections({
  campaigns,
  apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "",
  scrollMarginTop = 100,
  title = "Campaign",
}: Props) {
  const data = useMemo(
    () =>
      (campaigns ?? [])
        .slice()
        .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)),
    [campaigns],
  );

  const sectionRefs = useRef<Array<HTMLDivElement | null>>([]);
  const activeIdx = useActiveSection(sectionRefs, data.length);

  const handleNavClick = (i: number) => {
    const node = sectionRefs.current[i];
    if (node) node.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (!data.length) return null;

  return (
    <Box>
      <Typography variant="h4" fontWeight={900} sx={{ mb: 2 }}>
        {title}
      </Typography>

      <Grid container spacing={3} alignItems="flex-start">
        {/* LEFT: TOC */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Box sx={{ position: { md: "sticky" }, top: { md: 96 } }}>
            <Stack component="nav" spacing={1.2} sx={{ pr: { md: 2 } }}>
              {data.map((c, i) => {
                const isActive = i === activeIdx;
                return (
                  <Button
                    key={c.id ?? `c-${i}`}
                    variant="text"
                    onClick={() => handleNavClick(i)}
                    sx={{
                      justifyContent: "flex-start",
                      textAlign: "left",
                      textTransform: "none",
                      fontWeight: 800,
                      color: isActive ? "#18c59b" : "text.primary",
                      bgcolor: isActive
                        ? "rgba(24,197,155,0.08)"
                        : "transparent",
                      borderRadius: 2,
                      px: 1,
                      "&:hover": { bgcolor: "rgba(24,197,155,0.12)" },
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {c.campaign_header || `Campaign #${i + 1}`}
                  </Button>
                );
              })}
            </Stack>
          </Box>
        </Grid>

        {/* RIGHT: Sections */}
        <Grid size={{ xs: 12, md: 9 }}>
          <Stack spacing={6} sx={{ padding: 2 }}>
            {data.map((c, i) => {
              const img = c.media?.[0]?.path
                ? resolveMediaUrl(c.media[0].path)
                : undefined;
              const anchorId = `${i + 1}-${slugify(c.campaign_header)}`;

              return (
                <Box
                  key={c.id ?? `sec-${i}`}
                  id={anchorId}
                  component="div"
                  ref={(el) => {
                    sectionRefs.current[i] = el as HTMLDivElement | null;
                  }}
                  sx={{ scrollMarginTop }}
                >
                  <Typography variant="h5" fontWeight={900} sx={{ mb: 1.2 }}>
                    {c.campaign_header || `Campaign #${i + 1}`}
                  </Typography>

                  {c.campaign_description && (
                    <Typography
                      sx={{
                        mb: 2,
                        color: "text.secondary",
                        whiteSpace: "pre-line",
                      }}
                    >
                      {c.campaign_description}
                    </Typography>
                  )}

                  {img && (
                    <Box
                      component="img"
                      src={img}
                      alt={c.campaign_header || `Campaign #${i + 1}`}
                      sx={{
                        width: { xs: "100%", md: "60%" },
                        height: "auto",
                        aspectRatio: "4/3",
                        objectFit: "cover",
                        borderRadius: 2,
                        boxShadow: 1,
                        display: "block",
                      }}
                    />
                  )}
                </Box>
              );
            })}
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
