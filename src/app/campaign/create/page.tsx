// CampaignCreatePage.tsx

"use client";
import { useRouter } from "next/navigation";
import {
  useAuth,
  useUser,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from "@clerk/nextjs";
import { useState } from "react";
import { createCampaignWithInformations } from "@/modules/campaign/api/api";
import CampaignForm, { categoryOptions } from "@/modules/campaign/components/CampaignForm";
import { Container, Typography, Box } from "@mui/material";
import type { FormValues } from "@/modules/campaign/components/CampaignForm";
import type { PredictInput } from "@/modules/predict/types/predictTypes";
import { predictCampaign } from "@/modules/predict/api/api";
import { useCountryOptions } from "@/hooks/useCountryOptions";
import { getUser } from "@/modules/user/api/api";

export default function CampaignCreatePage() {
  const { getToken } = useAuth();
  const { user: clerkUser } = useUser();
  const router = useRouter();
  const { countryOptions } = useCountryOptions();

  const [predictResult, setPredictResult] = useState<any | null>(null);

  const handleSubmit = async (fd: FormData) => {
    if (!clerkUser) return;
    try {
      const ok = await createCampaignWithInformations(fd, clerkUser.id);
      if (ok) {
        router.push("/campaign");
      }
    } catch (err) {
      console.error("❌ Error creating campaign:", err);
      alert("Error while creating campaign.");
    }
  };

  const handlePredict = async (
    values: FormValues,
    mediaState: { hasVideo: boolean; hasImage: boolean },
  ) => {
    if (!clerkUser) return;

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
        name: values.campaign_header,
        blurb: values.campaign_description,
        start_date: values.effective_start_from || "",
        end_date: values.effective_end_date || "",
        country_displayable_name: countryLabel,
        category_group,
        has_video: mediaState.hasVideo,
        has_photo: mediaState.hasImage,
      };

      const result = await predictCampaign(input, clerkUser.id);

      console.log("🔮 Prediction result received:", result);

      setPredictResult(result);

      return result;
    } catch (err) {
      console.error("Predict error", err);
      return { message: "Predict failed" };
    }
  };

  return (
    <>
      <SignedIn>
        <Container maxWidth="sm">
          <Box mt={6} mb={4}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Create New Campaign
            </Typography>
            <CampaignForm
              onPredict={handlePredict}
              onSubmit={handleSubmit}
              onCancel={() => router.push("/campaign")}
            />
          </Box>
        </Container>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
