"use client";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {
  Box,
  Button,
  Grid,
  Container,
  IconButton,
  Typography,
  Drawer,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ExploreHeader from "./components/ExploreHeader";
import { useMediaQuery } from "@mui/material";
import PostList from "./components/PostList";
import { Post } from "./types/post";
import { fetchPosts, deletePost } from "./api/api";
import SideFilters from "./components/SideFilters";

type Timing = "all" | "draft" | "published" | "archived";

export default function PostComponent() {
  const { user } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);

  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  const searchQuery = searchParams.get("query")?.toLowerCase() || "";

  const [category, setCategory] = useState<string>(initialCategory);
  const [timing, setTiming] = useState<Timing>("all");
  const [includeClosed, setIncludeClosed] = useState(false);

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

  useEffect(() => {
    (async () => setPosts(await fetchPosts()))();
  }, []);

  const filtered = useMemo(() => {
    let data = [...posts];
    if (searchQuery) {
      data = data.filter((p) =>
        p.post_header?.toLowerCase().includes(searchQuery) ||
        p.post_description?.toLowerCase().includes(searchQuery)
      );
    }
    if (category !== "all")
      data = data.filter(
        (p) => p.category?.toLowerCase() === category.toLowerCase()
      );
    if (!includeClosed) data = data.filter((p) => p.status === "active");
    if (timing === "draft") {
      data = data.filter((p) => p.state === "draft");
    }
    if (timing === "published") {
      data = data.filter((p) => p.state === "published");
    }
    if (timing === "archived") {
      data = data.filter((p) => p.state === "archived");
    }
    return data;
  }, [posts, category, includeClosed, timing, searchQuery]);

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
                <IconButton onClick={() => setMobileOpen(true)}>
                  <MenuIcon />
                </IconButton>
              )}
            </Box>
          </Grid>

          {isMdUp && (
            <Grid size={{ xs: 12, md: 3 }}>
              <SideFilters
                categories={categories}
                selectedCategory={category}
                onSelectCategory={setCategory}
                timing={timing}
                onTimingChange={setTiming}
                includeClosed={includeClosed}
                onToggleClosed={setIncludeClosed}
                onClear={() => {
                  setCategory("all");
                  setTiming("all");
                  setIncludeClosed(false);
                }}
              />
            </Grid>
          )}

          <Grid size={{ xs: 12, md: isMdUp ? 9 : 12 }} sx={{ pt: 2 }}>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Found : {filtered.length} Campaigns
            </Typography>
            <PostList
              posts={filtered}
              onEdit={() => {}}
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
                timing={timing}
                onTimingChange={(v) => {
                  setTiming(v);
                  setMobileOpen(false);
                }}
                includeClosed={includeClosed}
                onToggleClosed={setIncludeClosed}
                onClear={() => {
                  setCategory("all");
                  setTiming("all");
                  setIncludeClosed(false);
                }}
              />
            </Box>
          </Drawer>
        )}
      </Container>
    </>
  );
}
