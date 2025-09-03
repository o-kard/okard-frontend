"use client";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { createPostWithCampaigns } from "@/modules/post/api/api";
import PostForm from "@/modules/post/components/PostForm";
import { Container, Typography, Box } from "@mui/material";
import { useRequireUserInDb } from "@/hooks/useRequireUserDb";

export default function PostCreatePage() {
  const { user } = useUser();
  const router = useRouter();
  const haveUserDb = useRequireUserInDb();

  if (haveUserDb !== "ok") return;

  const handleSubmit = async (fd: FormData) => {
    if (!user) return;
    const ok = await createPostWithCampaigns(fd, user.id);
    if (ok) router.push("/post");
  };

  return (
    <Container maxWidth="sm">
      <Box mt={6} mb={4}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Create New Post
        </Typography>
        <PostForm
          onSubmit={handleSubmit}
          onCancel={() => router.push("/post")}
        />
      </Box>
    </Container>
  );
}
