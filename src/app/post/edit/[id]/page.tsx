"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Post } from "@/modules/post/types/post";
import PostForm from "@/modules/post/components/PostForm";
import { updatePostWithCampaigns } from "@/modules/post/api/api";
import { Container, Typography, Box } from "@mui/material";
import { getUserById } from "@/modules/user/api/api";
import { User } from "@/modules/user/types/user";
import EditRequestModal from "@/modules/edit_request/components/EditRequestModal";
import LoadingScreen from "@/components/common/LoadingScreen";

export default function PostEditPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [currentUserProfile, setCurrentUserProfile] = useState<User | null>(
    null,
  );
  const [post, setPost] = useState<Post | null>(null);
  const [editRequestOpen, setEditRequestOpen] = useState(false);
  const [proposedData, setProposedData] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/post/${id}`)
      .then((res) => res.json())
      .then((data) => setPost(data));
  }, [id]);

  useEffect(() => {
    if (user) {
      getUserById(user.id).then((u) => setCurrentUserProfile(u));
    }
  }, [user]);

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/sign-in");
      return;
    }

    if (post && currentUserProfile) {
      if (post.user_id !== currentUserProfile.id) {
        alert("You are not authorized to edit this post.");
        router.push("/post");
      }
    }
  }, [isLoaded, user, post, currentUserProfile, router]);

  const handleEditRequest = (data: any) => {
    setProposedData(data);
    setEditRequestOpen(true);
  };

  const handleSubmit = async (fd: FormData) => {
    if (!user || typeof id !== "string") return;
    const ok = await updatePostWithCampaigns(id, fd, user.id);
    if (ok) router.push("/post");
  };
  if (!post) return <LoadingScreen message="Loading Post..." />;

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
          onEditRequest={handleEditRequest}
        />
        {user && typeof id === "string" && (
          <EditRequestModal
            open={editRequestOpen}
            onClose={() => setEditRequestOpen(false)}
            postId={id}
            clerkId={user.id}
            proposedChanges={proposedData}
          />
        )}
      </Box>
    </Container>
  );
}
