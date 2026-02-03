"use client";

import { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";

export type SectionItem = {
  key: string;
  label: string;
  content: React.ReactNode;
};

type Props = {
  sections: SectionItem[];
  stickyTop?: number;
};

export default function PostDetailTabs({ sections, stickyTop = 64 }: Props) {
  const [value, setValue] = useState(0);

  if (!sections?.length) return null;

  return (
    <Box
      sx={{
        mt: 4,
        bgcolor: "white",
        borderRadius: 4,
        boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
      }}
    >
      <Box
        sx={{
          position: "sticky",
          top: stickyTop,
          bgcolor: "white",
          zIndex: 5,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Tabs
          value={value}
          onChange={(_, v) => setValue(v)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            px: 2,
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 800,
              minHeight: 48,
              fontSize: 16,
              mr: 4, // Increase spacing between tabs
              color: "text.secondary",
              "&:hover": { color: "primary.main" },
            },
            "& .MuiTabs-indicator": {
              bgcolor: "#18C59B", // Match primary color
              height: 3,
              borderRadius: "3px 3px 0 0",
            },
            "& .Mui-selected": { color: "#18C59B !important" },
          }}
        >
          {sections.map((s) => (
            <Tab key={s.key} label={s.label} disableRipple />
          ))}
        </Tabs>
      </Box>

      <Box sx={{ py: 3 }}>{sections[value].content}</Box>
    </Box>
  );
}
