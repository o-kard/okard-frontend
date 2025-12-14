// PostCreatePage.tsx

"use client";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { createPostWithCampaigns } from "@/modules/post/api/api";
import PostForm from "@/modules/post/components/PostForm";
import { Container, Typography, Box } from "@mui/material";
import type { FormValues } from "@/modules/post/components/PostForm";
import type { PredictInput } from "@/modules/predict/types/predictTypes";
import { predictPost } from "@/modules/predict/api/api";
import { useCountryOptions } from "@/hooks/useCountryOptions";
import { getUserById } from "@/modules/user/api/api";

export default function PostCreatePage() {
  const { user: clerkUser } = useUser();
  const router = useRouter();
  const { countryOptions } = useCountryOptions();

  const [predictResult, setPredictResult] = useState<any | null>(null);

  const handleSubmit = async (fd: FormData) => {
    if (!clerkUser) return;
    try {
      const ok = await createPostWithCampaigns(fd, clerkUser.id);
      if (ok) {
        router.push("/post");
      }
    } catch (err) {
      console.error("❌ Error creating post:", err);
      alert("Error while creating post.");
    }
  };

  const handlePredict = async (values: FormValues) => {
    if (!clerkUser) return;

    try {
      const dbUser = await getUserById(clerkUser.id);
      const userCountryId = dbUser.country_id;
      const countryLabel =
        countryOptions.find((c) => c.value === userCountryId)?.label || "Unknown";

      const input: PredictInput = {
        goal: values.goal_amount,
        name: values.post_header,
        blurb: values.post_description,
        start_date: values.effective_start_from || "",
        end_date: values.effective_end_date || "",
        country_displayable_name: countryLabel,
        has_video: 0,
        has_photo: (values.post_images?.length ?? 0) > 0 ? 1 : 0,
      };
      
      const result = await predictPost(input, clerkUser.id); 
      
      console.log("🔮 Prediction result received:", result);
      
      setPredictResult(result);
      
      return result; 
    } catch (err) {
      console.error("Predict error", err);
      return { message: "Predict failed" };
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={6} mb={4}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Create New Post
        </Typography>
        <PostForm
          onPredict={handlePredict}
          onSubmit={handleSubmit}
          onCancel={() => router.push("/post")}
        />
      </Box>
    </Container>
  );
}