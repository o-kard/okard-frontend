"use client";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useUser, useAuth } from "@clerk/nextjs";
import {
  Box,
  Button,
  Grid,
  Container,
  IconButton,
  Typography,
  Drawer,
  Chip,
  TextField,
  InputAdornment,
  CircularProgress,
  Pagination,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import ExploreHeader from "./components/ExploreHeader";
import { useMediaQuery } from "@mui/material";
import CampaignList from "./components/CampaignList";
import { Campaign } from "./types/campaign";
import { fetchCampaigns, deleteCampaign, getForYouCampaigns } from "./api/api";
import SideFilters from "./components/SideFilters";

type Timing = "all" | "draft" | "published" | "archived";
type ViewMode = "popular" | "recommended";
import { CATEGORY_COLORS } from "@/modules/home/utils/categoryColors";

export default function CampaignComponent() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const LIMIT = 12;

  const searchParams = useSearchParams();
  const initialCategory = (searchParams.get("category") || "all").toLowerCase();
  const searchQuery = searchParams.get("query")?.toLowerCase() || "";

  const [category, setCategory] = useState<string>(initialCategory);
  const [timing, setTiming] = useState<Timing>("all");
  const [includeClosed, setIncludeClosed] = useState(false);

  const [sort, setSort] = useState<string>(
    searchParams.get("sort") || "popular",
  );

  // Keep this state for viewMode switching
  const [viewMode, setViewMode] = useState<ViewMode>("popular");

  const isMdUp = useMediaQuery("(min-width:900px)");

  const categories = [
    { value: "art", label: "Art" },
    { value: "comics", label: "Comics" },
    { value: "crafts", label: "Crafts" },
    { value: "dance", label: "Dance" },
    { value: "design", label: "Design" },
    { value: "fashion", label: "Fashion" },
    { value: "filmVideo", label: "Film & Video" },
    { value: "food", label: "Food" },
    { value: "games", label: "Games" },
    { value: "journalism", label: "Journalism" },
    { value: "music", label: "Music" },
    { value: "photography", label: "Photography" },
    { value: "publishing", label: "Publishing" },
    { value: "technology", label: "Technology" },
    { value: "theater", label: "Theater" },
  ];

  // Sync state with URL params when they change
  useEffect(() => {
    const incomingCategory = searchParams.get("category");
    if (incomingCategory) {
      const lowerCat = incomingCategory;
      if (lowerCat !== category) {
        setCategory(lowerCat);
      }
    } else if (category !== "all") {
      // If URL has no category, but we have one set (and it's not default),
      // decide if we should reset to 'all' or keep it.
      // Usually navigation to /campaign means 'all'.
      setCategory("all");
    }

    const incomingSort = searchParams.get("sort");
    if (incomingSort && incomingSort !== sort) {
      setSort(incomingSort);
    }
  }, [searchParams]);

  // Reset pagination when filters change
  useEffect(() => {
    setOffset(0);
    setHasMore(true);
  }, [category, searchQuery, sort, timing, includeClosed]);

  useEffect(() => {
    // If user is not passing query params, maybe we don't load?
    // Actually we always load.

    const load = async () => {
      try {
        if (viewMode === "recommended" && user?.id) {
          const token = await getToken();
          let campaigns = await getForYouCampaigns(token || "");

          // Client-side filtering for "For You"
          if (category !== "all") {
            campaigns = campaigns.filter(
              (p) => p.category?.toLowerCase() === category.toLowerCase(),
            );
          }

          if (searchQuery) {
            campaigns = campaigns.filter(
              (p) =>
                p.campaign_header?.toLowerCase().includes(searchQuery) ||
                p.campaign_description?.toLowerCase().includes(searchQuery),
            );
          }

          // Client-side sorting for "For You" if needed
          if (sort === "newest") {
            campaigns.sort(
              (a, b) =>
                new Date(b.created_at || 0).getTime() -
                new Date(a.created_at || 0).getTime(),
            );
          } else if (sort === "ending_soon") {
            campaigns = campaigns.filter(
              (p) => new Date(p.effective_end_date || 0) > new Date(),
            );
            campaigns.sort(
              (a, b) =>
                new Date(a.effective_end_date || 0).getTime() -
                new Date(b.effective_end_date || 0).getTime(),
            );
          } else if (sort === "popular") {
            campaigns.sort((a, b) => (b.supporter || 0) - (a.supporter || 0));
          } else if (sort === "updated") {
            campaigns.sort(
              (a, b) =>
                new Date(b.created_at || 0).getTime() -
                new Date(a.created_at || 0).getTime(),
            );
          }

          // Common filtering
          if (!includeClosed) {
            campaigns = campaigns.filter((p) => {
              const isExpired = p.effective_end_date
                ? new Date(p.effective_end_date.replace(" ", "T")) < new Date()
                : false;
              return (
                p.state === "published" || (p.state === "success" && !isExpired)
              );
            });
          }
          if (timing === "draft")
            campaigns = campaigns.filter((p) => p.state === "draft");
          else if (timing === "published") {
            campaigns = campaigns.filter((p) => {
              const isExpired = p.effective_end_date
                ? new Date(p.effective_end_date.replace(" ", "T")) < new Date()
                : false;
              return (
                p.state === "published" || (p.state === "success" && !isExpired)
              );
            });
          }

          setTotalCount(campaigns.length);
          const paginated = campaigns.slice(offset, offset + LIMIT);
          setCampaigns(paginated);
        } else {
          // Pass filters to backend
          const stateParam = timing === "all" ? "all" : timing;

          const data = await fetchCampaigns(
            category === "all" ? undefined : category,
            searchQuery || undefined,
            sort,
            stateParam,
            user?.id,
            LIMIT,
            offset,
            includeClosed,
          );

          setCampaigns(data.items);
          setTotalCount(data.total);
          setHasMore(data.items.length === LIMIT);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [viewMode, user, category, searchQuery, sort, timing, includeClosed, offset]);

  // Pagination states
  const totalPages = Math.ceil(totalCount / LIMIT);
  const page = Math.floor(offset / LIMIT) + 1;

  const router = useRouter();

  const handleClearSearch = () => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete("q"); // Clear query
    newParams.delete("query"); // Just in case
    router.push(`/campaign?${newParams.toString()}`);
  };

  const handleClearAll = () => {
    setCategory("all");
    setTiming("all");
    setIncludeClosed(false);
    setSort("newest");
    router.push("/campaign"); // Clear URL
  };

  // filtered is now just campaigns because we filtered during load
  const filtered = campaigns;

  const handleDelete = async (id: string) => {
    if (!user) return;
    const ok = await deleteCampaign(id, user.id);
    if (ok) {
       setOffset(0); // Reset to first page after delete
    }
  };

  return (
    <>
      <ExploreHeader />
      <Container maxWidth={false} sx={{ mt: 4, mb: 6 }}>
        <Grid container spacing={3} alignItems="start">
          <Grid size={{ xs: 12, md: 12 }}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              {!isMdUp && (
                <IconButton
                  onClick={() => setMobileOpen(true)}
                  sx={{ border: "1px solid #ddd", borderRadius: 2 }}
                >
                  <MenuIcon />
                  <Typography variant="button" sx={{ ml: 1, fontWeight: 600 }}>
                    Filters
                  </Typography>
                </IconButton>
              )}
            </Box>
          </Grid>

          {isMdUp && (
            <Grid py={2} size={{ xs: 12, md: 3 }}>
              <SideFilters
                categories={categories}
                selectedCategory={category}
                onSelectCategory={setCategory}
                timing={timing}
                onTimingChange={(v) => {
                  setTiming(v as any);
                }}
                includeClosed={includeClosed}
                onToggleClosed={setIncludeClosed}
                onViewModeChange={setViewMode}
                viewMode={viewMode}
                sort={sort}
                onSortChange={setSort}
                onClear={handleClearAll}
                searchQuery={searchQuery}
                onSearchChange={(v) => {
                  const newParams = new URLSearchParams(searchParams.toString());
                  if (v) newParams.set("query", v);
                  else newParams.delete("query");
                  router.push(`/campaign?${newParams.toString()}`);
                }}
              />
            </Grid>
          )}

          <Grid size={{ xs: 12, md: isMdUp ? 9 : 12 }} sx={{ pt: 2 }}>
            {/* Search and Found Count Header */}
            <Box
              display="flex"
              flexDirection={{ xs: "column", sm: "row" }}
              alignItems={{ xs: "stretch", sm: "center" }}
              justifyContent="space-between"
              gap={2}
              mb={3}
            >
              <Box display="flex" alignItems="center" gap={2}>
                <Typography variant="body2" color="text.secondary">
                  Found : {totalCount} Campaigns
                </Typography>
                {category !== "all" &&
                  (() => {
                    const categoryConfig =
                      CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS] ??
                      CATEGORY_COLORS.all;
                    const CategoryIcon = categoryConfig?.icon;
                    return (
                      <Chip
                        icon={CategoryIcon ? <CategoryIcon /> : undefined}
                        label={categoryConfig?.label ?? category}
                        onDelete={() => setCategory("all")}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          textTransform: "capitalize",
                          bgcolor: categoryConfig?.color ?? "primary.main",
                          color: "white",
                          "& .MuiChip-icon": {
                            color: "white",
                          },
                        }}
                      />
                    );
                  })()}
              </Box>

              {!isMdUp && (
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search campaigns..."
                  variant="outlined"
                  value={searchQuery}
                  onChange={(e) => {
                    const v = e.target.value;
                    const newParams = new URLSearchParams(searchParams.toString());
                    if (v) newParams.set("query", v);
                    else newParams.delete("query");
                    router.push(`/campaign?${newParams.toString()}`);
                  }}
                  sx={{
                    bgcolor: "rgba(255,255,255,0.5)",
                    borderRadius: 4,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 4,
                      fontSize: "0.9rem",
                      height: "36px",
                      paddingRight: "2px",
                    },
                    "& .MuiOutlinedInput-input": {
                      padding: "2px 2px",
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            </Box>

            <CampaignList
              campaigns={filtered}
              onEdit={() => {}}
              onDelete={handleDelete}
              loading={loading}
            />

            {totalPages > 1 && (
                <Box display="flex" justifyContent="center" mt={4}>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={(event, value) => {
                            setOffset((value - 1) * LIMIT);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        color="primary"
                        shape="circular"
                        size="large"
                        sx={{
                            "& .MuiPaginationItem-root": {
                                fontWeight: 600,
                                color: "#888",
                                "&.Mui-selected": {
                                    bgcolor: "rgba(0, 0, 0, 0.12)",
                                    color: "#333",
                                    backdropFilter: "blur(4px)",
                                    "&:hover": {
                                        bgcolor: "rgba(0, 0, 0, 0.20)",
                                    },
                                },
                            },
                        }}
                    />
                </Box>
            )}
          </Grid>
        </Grid>

        {!isMdUp && (
          <Drawer
            anchor="left"
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
          >
            <Box sx={{ width: 300 }}>
              <SideFilters
                categories={categories}
                selectedCategory={category}
                onSelectCategory={(v) => {
                  setCategory(v);
                  setMobileOpen(false);
                }}
                viewMode={viewMode}
                onViewModeChange={(v) => {
                  setViewMode(v);
                  setMobileOpen(false);
                }}
                sort={sort}
                onSortChange={(v) => {
                  setSort(v);
                  setMobileOpen(false);
                }}
                timing={timing}
                onTimingChange={(v) => {
                  setTiming(v);
                  setMobileOpen(false);
                }}
                includeClosed={includeClosed}
                onToggleClosed={setIncludeClosed}
                onClear={() => {
                  handleClearAll();
                  setMobileOpen(false);
                }}
                searchQuery={searchQuery}
                onSearchChange={(v) => {
                  const newParams = new URLSearchParams(searchParams.toString());
                  if (v) newParams.set("query", v);
                  else newParams.delete("query");
                  router.push(`/campaign?${newParams.toString()}`);
                }}
              />
            </Box>
          </Drawer>
        )}
      </Container>
    </>
  );
}
