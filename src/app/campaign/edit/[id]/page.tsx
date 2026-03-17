"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Campaign } from "@/modules/campaign/types/campaign";
import CampaignForm from "@/modules/campaign/components/CampaignForm";
import { updateCampaignWithInformations } from "@/modules/campaign/api/api";
import { Container, Typography, Box } from "@mui/material";
import { getUser } from "@/modules/user/api/api";
import { User } from "@/modules/user/types/user";
import EditRequestModal from "@/modules/edit_request/components/EditRequestModal";
import LoadingScreen from "@/components/common/LoadingScreen";
import { predictCampaign } from "@/modules/predict/api/api";
import type { PredictInput } from "@/modules/predict/types/predictTypes";
import type { FormValues } from "@/modules/campaign/components/CampaignForm";
import { categoryOptions } from "@/modules/campaign/components/CampaignForm";
import { useCountryOptions } from "@/hooks/useCountryOptions";
import { useAuth } from "@clerk/nextjs";

export default function CampaignEditPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [currentUserProfile, setCurrentUserProfile] = useState<User | null>(
    null,
  );
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [editRequestOpen, setEditRequestOpen] = useState(false);
  const [proposedData, setProposedData] = useState<any>(null);
  const [accessDenied, setAccessDenied] = useState(false);
  const { countryOptions } = useCountryOptions();
  const { getToken } = useAuth();

  useEffect(() => {
    if (!id) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/campaign/${id}`)
      .then((res) => res.json())
      .then((data) => setCampaign(data));
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

    if (campaign && currentUserProfile) {
      if (campaign.user_id !== currentUserProfile.id) {
        setAccessDenied(true);
        router.push("/campaign");
      }
    }
  }, [isLoaded, user, campaign, currentUserProfile, router]);

  const handleEditRequest = (data: any) => {
    setProposedData(data);
    setEditRequestOpen(true);
  };

  const handleSubmit = async (fd: FormData) => {
    if (!user || typeof id !== "string") return;
    const ok = await updateCampaignWithInformations(id, fd, user.id);
    if (ok) router.push("/campaign");
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
        name: values.campaign_header,
        blurb: values.campaign_description,
        start_date: values.effective_start_from || "",
        end_date: values.effective_end_date || "",
        country_displayable_name: countryLabel,
        category_group,
        has_video: mediaState.hasVideo,
        has_photo: mediaState.hasImage,
      };

      const result = await predictCampaign(input, user.id);
      console.log("🔮 Prediction result received:", result);
      return result;
    } catch (err) {
      console.error("Predict error", err);
      return { message: "Predict failed" };
    }
  };

  if (!isLoaded || !user || !campaign || !currentUserProfile) {
    return <LoadingScreen message="Loading Campaign..." />;
  }

  if (accessDenied || campaign.user_id !== currentUserProfile.id) {
    return null;
  }

  return (
    <Container maxWidth="sm">
      <Box mt={6} mb={4}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Edit Campaign
        </Typography>
        <CampaignForm
          editItem={campaign}
          onSubmit={handleSubmit}
          onCancel={() => router.push("/campaign")}
          onPredict={handlePredict}
          onEditRequest={handleEditRequest}
        />
        {user && typeof id === "string" && (
          <EditRequestModal
            open={editRequestOpen}
            onClose={() => setEditRequestOpen(false)}
            campaignId={id}
            clerkId={user.id}
            proposedChanges={proposedData}
          />
        )}
      </Box>
    </Container>
  );
}
