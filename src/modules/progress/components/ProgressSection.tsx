"use client";

import { useMemo, useRef } from "react";
import {
  Box,
  Button,
  Grid,
  Stack,
  Typography,
  Chip,
  IconButton,
} from "@mui/material";
import { Progress } from "../types";
import { useActiveSection } from "@/modules/post/hooks/useActiveSection";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EditIcon from "@mui/icons-material/Edit";

type Props = {
  items?: Progress[];
  apiBaseUrl?: string;
  scrollMarginTop?: number;
  title?: string;
  isOwner?: boolean;
  onEdit?: (item: Progress) => void;
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
  isOwner,
  onEdit,
}: Props) {
  const data = useMemo(
    () =>
      (items ?? [])
        .slice()
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        ),
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
          textAlign: "center",
          py: 4,
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
    <Box sx={{ mt: 2 }}>
      <Grid container spacing={3} alignItems="flex-start">
        {/* LEFT: TOC */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Box sx={{ position: { md: "sticky" }, top: { md: 96 } }}>
            <Stack component="nav" spacing={1.2} sx={{ pr: { md: 2 } }}>
              {data.map((item, i) => {
                const isActive = i === activeIdx;
                return (
                  <Button
                    key={item.id}
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
                    {item.progress_header || `Progress #${i + 1}`}
                  </Button>
                );
              })}
            </Stack>
          </Box>
        </Grid>

        {/* RIGHT: Sections */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Stack spacing={4}>
            {data.map((item, i) => {
              const img = item.media?.[0]?.path
                ? `${apiBaseUrl}${item.media[0].path}`
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
                      <Grid
                        size={{ xs: 12, md: 12 }}
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
                            justifyContent: "space-between",
                            gap: 0.5,
                          }}
                        >
                          <Box>
                            <AccessTimeIcon fontSize="inherit" />
                            {formatDate(item.created_at)}
                            {item.updated_at && (
                              <span style={{ marginLeft: 12 }}>
                                (Updated {formatDate(item.updated_at)})
                              </span>
                            )}
                          </Box>
                          {isOwner && onEdit && (
                            <IconButton
                              size="small"
                              onClick={() => onEdit(item)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          )}
                        </Typography>
                      </Grid>

                      <Grid size={{ xs: 12, md: 6 }}>
                        {img && (
                          <Box
                            component="img"
                            src={img}
                            alt={item.progress_header}
                            sx={{
                              width: "100%",
                              maxHeight: 200,
                              objectFit: "cover",
                              borderRadius: 2,
                              display: "block",
                            }}
                          />
                        )}
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Stack spacing={1}>
                          <Typography variant="h5" fontWeight={900}>
                            {item.progress_header}
                          </Typography>

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
