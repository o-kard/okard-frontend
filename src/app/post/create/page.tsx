"use client";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { createPostWithImages } from "@/modules/post/api/api";
import PostForm from "@/modules/post/components/PostForm";
import { Post } from "@/modules/post/types/post";
import { Container, Typography, Box } from "@mui/material";
import { useRequireUserInDb } from "@/hooks/useRequireUserDb";

export default function PostCreatePage() {
  const { user } = useUser();
  const router = useRouter();
  const haveUserDb = useRequireUserInDb();

  if (haveUserDb !== "ok") return;

  const handleSubmit = async (
    data: Omit<Post, "id" | "user_id" | "images">,
    _editId?: string,
    files?: File[]
  ) => {
    if (!user) return;
    const ok = await createPostWithImages(data, user.id, files || []);
    if (ok) router.push("/post");
  };

  return (
    <Container maxWidth="sm">
      <Box mt={6} mb={4}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Create New Post
        </Typography>
        <PostForm
          editItem={null}
          onSubmit={handleSubmit}
          onCancel={() => router.push("/post")}
        />
      </Box>
    </Container>
  );
}
