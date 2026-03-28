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
import { ContributorWithCampaign } from "../../contributor/types";
import ContributorList from "../../contributor/components/ContributorList";
import { useUser } from "@clerk/nextjs";

// Contributions
interface ContributionsPanelProps {
  contributions: ContributorWithCampaign[];
  loading: boolean;
}

export default function ContributionsPanel({ contributions, loading }: ContributionsPanelProps) {
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredContributions = useMemo(() => {
    if (!searchQuery) return contributions;
    const lowerQuery = searchQuery.toLowerCase();
    return contributions.filter((c) =>
      c.campaign.campaign_header.toLowerCase().includes(lowerQuery) ||
      c.campaign.campaign_description.toLowerCase().includes(lowerQuery)
    );
  }, [contributions, searchQuery]);

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
          Contributions by {user?.username || "Me"}
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
        ) : filteredContributions.length > 0 ? (
          <ContributorList contributions={filteredContributions} />
        ) : (
          <Paper sx={{ p: 4, textAlign: "center", borderRadius: 3, bgcolor: "#fff" }} elevation={0}>
            <Typography color="text.secondary">No contributions found.</Typography>
          </Paper>
        )}
      </Box>
    </Paper>
  );
}