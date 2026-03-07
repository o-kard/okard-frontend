"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Post } from "@/modules/post/types/post";
import PostForm from "@/modules/post/components/PostForm";
import { updatePostWithCampaigns } from "@/modules/post/api/api";
import { Container, Typography, Box, Button } from "@mui/material";
import { getUserById, getUser } from "@/modules/user/api/api";
import { User } from "@/modules/user/types/user";
import EditRequestModal from "@/modules/edit_request/components/EditRequestModal";
import LoadingScreen from "@/components/common/LoadingScreen";
import { predictPost } from "@/modules/predict/api/api";
import type { PredictInput } from "@/modules/predict/types/predictTypes";
import type { FormValues } from "@/modules/post/components/PostForm";
import { categoryOptions } from "@/modules/post/components/PostForm";
import { useCountryOptions } from "@/hooks/useCountryOptions";
import { useAuth } from "@clerk/nextjs";

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
  const [accessDenied, setAccessDenied] = useState(false);
  const { countryOptions } = useCountryOptions();
  const { getToken } = useAuth();

  useEffect(() => {
    if (!id) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/post/${id}`)
      .then((res) => res.json())
      .then((data) => setPost(data));
  }, [id]);

  useEffect(() => {
    const fetchUser = async () => {
      if (user) {
        try {
          const token = await getToken();
          if (token) {
            const u = await getUser(token);
            setCurrentUserProfile(u);
          }
        } catch (e) {
          console.error("Failed to fetch user profile:", e);
        }
      }
    };
    fetchUser();
  }, [user, getToken]);

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/sign-in");
      return;
    }

    if (post && currentUserProfile) {
      if (post.user_id !== currentUserProfile.id) {
        setAccessDenied(true);
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

  const handlePredict = async (
    values: FormValues,
    mediaState: { hasVideo: boolean; hasImage: boolean },
  ) => {
    if (!user) return;

    try {
      const token = await getToken();
      if (!token) return { message: "Predict failed: no token" };
      const dbUser = await getUser(token);
      const userCountryId = dbUser.country_id;
      const countryLabel =
        countryOptions.find((c) => c.value === userCountryId)?.label ||
        "Unknown";

      const category_group =
        categoryOptions.find((opt) => opt.value === values.category)?.label ||
        "Technology";

      const input: PredictInput = {
        goal: values.goal_amount,
        name: values.post_header,
        blurb: values.post_description,
        start_date: values.effective_start_from || "",
        end_date: values.effective_end_date || "",
        country_displayable_name: countryLabel,
        category_group,
        has_video: mediaState.hasVideo,
        has_photo: mediaState.hasImage,
      };

      const result = await predictPost(input, user.id);
      console.log("🔮 Prediction result received:", result);
      return result;
    } catch (err) {
      console.error("Predict error", err);
      return { message: "Predict failed" };
    }
  };

  if (!isLoaded || !user || !post || !currentUserProfile) {
    return <LoadingScreen message="Loading Post..." />;
  }

  if (accessDenied || post.user_id !== currentUserProfile.id) {
    return null;
  }

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
          onPredict={handlePredict}
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
