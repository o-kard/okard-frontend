"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Post } from "@/modules/post/types/post";
import PostForm from "@/modules/post/components/PostForm";
import { updatePostWithImages } from "@/modules/post/api/api";
import { Container, Typography, Box } from "@mui/material";

export default function PostEditPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useUser();
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/post/${id}`)
      .then((res) => res.json())
      .then((data) => setPost(data));
  }, [id]);

  const handleSubmit = async (
    data: Omit<Post, "id" | "user_id" | "images">,
    _editId?: string,
    files?: File[]
  ) => {
    if (!user || typeof id !== "string") return;
    const ok = await updatePostWithImages(id, data, user.id, files || []);
    if (ok) router.push("/post");
  };

  if (!post)
    return (
      <Container maxWidth="sm">
        <Box mt={6}>Loading...</Box>
      </Container>
    );

  return (
    <Container maxWidth="sm">
      <Box mt={6} mb={4}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Edit Post
        </Typography>
        <PostForm
          editItem={post}
          onSubmit={handleSubmit}
          onCancel={() => router.push("/post")}
        />
      </Box>
    </Container>
  );
}
