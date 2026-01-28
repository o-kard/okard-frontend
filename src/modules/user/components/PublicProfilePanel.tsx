import {
    Box as MuiBox,
    Divider,
    Paper,
    Typography,
    Stack,
    Box,
    Avatar,
    CircularProgress,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import { getUserById } from "../api/api";
import CampaignIcon from "@mui/icons-material/Campaign";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";

interface PublicProfilePanelProps {
    userId: string;
}

export default function PublicProfilePanel({ userId }: PublicProfilePanelProps) {
    const [profile, setProfile] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let abort = false;
        (async () => {
            try {
                const r = await getUserById(userId);
                if (r) {
                    console.log("Fetched public user profile:", r);
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

    return (
        <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h5" fontWeight={700} gutterBottom>
                Profile
            </Typography>

            <Grid container spacing={2}>
                {/* Profile Image & Basic Info */}
                <Grid size={{ xs: 12 }}>
                    <MuiBox display="flex" flexDirection="column" alignItems="center" mb={3}>
                        <Avatar
                            src={displayImage}
                            alt={profile?.username ?? "User"}
                            sx={{ width: 120, height: 120, mb: 2, border: "4px solid white", boxShadow: 1 }}
                        />
                        <Typography variant="h6" fontWeight={700}>
                            {profile?.username ?? "—"}
                        </Typography>
                    </MuiBox>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <MuiBox>
                        <Typography variant="subtitle2" color="text.secondary">
                            Name
                        </Typography>
                        <Typography mb={2} ml={1.5}>
                            {[profile?.first_name, profile?.middle_name, profile?.surname]
                                .filter(Boolean)
                                .join(" ") || "—"}
                        </Typography>
                        <Typography variant="subtitle2" color="text.secondary">
                            Contact
                        </Typography>
                        <Typography mb={2} ml={1.5}>{profile?.tel ?? "—"}</Typography>
                        <Typography variant="subtitle2" color="text.secondary">
                            Country
                        </Typography>
                        <Typography mb={2} ml={1.5}>{profile?.country?.en_name ?? "—"}</Typography>
                    </MuiBox>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                        Email
                    </Typography>
                    <Typography mb={2} ml={1.5}>
                        {displayEmail}
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary">
                        Address
                    </Typography>
                    <Typography mb={2} ml={1.5}>{profile?.address ?? "—"}</Typography>
                    <Typography variant="subtitle2" color="text.secondary">
                        Birthdate
                    </Typography>
                    <Typography mb={2} ml={1.5}>{profile?.birth_date ?? "—"}</Typography>
                </Grid>
            </Grid>
            <Grid size={{ xs: 12, md: 12 }}>
                <Typography variant="subtitle2" color="text.secondary">
                    About me
                </Typography>
                <Typography sx={{ whiteSpace: "pre-line" }} ml={1.5}>
                    {profile?.user_description ?? "—"}
                </Typography>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" fontWeight={700} gutterBottom>
                Stats
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
                                {profile?.contributionCount ?? 0}
                            </Typography>
                        </Stack>
                        <Typography color="text.secondary">Contributions</Typography>
                    </Paper>
                </Grid>

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
                                {profile?.campaignCount ?? 0}
                            </Typography>
                        </Stack>
                        <Typography color="text.secondary">Campaigns</Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Paper>
    );
}
