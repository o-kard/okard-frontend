"use client";
import { useEffect, useMemo, useState } from "react";
import { useUser } from "@clerk/nextjs";
import {
  Box,
  Button,
  Container,
  IconButton,
  Typography,
  Drawer,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Link from "next/link";
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

  const [category, setCategory] = useState<string>("all");
  const [timing, setTiming] = useState<Timing>("all");
  const [includeClosed, setIncludeClosed] = useState(false);

  const isMdUp = useMediaQuery("(min-width:900px)");

  const categories = [
    { value: "tech", label: "Technology" },
    { value: "education", label: "Education" },
    { value: "health", label: "Health & Wellness" },
    { value: "other", label: "Other" },
  ];

  useEffect(() => {
    (async () => setPosts(await fetchPosts()))();
  }, []);

  const filtered = useMemo(() => {
    let data = [...posts];
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
  }, [posts, category, includeClosed, timing]);

  const handleDelete = async (id: string) => {
    if (!user) return;
    const ok = await deletePost(id, user.id);
    if (ok) setPosts(await fetchPosts());
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
      >
        <Typography variant="h4" fontWeight={800}>
          Explore a Campaign
        </Typography>
        {!isMdUp && (
          <IconButton onClick={() => setMobileOpen(true)}>
            <MenuIcon />
          </IconButton>
        )}
        <Link href="/post/create">
          <Button variant="contained">Create New Post</Button>
        </Link>
      </Box>

      <Box
        display="grid"
        gridTemplateColumns={{ xs: "1fr", md: "280px 1fr" }}
        gap={3}
        alignItems="start"
      >
        {isMdUp && (
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
        )}

        <Box>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Found : {filtered.length} Campaigns
          </Typography>
          <PostList
            posts={filtered}
            onEdit={() => {}}
            onDelete={handleDelete}
          />
        </Box>
      </Box>

      {/* Sidebar (mobile Drawer) */}
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
  );
}
