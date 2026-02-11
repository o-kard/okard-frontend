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
  Chip
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ExploreHeader from "./components/ExploreHeader";
import { useMediaQuery } from "@mui/material";
import PostList from "./components/PostList";
import { Post, } from "./types/post";
import { fetchPosts, deletePost, getForYouCampaigns } from "./api/api";
import SideFilters from "./components/SideFilters";

type Timing = "all" | "draft" | "published" | "archived";
type ViewMode = "popular" | "recommended"

export default function PostComponent() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);

  const searchParams = useSearchParams();
  const initialCategory = (searchParams.get("category") || "all").toLowerCase();
  const searchQuery = searchParams.get("query")?.toLowerCase() || "";

  const [category, setCategory] = useState<string>(initialCategory);
  const [timing, setTiming] = useState<Timing>("all");
  const [includeClosed, setIncludeClosed] = useState(false);

  const [sort, setSort] = useState<string>(searchParams.get("sort") || "popular");

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
    { value: "theater", label: "Theater" }
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
      // Usually navigation to /post means 'all'.
      setCategory("all");
    }

    const incomingSort = searchParams.get("sort");
    if (incomingSort && incomingSort !== sort) {
      setSort(incomingSort);
    }
  }, [searchParams]);



  useEffect(() => {
    // If user is not passing query params, maybe we don't load? 
    // Actually we always load.

    const load = async () => {
      try {
        if (viewMode === "recommended" && user?.id) {
          const token = await getToken();
          let posts = await getForYouCampaigns(token || "");

          // Client-side filtering for "For You"
          if (category !== "all") {
            posts = posts.filter(p => p.category?.toLowerCase() === category.toLowerCase());
          }

          if (searchQuery) {
            posts = posts.filter(p =>
              p.post_header?.toLowerCase().includes(searchQuery) ||
              p.post_description?.toLowerCase().includes(searchQuery)
            );
          }

          // Client-side sorting for "For You" if needed
          if (sort === "newest") {
            posts.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
          } else if (sort === "ending_soon") {
            posts = posts.filter(p => new Date(p.effective_end_date || 0) > new Date());
            posts.sort((a, b) => new Date(a.effective_end_date || 0).getTime() - new Date(b.effective_end_date || 0).getTime());
          } else if (sort === "popular") {
            posts.sort((a, b) => (b.supporter || 0) - (a.supporter || 0));
          } else if (sort === "updated") {
            posts.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
          }

          // Common filtering
          if (!includeClosed) posts = posts.filter((p) => p.status === "active");
          if (timing === "draft") posts = posts.filter((p) => p.state === "draft");
          else if (timing === "published") posts = posts.filter((p) => p.state === "published");
          else if (timing === "archived") posts = posts.filter((p) => p.state === "archived");

          setPosts(posts);
        } else {
          // Pass filters to backend
          // Map timing to state
          const stateParam = timing === "all" ? "all" : timing;
          // Map includeClosed to status (includeClosed=true -> all, false -> active)
          const statusParam = includeClosed ? "all" : "active";

          const data = await fetchPosts(
            category === "all" ? undefined : category,
            searchQuery || undefined,
            sort,
            stateParam,
            statusParam
          );

          // Backend now handles filtering, so we just set the data
          setPosts(data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, [viewMode, user, category, searchQuery, sort, timing, includeClosed]);

  const router = useRouter();

  const handleClearSearch = () => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete("q"); // Clear query
    newParams.delete("query"); // Just in case
    router.push(`/post?${newParams.toString()}`);
  }

  const handleClearAll = () => {
    setCategory("all");
    setTiming("all");
    setIncludeClosed(false);
    setSort("newest");
    router.push("/post"); // Clear URL
  }

  // filtered is now just posts because we filtered during load
  const filtered = posts;

  const handleDelete = async (id: string) => {
    if (!user) return;
    const ok = await deletePost(id, user.id);
    if (ok) setPosts(await fetchPosts());
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
                <IconButton onClick={() => setMobileOpen(true)} sx={{ border: '1px solid #ddd', borderRadius: 2 }}>
                  <MenuIcon />
                  <Typography variant="button" sx={{ ml: 1, fontWeight: 600 }}>Filters</Typography>
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
                onTimingChange={setTiming}
                includeClosed={includeClosed}
                onToggleClosed={setIncludeClosed}
                onViewModeChange={setViewMode}
                viewMode={viewMode}
                sort={sort}
                onSortChange={setSort}
                onClear={handleClearAll}
              />
            </Grid>
          )}

          <Grid size={{ xs: 12, md: isMdUp ? 9 : 12 }} sx={{ pt: 2 }}>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Typography variant="body2" color="text.secondary">
                Found : {filtered.length} Campaigns
              </Typography>
              {searchQuery && (
                <Chip
                  label={`Search: ${searchQuery}`}
                  onDelete={handleClearSearch}
                  color="primary"
                  variant="outlined"
                  size="small"
                />
              )}
            </Box>
            <PostList
              posts={filtered}
              onEdit={() => { }}
              onDelete={handleDelete}
            />
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
              />
            </Box>
          </Drawer>
        )}
      </Container>
    </>
  );
}
