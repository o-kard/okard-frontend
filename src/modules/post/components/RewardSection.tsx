"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import type { Reward } from "@/modules/post/types/post";
import { AttachMoney, Groups } from "@mui/icons-material";
import { useActiveSection } from "../hooks/useActiveSection";

const slugify = (s?: string) =>
  (s || "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 60);

type Props = {
  rewards?: Reward[] | null;
  apiBaseUrl?: string;
  scrollMarginTop?: number;
  title?: string;
};

export default function RewardSections({
  rewards,
  apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "",
  scrollMarginTop = 100,
  title = "Reward",
}: Props) {
  const data = useMemo(
    () =>
      (rewards ?? [])
        .slice()
        .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)),
    [rewards],
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
                    {c.reward_header || `Reward #${i + 1}`}
                  </Button>
                );
              })}
            </Stack>
          </Box>
        </Grid>

        {/* RIGHT: Sections */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Stack spacing={4}>
            {data.map((c, i) => {
              const img = c.media?.[0]?.path
                ? `${apiBaseUrl}${c.media[0].path}`
                : undefined;
              const anchorId = `${i + 1}-${slugify(c.reward_header)}`;
              const amount = (c as any).amount ?? (c as any).reward_amount ?? 0;
              const backupCount = (c as any).backup_amount ?? 0;

              return (
                <Box
                  key={c.id ?? `sec-${i}`}
                  id={anchorId}
                  ref={(el) => {
                    sectionRefs.current[i] = el as HTMLDivElement | null;
                  }}
                  sx={{ scrollMarginTop }}
                >
                  <Box
                    sx={{
                      border: "2px solid",
                      borderColor: "divider",
                      borderRadius: 4,
                      p: 2.5,
                      boxShadow: 1,
                      position: "relative",
                      bgcolor: "background.paper",
                    }}
                  >
                    <Grid container spacing={2} alignItems="stretch">
                      {/* left image */}
                      <Grid size={{ xs: 12, md: 6 }}>
                        {img ? (
                          <Box
                            component="img"
                            src={img}
                            alt={c.reward_header || `Reward #${i + 1}`}
                            sx={{
                              width: "100%",
                              height: 200,
                              objectFit: "cover",
                              borderRadius: 2,
                              display: "block",
                            }}
                          />
                        ) : (
                          <Box
                            sx={{
                              width: "100%",
                              height: 200,
                              borderRadius: 2,
                              bgcolor: "action.hover",
                            }}
                          />
                        )}
                        <Box>
                          <Typography
                            variant="body2"
                            sx={{ color: "text.secondary", pt: 2 }}
                          >
                            more than
                          </Typography>
                          <Typography variant="h6" fontWeight={900}>
                            {new Intl.NumberFormat("th-TH").format(amount)} USD
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid size={{ xs: 12, md: 6 }}>
                        <Typography
                          variant="h5"
                          fontWeight={900}
                          sx={{ mb: 1 }}
                        >
                          {c.reward_header || `Reward #${i + 1}`}
                        </Typography>

                        {c.reward_description && (
                          <Typography
                            sx={{
                              color: "text.secondary",
                              mb: 2,
                              whiteSpace: "pre-line",
                              pb: 3,
                            }}
                          >
                            {c.reward_description}
                          </Typography>
                        )}

                        {/* bottom-right backup count */}
                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="center"
                          sx={{
                            position: { xs: "static", sm: "absolute" },
                            right: { sm: 16 },
                            bottom: { sm: 14 },
                            mt: { xs: 2, sm: 0 },
                            px: 1.25,
                            py: 0.75,
                            borderRadius: 999,
                            bgcolor: "action.hover",
                            width: "fit-content",
                          }}
                        >
                          <Groups sx={{ fontSize: 18 }} />
                          <Typography variant="body2">
                            {backupCount} backup this level
                          </Typography>
                        </Stack>
                      </Grid>
                    </Grid>
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
