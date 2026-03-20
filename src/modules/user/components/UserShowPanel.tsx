import { useAuth, useUser } from "@clerk/nextjs";
import {
  Box as MuiBox,
  Divider,
  Paper,
  Typography,
  Stack,
  Box,
  Avatar,
  Button,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import Link from "next/link";
import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import { getUser } from "../api/api";
import CampaignIcon from "@mui/icons-material/Campaign";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import VerifiedIcon from "@mui/icons-material/Verified";
import {
  User as UserIcon,
  Phone,
  MapPin,
  Mail,
  Calendar,
  ShieldCheck,
  Link2,
  Instagram,
  Youtube,
  Twitter,
  Globe,
  ExternalLink,
} from "lucide-react";
import { SocialLink, VerificationStatus } from "@/modules/creator/types/creator";
import { User } from "@/modules/user/types/user";
import { SectionCard } from "@/components/ui/SectionCard";
import { InfoItem } from "@/components/ui/InfoItem";


// Helper for Social Icons (moved for clarity)
// Helper for social icons
const getSocialIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    case "instagram": return <Instagram size={20} color="#E1306C" />;
    case "youtube": return <Youtube size={20} color="#FF0000" />;
    case "twitter": return <Twitter size={20} color="#1DA1F2" />;
    case "tiktok": return <Globe size={20} color="#000000" />; // Lucide doesn't have TikTok yet
    case "website": return <Globe size={20} color="#24292e" />;
    default: return <Link2 size={20} color="#666" />;
  }
};

