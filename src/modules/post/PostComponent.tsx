"use client";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Post } from "./types/post";
import {
  fetchPosts,
  deletePost,
  createPostWithImages,
  updatePostWithImages,
} from "./api/api";
import PostList from "./components/PostList";
import Link from "next/link";
import { Box, Button, Container, Typography } from "@mui/material";

type Mode = "show" | "create" | "edit";

export default function PostComponent() {
  const { user } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [editItem, setEditItem] = useState<Post | null>(null);
  const [mode, setMode] = useState<Mode>("show");

  const load = async () => {
    const data = await fetchPosts();
    setPosts(data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (
    data: Omit<Post, "id" | "user_id" | "images">,
    editId?: string,
    files?: File[]
  ) => {
    if (!user) return;

    const clerkId = user.id;

    const payload = {
      ...data,
      category: "tech",
      status: "active",
      state: "draft",
      effective_start_from: new Date().toISOString(),
      effective_end_date: new Date().toISOString(),
      create_at: new Date().toISOString(),
      post_description: data.post_description ?? "",
    } as const;

    const ok = editId
      ? await updatePostWithImages(editId, payload, clerkId, files || [])
      : await createPostWithImages(payload, clerkId, files || []);

    if (ok) {
      setEditItem(null);
      setMode("show");
      load();
    }
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
    const ok = await deletePost(id, user.id);
    if (ok) load();
  };

  const handleEdit = (post: Post) => {
    setEditItem(post);
    setMode("edit");
  };

  return (
    <Container maxWidth="md">
      <Box mt={4} mb={4}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Post Management
        </Typography>

        <Box mb={2}>
          <Link href="/post/create">
            <Button variant="contained" color="primary">
              Create New Post
            </Button>
          </Link>
        </Box>

        <PostList posts={posts} onEdit={handleEdit} onDelete={handleDelete} />
      </Box>
    </Container>
  );
}
