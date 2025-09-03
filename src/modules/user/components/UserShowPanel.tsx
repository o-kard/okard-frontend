import { useUser } from "@clerk/nextjs";
import {
  Box as MuiBox,
  Divider,
  Paper,
  Typography,
  Stack,
  Box,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import { getUserById } from "../api/api";
import CampaignIcon from "@mui/icons-material/Campaign";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";

// Profile (read-only)
export default function ProfilePanel() {
  const { user, isLoaded } = useUser();
  const [profile, setProfile] = useState<any | null>(null);

  useEffect(() => {
    if (!isLoaded || !user) return;
    let abort = false;
    (async () => {
      try {
        const r = await getUserById(user.id);
        if (r) {
          console.log("Fetched user profile:", r);
          if (!abort) setProfile(r);
        }
      } catch {}
    })();
    return () => {
      abort = true;
    };
  }, [isLoaded, user]);

  return (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        My Profile
      </Typography>

      <Grid container spacing={2}>
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
            {/* change to fname + mname + sname */}
            <Typography variant="subtitle2" color="text.secondary">
              Contact
            </Typography>
            <Typography mb={2} ml={1.5}>{profile?.tel ?? "—"}</Typography>
            <Typography variant="subtitle2" color="text.secondary">
              Country
            </Typography>
            <Typography mb={2} ml={1.5}>{profile?.country.en_name ?? "—"}</Typography>
          </MuiBox>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Email
          </Typography>
          <Typography mb={2} ml={1.5}>
            {user?.primaryEmailAddress?.emailAddress ?? "—"}
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
                {profile?.contributionCount ?? 0}
              </Typography>
            </Stack>
            <Typography color="text.secondary">Contribution(s)</Typography>
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
            <Typography color="text.secondary">My Campaign(s)</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Paper>
  );
}
