"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Typography,
  CircularProgress,
  Box,
  Paper,
  TextField,
  InputAdornment,
} from "@mui/material";
import { useAuth } from "@clerk/nextjs";
import { fetchBookmarks, toggleBookmark } from "@/modules/post/api/api";
import { Post } from "@/modules/post/types/post";
import BookmarkList from "@/modules/bookmark/components/BookmarkList";
import { SearchIcon } from "lucide-react";

export default function UserBookmarksPanel() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

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

  const handleUnbookmark = async (postId: string) => {
    try {
      const token = await getToken();
      if (!token) return;
      await toggleBookmark(postId, token);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    } catch (err) {
      console.error("Failed to toggle bookmark", err);
    }
  };

  const filteredPosts = useMemo(() => {
    if (!searchQuery) return posts;
    const lowerQuery = searchQuery.toLowerCase();
    return posts.filter(
      (p) =>
        p.post_header.toLowerCase().includes(lowerQuery) ||
        (p.post_description &&
          p.post_description.toLowerCase().includes(lowerQuery)),
    );
  }, [posts, searchQuery]);

  if (!isSignedIn) {
    return <Typography>Please sign in to view your bookmarks.</Typography>;
  }

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
        bgcolor: "#fff",
        height: "60vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        mb={2}
        gap={2}
        flexShrink={0}
      >
        <Typography
          variant="h5"
          fontWeight={700}
          sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
        >
          My Bookmarks
        </Typography>
        <TextField
          placeholder="Search bookmarks..."
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: { xs: "100%", sm: 300 } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="#666" size={20} />
              </InputAdornment>
            ),
            sx: { borderRadius: 3 },
          }}
        />
      </Box>

      <Box sx={{ flex: 1, overflowY: "auto", pr: 1 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : filteredPosts.length > 0 ? (
          <BookmarkList posts={filteredPosts} onUnbookmark={handleUnbookmark} />
        ) : (
          <Paper
            sx={{
              p: 4,
              textAlign: "center",
              borderRadius: 3,
              bgcolor: "#f8f9fa",
              border: "1px dashed #e0e0e0",
            }}
            elevation={0}
          >
            <Typography color="text.secondary">
              {searchQuery
                ? "No bookmarks match your search."
                : "You haven't bookmarked any campaigns yet."}
            </Typography>
          </Paper>
        )}
      </Box>
    </Paper>
  );
}
