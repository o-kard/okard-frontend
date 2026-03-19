"use client";

import {
  Box,
  Paper,
  Typography,
  Avatar,
  CircularProgress,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  TextField,
  InputAdornment,
  Stack,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import { getUserById } from "../api/api";
import CampaignIcon from "@mui/icons-material/Campaign";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import PersonIcon from "@mui/icons-material/Person";
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
import { Campaign } from "@/modules/campaign/types/campaign";
import { fetchCampaigns } from "@/modules/campaign/api/api";
import CampaignList from "./CampaignList";
import { ContributorWithCampaign } from "../../contributor/types";
import { getContributeByUserId } from "../../contributor/api/api";
import ContributorList from "../../contributor/components/ContributorList";
import VerifiedIcon from "@mui/icons-material/Verified";
import { fetchCampaignsByUserId } from "@/modules/campaign/api/api";
import {
  User as UserIcon,
  Phone,
  MapPin,
  Mail,
  Calendar,
  Globe,
  Link2,
  Instagram,
  Youtube,
  Twitter,
} from "lucide-react";
import { SectionCard } from "@/components/ui/SectionCard";
import { InfoItem } from "@/components/ui/InfoItem";
import { SocialLink } from "@/modules/creator/types/creator";
import CreatorBadge from "./CreatorBadge";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";

// Helper for social icons
const getSocialIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    case "instagram":
      return <Instagram size={20} color="#E1306C" />;
    case "youtube":
      return <Youtube size={20} color="#FF0000" />;
    case "twitter":
      return <Twitter size={20} color="#1DA1F2" />;
    case "tiktok":
      return <Globe size={20} color="#000000" />;
    case "website":
      return <Globe size={20} color="#24292e" />;
    default:
      return <Link2 size={20} color="#666" />;
  }
};

interface PublicProfilePanelProps {
  userId: string;
}

type Tab = "profile" | "campaigns" | "contributions";

