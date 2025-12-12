"use client";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
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


  // const handleSubmit = async (fd: FormData) => {
  //   if (!clerkUser) return;
  //   const ok = await createPostWithCampaigns(fd, clerkUser.id);
  //   if (ok) router.push("/post");
  // };
  const handleSubmit = async (fd: FormData) => {
    if (!clerkUser) return;

    try {
      console.log("🧾 FormData before predict:", [...fd.entries()]);

      // ✅ ดึงข้อมูล post_data ออกมา
      const postDataRaw = fd.get("post_data") as string;
      const postData = postDataRaw ? JSON.parse(postDataRaw) : {};

      // ✅ สร้าง formValues สำหรับ predict
      const formValues = {
        goal_amount: postData.goal_amount ?? 0,
        post_header: postData.post_header ?? "",
        post_description: postData.post_description ?? "",
        effective_start_from: postData.effective_start_from ?? "",
        effective_end_date: postData.effective_end_date ?? "",
        post_images: [],
        current_amount: 0,
        supporter: 0,
        state: "draft" as const,
        status: "active" as const,
        category: "tech" as const,
        campaigns: [],
        rewards: [],
      };

      // ✅ predict ก่อน
      const predictResult = await handlePredict(formValues);
      console.log("🔮 Predict result:", predictResult);

      // ✅ แนบผล predict เข้าไปใน FormData
      fd.append("predict_result", JSON.stringify(predictResult));

      // ✅ สร้าง post พร้อมผล predict
      const ok = await createPostWithCampaigns(fd, clerkUser.id);
      console.log("✅ Post created:", ok);
      router.push("/post");
    } catch (err) {
      console.error("❌ Error:", err);
      alert("Error while creating or predicting.");
    }
  };






  const handlePredict = async (values: FormValues) => {
    
    if (!clerkUser) return;

    try {
      console.log("in")
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
      console.log("Prediction result:", result);
      return result; //คืนค่ากลับ
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
