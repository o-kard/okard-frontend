"use client";

import { useEffect, useState } from "react";
import { Typography, CircularProgress, Box, Paper } from "@mui/material";
import { useAuth } from "@clerk/nextjs";
import PostList from "@/modules/post/components/PostList";
import { fetchBookmarks } from "@/modules/post/api/api";
import { Post } from "@/modules/post/types/post";

export default function UserBookmarksPanel() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    async function loadBookmarks() {
      try {
        const token = await getToken();
        if (token) {
          const data = await fetchBookmarks(token);
          setPosts(data || []);
        }
      } catch (err) {
        console.error("Failed to load bookmarks", err);
      } finally {
        setLoading(false);
      }
    }

    loadBookmarks();
  }, [isLoaded, isSignedIn, getToken]);

  if (!isSignedIn) {
    return <Typography>Please sign in to view your bookmarks.</Typography>;
  }

  if (loading) {
    return (
      <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper sx={{ p: { xs: 6, md: 4 }, borderRadius: 3, minHeight: "60vh" }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 4 }}>
        My Bookmarks
      </Typography>

      {posts.length === 0 ? (
        <Box
          sx={{
            py: 4,
            textAlign: "center",
            borderRadius: 4,
          }}
        >
          <Typography color="text.secondary">
            You haven't bookmarked any campaigns yet.
          </Typography>
        </Box>
      ) : (
        <PostList
          posts={posts}
          onEdit={() => {}}
          onDelete={() => {}}
          gridXs={12}
          gridSm={6}
          gridMd={3}
        />
      )}
    </Paper>
  );
}
