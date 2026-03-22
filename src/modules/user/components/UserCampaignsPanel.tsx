import {
  Box,
  CircularProgress,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { SearchIcon } from "lucide-react";
import React, { useState, useMemo } from "react";
import { useUser } from "@clerk/nextjs";
import CampaignList from "./CampaignList";
import { Campaign } from "../../campaign/types/campaign";

// Campaigns
interface CampaignsPanelProps {
  campaigns: Campaign[];
  loading: boolean;
}

export default function CampaignsPanel({ campaigns, loading }: CampaignsPanelProps) {
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [profile] = useState<any | null>(null); // Kept for now if we want to display username, but maybe pass profile too?
  // Actually, let's just use the user object for username or pass profile as prop if needed.
  // For now, removing profile fetch inside here as well to be consistent.

  const filteredCampaigns = useMemo(() => {
    if (!searchQuery) return campaigns;
    const lowerQuery = searchQuery.toLowerCase();
    return campaigns.filter(c =>
      c.campaign_header.toLowerCase().includes(lowerQuery) ||
      c.campaign_description.toLowerCase().includes(lowerQuery)
    );
  }, [campaigns, searchQuery]);



  return (
    <Paper sx={{ p: 3, borderRadius: 3, bgcolor: "#fff", height: "623px", display: "flex", flexDirection: "column" }}>
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
          Campaigns by {user?.username || "Me"}
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
                <SearchIcon color="#666" size={20} />
              </InputAdornment>
            ),
            sx: { borderRadius: 3 }
          }}
        />
      </Box>

      <Box sx={{ flex: 1, overflowY: "auto", pr: 1 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : filteredCampaigns.length > 0 ? (
          <CampaignList campaigns={filteredCampaigns} showEditButton={true} />
        ) : (
          <Paper sx={{ p: 4, textAlign: "center", borderRadius: 3 }} elevation={0}>
            <Typography color="text.secondary">No campaigns found.</Typography>
          </Paper>
        )}
      </Box>
    </Paper>
  );
}