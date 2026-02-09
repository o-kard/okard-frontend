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
} from "@mui/material";
import Link from "next/link";
import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import { getUser } from "../api/api";
import CampaignIcon from "@mui/icons-material/Campaign";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import VerifiedIcon from "@mui/icons-material/Verified";

// Profile (read-only)
export default function ProfilePanel() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const [profile, setProfile] = useState<any | null>(null);

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
            <Typography mb={2} ml={1.5}>{profile?.country?.en_name ?? "—"}</Typography>
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
                  {profile?.campaignCount ?? 0}
                </Typography>
              </Stack>
              <Typography color="text.secondary">My Campaign(s)</Typography>
            </Paper>
          </Grid>
        )}
      </Grid>

      {!isCreator && (
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
    </Paper>
  );
}
