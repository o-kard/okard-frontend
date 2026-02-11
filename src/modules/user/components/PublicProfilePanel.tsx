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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import { getUserById } from "../api/api";
import CampaignIcon from "@mui/icons-material/Campaign";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import PersonIcon from "@mui/icons-material/Person";
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
import { Post } from "@/modules/post/types/post";
import { fetchPosts } from "@/modules/post/api/api";
import CampaignList from "./CampaignList";
import CreatorBadge from "./CreatorBadge";
import { Stack, Chip } from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";

interface PublicProfilePanelProps {
    userId: string;
}

type Tab = "profile" | "campaigns";

export default function PublicProfilePanel({ userId }: PublicProfilePanelProps) {
    const [profile, setProfile] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<Tab>("profile");
    const [campaigns, setCampaigns] = useState<Post[]>([]);
    const [campaignsLoading, setCampaignsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredCampaigns = campaigns.filter((post) =>
        post.post_header.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.post_description.toLowerCase().includes(searchQuery.toLowerCase())
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
        if (profile?.clerk_id) {
            setCampaignsLoading(true);
            fetchPosts(undefined, undefined, "newest", "all", "active", profile.clerk_id)
                .then((res) => {
                    setCampaigns(res);
                })
                .catch((err) => console.error(err))
                .finally(() => setCampaignsLoading(false));
        }
    }, [profile]);

    if (loading) {
        return <Box display="flex" justifyContent="center" p={5}><CircularProgress /></Box>;
    }

    if (!profile) {
        return <Typography textAlign="center" p={5}>User not found.</Typography>;
    }

    const displayImage = profile?.image?.path
        ? `${process.env.NEXT_PUBLIC_API_URL}${profile.image.path}`
        : undefined;

    const displayEmail = profile?.email ?? "—";

    const profileCampaignsCount = campaigns.filter((post) => post.user_id === profile?.id).length;

    const isCreator = profile?.role === 'creator';

    return (
        <Box sx={{ minHeight: "80vh", p: { xs: 1, md: 4 }, borderRadius: 2, width: "100%" }}>
            <Grid container spacing={2}>
                {/* LEFT SIDEBAR */}
                <Grid size={{ xs: 12, md: 3, lg: 2.5 }}>
                    <Paper sx={{ py: 4, px: 2, borderRadius: 3 }}>
                        <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
                            <Avatar
                                src={displayImage}
                                alt={profile?.username ?? "User"}
                                sx={{ width: 130, height: 130, mb: 2, boxShadow: 1 }}
                            />
                            <Typography variant="h6" fontWeight={700} textAlign="center">
                                {profile?.username ?? "—"}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" textAlign="center">
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
                                    <ListItemIcon sx={{ minWidth: 36 }}><PersonIcon /></ListItemIcon>
                                    <ListItemText primary="Profile" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton
                                    selected={tab === "campaigns"}
                                    onClick={() => setTab("campaigns")}
                                    sx={{ borderRadius: 2, mb: 0.5 }}
                                >
                                    <ListItemIcon sx={{ minWidth: 36 }}><DashboardCustomizeIcon /></ListItemIcon>
                                    <ListItemText primary="Campaigns" />
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </Paper>
                </Grid>

                {/* RIGHT CONTENT */}
                <Grid size={{ xs: 12, md: 9, lg: 9.5 }}>
                    {tab === "profile" && (
                        <Paper sx={{ p: 3, borderRadius: 3, bgcolor: "#fff" }}>
                            <Box display="flex" alignItems="center" gap={2} mb={2}>
                                <Typography variant="h5" fontWeight={700} sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}>
                                    Profile Details
                                </Typography>
                                {isCreator && (
                                    <CreatorBadge />
                                )}
                            </Box>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Box>
                                        <Typography variant="subtitle2" color="text.secondary">Name</Typography>
                                        <Typography mb={2} ml={1.5}>
                                            {[profile?.first_name, profile?.middle_name, profile?.surname].filter(Boolean).join(" ") || "—"}
                                        </Typography>
                                        <Typography variant="subtitle2" color="text.secondary">Contact</Typography>
                                        <Typography mb={2} ml={1.5}>{profile?.tel ?? "—"}</Typography>
                                        <Typography variant="subtitle2" color="text.secondary">Country</Typography>
                                        <Typography mb={2} ml={1.5}>{profile?.country?.en_name ?? "—"}</Typography>
                                    </Box>
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Box>
                                        <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                                        <Typography mb={2} ml={1.5}>{displayEmail}</Typography>
                                        <Typography variant="subtitle2" color="text.secondary">Address</Typography>
                                        <Typography mb={2} ml={1.5}>{profile?.address ?? "—"}</Typography>
                                        <Typography variant="subtitle2" color="text.secondary">Birthdate</Typography>
                                        <Typography mb={2} ml={1.5}>{profile?.birth_date ?? "—"}</Typography>
                                    </Box>
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <Typography variant="subtitle2" color="text.secondary">About me</Typography>
                                    <Typography sx={{ whiteSpace: "pre-line" }} ml={1.5}>{profile?.user_description ?? "—"}</Typography>
                                </Grid>
                            </Grid>

                            <Divider sx={{ my: 3 }} />
                            <Typography variant="h6" fontWeight={700} gutterBottom>Stats</Typography>
                            <Grid container spacing={2} sx={{ mt: 1 }}>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Paper sx={{ p: 2, borderRadius: 3, bgcolor: "rgb(248, 248, 248)" }}>
                                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                                            <Box sx={{ width: 45, height: 45, borderRadius: "50%", bgcolor: "rgb(18,201,152)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                <VolunteerActivismIcon sx={{ color: "#fff" }} />
                                            </Box>
                                            <Typography variant="h4" fontWeight={700}>{profile?.contributionCount ?? 0}</Typography>
                                        </Stack>
                                        <Typography color="text.secondary">Contributions</Typography>
                                    </Paper>
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Paper sx={{ p: 2, borderRadius: 3, bgcolor: "rgb(248, 248, 248)" }}>
                                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                                            <Box sx={{ width: 45, height: 45, borderRadius: "50%", bgcolor: "rgb(240,112,161)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                <CampaignIcon sx={{ color: "#fff" }} />
                                            </Box>
                                            <Typography variant="h4" fontWeight={700}>{profileCampaignsCount}</Typography>
                                        </Stack>
                                        <Typography color="text.secondary">Campaigns</Typography>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Paper>
                    )}

                    {tab === "campaigns" && (
                        <Paper sx={{ p: 3, borderRadius: 3, bgcolor: "#fff", height: "60vh", display: "flex", flexDirection: "column" }}>
                            <Box
                                display="flex"
                                flexDirection={{ xs: "column", sm: "row" }}
                                justifyContent="space-between"
                                alignItems={{ xs: "stretch", sm: "center" }}
                                mb={2}
                                gap={2}
                                flexShrink={0}
                            >
                                <Typography variant="h5" fontWeight={700} sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}>
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
                                        sx: { borderRadius: 3 }
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
                                        <Typography color="text.secondary">No campaigns found.</Typography>
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
