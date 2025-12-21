"use client";

import { Box, Typography } from "@mui/material";
import { TabKey } from "../types/types";

type Props = {
  activeTab: TabKey
  onChange: (tab: TabKey) => void
}

export default function CampaignTabs({ activeTab, onChange  }: Props) {
  return (
    <Box sx={{ display: "flex", gap: 2 }}>
      <Tab
        label="Popular Campaigns"
        active={activeTab === "popular"}
        onClick={() => onChange("popular")}
      />
      <Tab
        label="For You"
        active={activeTab === "forYou"}
        onClick={() => onChange("forYou")}
      />
    </Box>
  );
}

function Tab({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
        <Typography
        onClick={onClick}
        sx={{
            cursor: "pointer",
            display: "inline-block",
            px: 2,
            py: 0.75,
            borderRadius: "12px",

            fontWeight: 600,
            fontSize: { xs: "1.1rem", md: "1.25rem" },
            color: active ? "#fff" : "#222",

            background: active
            ? "#424242"
            : "rgba(255,255,255,0.25)",

            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",

            transition: "all 0.25s ease",

            "&:hover": {
            color: "#fff",
            background: "#424242",
            },

            mb: 2,
        }}
        >
        {label}
        </Typography>

  );
}
