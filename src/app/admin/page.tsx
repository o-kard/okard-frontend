"use client";
import { useState, useEffect } from "react";
import { Box, ButtonBase } from "@mui/material";

import CampaignsPage from "../../modules/admin/components/pages/CampaignsPage";
import CreatorsPage from "../../modules/admin/components/pages/CreatorsPage";
import ReportsPage from "../../modules/admin/components/pages/ReportsPage";
import RequestsPage from "../../modules/admin/components/pages/RequestsPage";
import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";

const tabList = [
  { label: "Campaigns", component: <CampaignsPage /> },
  { label: "Users", component: <CreatorsPage /> },
  { label: "Reports", component: <ReportsPage /> },
  { label: "Requests", component: <RequestsPage /> },
];

export default function AdminDashboardTabs() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const initialTab = tabParam ? parseInt(tabParam, 10) : 0;
  const [tab, setTab] = useState(initialTab);

  useEffect(() => {
    if (tab !== initialTab) {
      const params = new URLSearchParams(Array.from(searchParams.entries()));
      params.set("tab", String(tab));
      router.replace(`?${params.toString()}`);
    }
  }, [tab]);

  useEffect(() => {
    if (tab !== initialTab) {
      setTab(initialTab);
    }
  }, [tabParam]);

  return (
    <>
      <SignedIn>
        <Box
          sx={{
            width: "100%",
            minHeight: "100vh",
            bgcolor: "#f8fafc",
            color: "#222222",
            display: "flex",
            flexDirection: "column",
            fontFamily: "'Inter', system-ui, sans-serif",
          }}
        >
          <Box
            component="header"
            sx={{
              position: "sticky",
              top: 0,
              zIndex: 50,
              bgcolor: "rgba(255, 255, 255, 0.85)",
              backdropFilter: "blur(20px)",
              borderBottom: "1px solid rgba(18, 201, 152, 0.4)",
              py: 2,
              display: "flex",
              justifyContent: "center",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
            }}
          >
            <Box
              component="nav"
              sx={{
                display: "inline-flex",
                gap: 1,
                bgcolor: "rgba(0, 0, 0, 0.03)",
                p: 1,
                borderRadius: 4,
                border: "1px solid rgba(0, 0, 0, 0.15)",
              }}
            >
              {tabList.map((t, i) => (
                <ButtonBase
                  key={t.label}
                  onClick={() => setTab(i)}
                  sx={{
                    background:
                      tab === i
                        ? "linear-gradient(135deg, #12C998 0%, #F472B6 100%)"
                        : "transparent",
                    color: tab === i ? "#ffffff" : "#666666",
                    fontWeight: 600,
                    letterSpacing: "0.02em",
                    fontSize: "0.95rem",
                    px: 3,
                    py: 1,
                    borderRadius: 3,
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    opacity: tab === i ? 1 : 0.8,
                    boxShadow:
                      tab === i
                        ? "0 4px 15px rgba(244, 114, 182, 0.3)"
                        : "none",
                    transform: tab === i ? "scale(1.02)" : "scale(1)",
                    "&:hover": {
                      color: tab !== i ? "#222222" : "#ffffff",
                      bgcolor:
                        tab !== i ? "rgba(0, 0, 0, 0.05)" : "transparent",
                    },
                  }}
                  aria-current={tab === i ? "page" : undefined}
                >
                  {t.label}
                </ButtonBase>
              ))}
            </Box>
          </Box>

          <Box
            component="main"
            sx={{
              flex: 1,
              width: "100%",
              animation: "fadeIn 0.4s ease-out",
              "@keyframes fadeIn": {
                "0%": { opacity: 0, transform: "translateY(8px)" },
                "100%": { opacity: 1, transform: "translateY(0)" },
              },
            }}
          >
            {tabList[tab].component}
          </Box>
        </Box>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
