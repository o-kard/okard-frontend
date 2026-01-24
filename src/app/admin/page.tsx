"use client";
import { useState, useEffect} from "react";

import DashboardPage from "../../modules/admin/components/pages/DashboardPage";
import CampaignsPage from "../../modules/admin/components/pages/CampaignsPage";
import CreatorsPage from "../../modules/admin/components/pages/CreatorsPage";
import ReportsPage from "../../modules/admin/components/pages/ReportsPage";
import RequestsPage from "../../modules/admin/components/pages/RequestsPage";
import SettingsPage from "../../modules/admin/components/pages/SettingsPage";
import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";

const tabList = [
  // { label: "Dashboard", component: <DashboardPage /> },
  { label: "Campaigns", component: <CampaignsPage /> },
  { label: "Creators", component: <CreatorsPage /> },
  { label: "Reports", component: <ReportsPage /> },
  { label: "Requests", component: <RequestsPage /> },
  // { label: 'Settings', component: <SettingsPage /> },
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
        <div style={{ width: "100%" }}>
          <nav
            style={{
              display: "flex",
              gap: "2rem",
              borderBottom: "2px solid #1de9b6",
              marginBottom: 0,
              padding: "0 1rem",
              background: "rgba(34, 48, 74, 0.95)",
              position: "sticky",
              top: 0,
              zIndex: 10,
            }}
          >
            {tabList.map((t, i) => (
              <button
                key={t.label}
                onClick={() => setTab(i)}
                style={{
                  background: "none",
                  border: "none",
                  outline: "none",
                  color: tab === i ? "#1de9b6" : "#e6f7fa",
                  fontWeight: 700,
                  fontSize: "1rem",
                  padding: "1rem 0",
                  borderBottom:
                    tab === i ? "3px solid #1de9b6" : "3px solid transparent",
                  cursor: "pointer",
                  transition: "color 0.2s, border-bottom 0.2s",
                  opacity: tab === i ? 1 : 0.7,
                }}
                aria-current={tab === i ? "page" : undefined}
              >
                {t.label}
              </button>
            ))}
          </nav>
          <div style={{ width: "100%" }}>{tabList[tab].component}</div>
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