export default function PublicProfilePanel({
  userId,
}: PublicProfilePanelProps) {
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("profile");
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [campaignsLoading, setCampaignsLoading] = useState(false);
  const [contributions, setContributions] = useState<ContributorWithCampaign[]>([]);
  const [contributionsLoading, setContributionsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCampaigns = campaigns.filter(
    (campaign) =>
      campaign.campaign_header.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.campaign_description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredContributions = contributions.filter(
    (c) =>
      c.campaign.campaign_header.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.campaign.campaign_description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  useEffect(() => {
    let abort = false;
    (async () => {
      try {
        // userId passed here is expected to be clerk_id
        const r = await getUserById(userId);
        if (r) {
          // console.log("Fetched public user profile:", r);
          if (!abort) setProfile(r);
        }
      } catch (e) {
        console.error("Failed to fetch user profile", e);
      } finally {
        if (!abort) setLoading(false);
      }
    })();
    return () => {
      abort = true;
    };
  }, [userId]);

  useEffect(() => {
    if (profile?.id) {
      setCampaignsLoading(true);
      fetchCampaignsByUserId(profile.id)
        .then((res: Campaign[]) => {
          setCampaigns(res);
        })
        .catch((err: any) => console.error(err))
        .finally(() => setCampaignsLoading(false));

      setContributionsLoading(true);
      getContributeByUserId(profile.id)
        .then((res: ContributorWithCampaign[]) => {
          setContributions(res);
        })
        .catch((err: any) => console.error(err))
        .finally(() => setContributionsLoading(false));
    }
  }, [profile]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (!profile) {
    return (
      <Typography textAlign="center" p={5}>
        User not found.
      </Typography>
    );
  }

  const displayImage = profile?.media?.path
    ? profile.media.path.startsWith("http")
      ? profile.media.path
      : `${process.env.NEXT_PUBLIC_API_URL}${profile.media.path.startsWith("/") ? "" : "/"}${profile.media.path}`
    : undefined;

  const displayEmail = profile?.email ?? "—";

  const profileCampaignsCount = campaigns.length;

  const profileContributionsCount = contributions.length;

  const isCreator = profile?.role === "creator";

  return (
    <Box
      sx={{
        minHeight: "80vh",
        p: { xs: 1, md: 4 },
        borderRadius: 2,
        width: "100%",
      }}
    >
      <Grid container spacing={2}>
        {/* LEFT SIDEBAR */}
        <Grid size={{ xs: 12, md: 3, lg: 2.5 }}>
          <Paper sx={{ py: 4, px: 2, borderRadius: 3 }}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              mb={2}
            >
              <Avatar
                src={displayImage}
                alt={profile?.username ?? "User"}
                sx={{ width: 130, height: 130, mb: 2, boxShadow: 1 }}
              />
              <Typography variant="h6" fontWeight={700} textAlign="center">
                {profile?.username ?? "—"}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
              >
                {displayEmail}
              </Typography>
            </Box>

            <Divider sx={{ my: 3 }} />

            <List>
              <ListItem disablePadding>
                <ListItemButton
                  selected={tab === "profile"}
                  onClick={() => setTab("profile")}
                  sx={{ borderRadius: 2, mb: 0.5 }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText primary="Profile" />
                </ListItemButton>
              </ListItem>
              {isCreator && (
                <ListItem disablePadding>
                  <ListItemButton
                    selected={tab === "campaigns"}
                    onClick={() => setTab("campaigns")}
                    sx={{ borderRadius: 2, mb: 0.5 }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <DashboardCustomizeIcon />
                    </ListItemIcon>
                    <ListItemText primary="Campaigns" />
                  </ListItemButton>
                </ListItem>
              )}
              <ListItem disablePadding>
                <ListItemButton
                  selected={tab === "contributions"}
                  onClick={() => setTab("contributions")}
                  sx={{ borderRadius: 2, mb: 0.5 }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <AssignmentTurnedInIcon />
                  </ListItemIcon>
                  <ListItemText primary="Contributions" />
                </ListItemButton>
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* RIGHT CONTENT */}
        <Grid size={{ xs: 12, md: 9, lg: 9.5 }}>
          {(tab === "profile" || (tab === "campaigns" && !isCreator)) && (
            <Paper sx={{ p: 3, borderRadius: 3, bgcolor: "#fff" }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
              >
                <Typography variant="h5" fontWeight={700}>
                  My Profile
                </Typography>
                {isCreator && (
                  <Chip
                    icon={<VerifiedIcon />}
                    label="Creator"
                    sx={{
                      background:
                        "linear-gradient(45deg, #12c998 30%, #f070a1 90%)",
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
                      value={[
                        profile?.first_name,
                        profile?.middle_name,
                        profile?.surname,
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    />
                    <InfoItem
                      icon={Calendar}
                      label="Birth Date"
                      value={
                        profile?.birth_date
                          ? new Date(profile.birth_date).toLocaleDateString(
                              "en-GB",
                              {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              },
                            )
                          : "—"
                      }
                    />
                    <InfoItem
                      icon={Globe}
                      label="Country"
                      value={profile?.country?.en_name}
                    />
                  </SectionCard>
                </Grid>

                {/* Contact Information Card */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <SectionCard title="Contact Details" icon={Phone}>
                    <InfoItem
                      icon={Mail}
                      label="Email Address"
                      value={profile?.email}
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
                    {isCreator &&
                      profile?.creator?.social_links &&
                      profile.creator.social_links.length > 0 && (
                        <InfoItem
                          icon={Link2}
                          label="Social Media"
                          value={
                            <Stack
                              direction="row"
                              spacing={1}
                              flexWrap="wrap"
                              sx={{ mt: 0.5 }}
                            >
                              {profile.creator.social_links.map(
                                (link: SocialLink, index: number) => (
                                  <Tooltip
                                    key={index}
                                    title={link.platform}
                                    arrow
                                  >
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
                                        "&:hover": {
                                          bgcolor: "#f1f5f9",
                                          borderColor: "primary.main",
                                        },
                                      }}
                                    >
                                      {getSocialIcon(link.platform)}
                                    </IconButton>
                                  </Tooltip>
                                ),
                              )}
                            </Stack>
                          }
                        />
                      )}
                  </SectionCard>
                </Grid>

                {/* Bio Section */}
                <Grid size={{ xs: 12 }}>
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    gutterBottom
                    sx={{ mt: 1 }}
                  >
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
                      {profile?.user_description || "No description provided."}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Project
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      bgcolor: "rgb(248, 248, 248)",
                    }}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1}
                      sx={{ mb: 1 }}
                    >
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
                        {profileContributionsCount}
                      </Typography>
                    </Stack>
                    <Typography color="text.secondary">
                      Contributions
                    </Typography>
                  </Paper>
                </Grid>
                {profile?.role === "creator" && (
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Paper
                      sx={{
                        p: 2,
                        borderRadius: 3,
                        bgcolor: "rgb(248, 248, 248)",
                      }}
                    >
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        sx={{ mb: 1 }}
                      >
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
                          {profileCampaignsCount}
                        </Typography>
                      </Stack>
                      <Typography color="text.secondary">Campaigns</Typography>
                    </Paper>
                  </Grid>
                )}
              </Grid>
            </Paper>
          )}

          {tab === "campaigns" && (
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                bgcolor: "#fff",
                height: "60vh",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box
                display="flex"
                flexDirection={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "stretch", sm: "center" }}
                mb={2}
                gap={2}
                flexShrink={0}
              >
                <Typography
                  variant="h5"
                  fontWeight={700}
                  sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
                >
                  Campaigns by {profile?.username}
                </Typography>
                <TextField
                  placeholder="Search campaigns..."
                  variant="outlined"
                  size="small"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{ width: { xs: "100%", sm: 300 } }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                    sx: { borderRadius: 3 },
                  }}
                />
              </Box>

              <Box sx={{ flex: 1, overflowY: "auto", pr: 1 }}>
                {campaignsLoading ? (
                  <CircularProgress />
                ) : filteredCampaigns.length > 0 ? (
                  <CampaignList campaigns={filteredCampaigns} />
                ) : (
                  <Paper sx={{ p: 4, textAlign: "center", borderRadius: 3 }}>
                    <Typography color="text.secondary">
                      No campaigns found.
                    </Typography>
                  </Paper>
                )}
              </Box>
            </Paper>
          )}
          {tab === "contributions" && (
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                bgcolor: "#fff",
                height: "60vh",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box
                display="flex"
                flexDirection={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "stretch", sm: "center" }}
                mb={2}
                gap={2}
                flexShrink={0}
              >
                <Typography
                  variant="h5"
                  fontWeight={700}
                  sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
                >
                  Contributions by {profile?.username}
                </Typography>
                <TextField
                  placeholder="Search contributions..."
                  variant="outlined"
                  size="small"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{ width: { xs: "100%", sm: 300 } }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                    sx: { borderRadius: 3 },
                  }}
                />
              </Box>

              <Box sx={{ flex: 1, overflowY: "auto", pr: 1 }}>
                {contributionsLoading ? (
                  <CircularProgress />
                ) : filteredContributions.length > 0 ? (
                  <ContributorList contributions={filteredContributions} />
                ) : (
                  <Paper sx={{ p: 4, textAlign: "center", borderRadius: 3 }}>
                    <Typography color="text.secondary">
                      No contributions found.
                    </Typography>
                  </Paper>
                )}
              </Box>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
