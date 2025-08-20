"use client";

import { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";

export type SectionItem = {
  key: string; // unique key เช่น "campaign"
  label: string; // ชื่อบนแท็บ
  content: React.ReactNode;
};

type Props = {
  sections: SectionItem[];
  stickyTop?: number; // px: ให้แท็บลอยติดบน
};

export default function PostDetailTabs({ sections, stickyTop = 64 }: Props) {
  const [value, setValue] = useState(0);

  if (!sections?.length) return null;

  return (
    <Box sx={{ mt: 4 }}>
      {/* แถบแท็บแบบ sticky */}
      <Box
        sx={{
          position: "sticky",
          top: stickyTop,
          bgcolor: "background.paper",
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
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 800,
              minHeight: 48,
            },
            "& .MuiTabs-indicator": { bgcolor: "#e91e63" },
            "& .Mui-selected": { color: "#e91e63 !important" },
          }}
        >
          {sections.map((s) => (
            <Tab key={s.key} label={s.label} />
          ))}
        </Tabs>
      </Box>

      {/* เนื้อหาของแท็บที่เลือกเท่านั้น */}
      <Box sx={{ py: 3 }}>{sections[value].content}</Box>
    </Box>
  );
}