// Profile (read-only)
interface ProfilePanelProps {
  campaignCount?: number;
  contributionsCount?: number;
}
export default function ProfilePanel({ campaignCount, contributionsCount }: ProfilePanelProps) {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);

  useEffect(() => {
    if (!isLoaded || !user) return;

    let abort = false;
    (async () => {
      try {
        const token = await getToken();
        if (!token) throw new Error("No token available");
        const r = await getUser(token);
        if (r) {
          console.log("Fetched user profile:", r);
          if (!abort) setProfile(r);
        } else {
          if (!abort) setProfile(null);
        }
      } catch (err) {
        console.error("Failed to fetch user with token:", err);
        if (!abort) setProfile(null);
      }
    })();
    return () => {
      abort = true;
    };
  }, [isLoaded, user]);


  const isCreator = profile?.role === 'creator';
  const isAdmin = profile?.role === 'admin';
  const creatorData = profile?.creator;
  const pendingCreator = creatorData?.verification_status === VerificationStatus.pending;

  return (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
        <Typography variant="h5" fontWeight={700}>
          My Profile
        </Typography>
        {isCreator && (
          <Chip
            icon={<VerifiedIcon />}
            label="Creator"
            sx={{
              background: "linear-gradient(45deg, #12c998 30%, #f070a1 90%)",
              color: "white",
              fontWeight: 700,
              fontSize: "0.9rem",
              px: 1,
              "& .MuiChip-icon": {
                color: "white",
              },
            }}
          />
        )}
      </Box>

      <Grid container spacing={3}>
        {/* Personal Information Card */}
        <Grid size={{ xs: 12, md: 6 }}>
          <SectionCard title="Personal Information" icon={UserIcon}>
            <InfoItem
              icon={UserIcon}
              label="Full Name"
              value={[profile?.first_name, profile?.middle_name, profile?.surname]
                .filter(Boolean)
                .join(" ")}
            />
            <InfoItem
              icon={Calendar}
              label="Birth Date"
              value={
                profile?.birth_date
                  ? new Date(profile.birth_date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                  : "—"
              }
            />
            <InfoItem
              icon={Globe}
              label="Country"
              value={profile?.country?.en_name}
            />
            {isCreator && creatorData?.verified_at && (
              <InfoItem
                icon={ShieldCheck}
                label="Verified Since"
                value={new Date(creatorData.verified_at).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              />
            )}
          </SectionCard>
        </Grid>

        {/* Contact Information Card */}
        <Grid size={{ xs: 12, md: 6 }}>
          <SectionCard title="Contact Details" icon={Phone}>
            <InfoItem
              icon={Mail}
              label="Email Address"
              value={user?.primaryEmailAddress?.emailAddress}
            />
            <InfoItem
              icon={Phone}
              label="Phone Number"
              value={profile?.tel}
            />
            <InfoItem
              icon={MapPin}
              label="Address"
              value={profile?.address}
            />

            {/* Social Links inside Contact Card */}
            {isCreator && creatorData?.social_links && creatorData.social_links.length > 0 && (
              <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ pt: 1 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    bgcolor: "rgb(243, 246, 249)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#64748b",
                    flexShrink: 0,
                  }}
                >
                  <Link2 size={18} />
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" mb={0.5}>
                    Social Links
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                    {creatorData.social_links.map((link: SocialLink, index: number) => (
                      <Tooltip key={index} title={link.platform} arrow>
                        <IconButton
                          component="a"
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          size="small"
                          sx={{
                            bgcolor: "white",
                            border: "1px solid",
                            borderColor: "divider",
                            width: 32,
                            height: 32,
                            "&:hover": { bgcolor: "#f1f5f9", borderColor: "primary.main" },
                          }}
                        >
                          {getSocialIcon(link.platform)}
                        </IconButton>
                      </Tooltip>
                    ))}
                  </Stack>
                </Box>
              </Stack>
            )}
          </SectionCard>
        </Grid>

        {/* Bio Section */}
        {isCreator && creatorData?.bio && (<Grid size={{ xs: 12 }}>
          <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mt: 1 }}>
            About
          </Typography>
          <Paper
            variant="outlined"
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: "rgb(250, 250, 250)",
              minHeight: 100,
              borderStyle: "dashed",
            }}
          >
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ whiteSpace: "pre-line", lineHeight: 1.6 }}
            >
              {(isCreator ? creatorData?.bio : profile?.user_description) ||
                "No description provided."}
            </Typography>
          </Paper>
        </Grid>)}
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" fontWeight={700} gutterBottom>
        Project
      </Typography>
      <Grid container spacing={2} sx={{ margin: 1 }}>
        <Grid size={{ xs: 12, md: 6 }} >
          <Paper sx={{ p: 2, borderRadius: 3, bgcolor: "rgb(248, 248, 248)" }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
              <Box
                sx={{
                  width: 45,
                  height: 45,
                  borderRadius: "50%",
                  bgcolor: "rgb(18,201,152)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <VolunteerActivismIcon sx={{ color: "#fff" }} />
              </Box>
              <Typography variant="h4" fontWeight={700}>
                {contributionsCount}
              </Typography>
            </Stack>
            <Typography color="text.secondary">Contribution(s)</Typography>
          </Paper>
        </Grid>

        {isCreator && (
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 2, borderRadius: 3, bgcolor: "rgb(248, 248, 248)" }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                <Box
                  sx={{
                    width: 45,
                    height: 45,
                    borderRadius: "50%",
                    bgcolor: "rgb(240,112,161)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CampaignIcon sx={{ color: "#fff" }} />
                </Box>
                <Typography variant="h4" fontWeight={700}>
                  {campaignCount ?? creatorData?.campaign_number ?? 0}
                </Typography>
              </Stack>
              <Typography color="text.secondary">My Campaign(s)</Typography>
            </Paper>
          </Grid>
        )}
      </Grid>

      {!isCreator && !pendingCreator && !isAdmin && (
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
          <Link href="/creator/register" style={{ textDecoration: "none" }}>
            <Button
              variant="contained"
              sx={{
                background: "linear-gradient(45deg, #12c998 30%, #f070a1 90%)",
                color: "white",
                fontWeight: 700,
                textTransform: "none",
                fontSize: "1rem",
                px: 4,
                py: 1.2,
                borderRadius: 2,
                boxShadow: "0 4px 14px 0 rgba(0,118,255,0.39)",
                transition: "all 0.3s ease",
                "&:hover": {
                  background: "linear-gradient(45deg, #0fb488 30%, #d65d8b 90%)",
                  boxShadow: "0 6px 20px rgba(0,118,255,0.23)",
                  transform: "scale(1.1)",
                },
              }}
            >
              Become A Creator
            </Button>
          </Link>
        </Box>
      )}

      {pendingCreator && (
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
          <Button
            variant="contained"
            disabled
            sx={{
              fontWeight: 700,
              textTransform: "none",
              fontSize: "1rem",
              px: 4,
              py: 1.2,
              borderRadius: 2,
              "&.Mui-disabled": {
                background: "rgba(0, 0, 0, 0.08)",
                color: "rgba(0, 0, 0, 0.38)",
              }
            }}
          >
            Status: Pending Approval
          </Button>
        </Box>
      )}
    </Paper>
  );
}
