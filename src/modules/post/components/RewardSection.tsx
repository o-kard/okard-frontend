"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import type { Reward } from "@/modules/post/types/post";

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
      (rewards ?? []).slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [rewards]
  );

  const sectionRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute("data-idx") || "0");
            setActiveIdx(idx);
          }
        });
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: [0, 0.2, 0.5, 1] }
    );

    sectionRefs.current.forEach((node, i) => {
      if (node) {
        node.setAttribute("data-idx", String(i));
        observer.observe(node);
      }
    });

    return () => observer.disconnect();
  }, [data.length]);

  const handleNavClick = (i: number) => {
    const node = sectionRefs.current[i];
    if (node) node.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (!data.length) return null;

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
              {data.map((c, i) => {
                const isActive = i === activeIdx;
                return (
                  <Button
                    key={c.id ?? `c-${i}`}
                    variant="text"
                    onClick={() => handleNavClick(i)}
                    sx={{
                      justifyContent: "flex-start",
                      textTransform: "none",
                      fontWeight: 800,
                      color: isActive ? "#e91e63" : "text.primary",
                      bgcolor: isActive
                        ? "rgba(233,30,99,0.08)"
                        : "transparent",
                      borderRadius: 2,
                      px: 1,
                      "&:hover": { bgcolor: "rgba(233,30,99,0.12)" },
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
        <Grid size={{ xs: 12, md: 9 }}>
          <Stack spacing={6}>
            {data.map((c, i) => {
              const img = c.image?.[0]?.path
                ? `${apiBaseUrl}${c.image[0].path}`
                : undefined;
              const anchorId = `${i + 1}-${slugify(c.reward_header)}`;

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
                    {c.reward_header || `Reward #${i + 1}`}
                  </Typography>

                  {c.reward_description && (
                    <Typography
                      sx={{
                        mb: 2,
                        color: "text.secondary",
                        whiteSpace: "pre-line",
                      }}
                    >
                      {c.reward_description}
                    </Typography>
                  )}

                  {img && (
                    <Box
                      component="img"
                      src={img}
                      alt={c.reward_header || `Reward #${i + 1}`}
                      sx={{
                        width: "600px",
                        height: "600px",
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
