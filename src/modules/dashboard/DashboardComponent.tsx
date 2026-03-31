"use client";

import { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Typography,
  Select,
  MenuItem,
  Button,
  Stack,
  Grid,
  Container,
} from "@mui/material";
import { useUser } from "@clerk/nextjs";

import DashboardSummary from "./components/DashboardSummary";
import {
  fetchDashboardSummary,
  fetchDashboardCampaigns,
  fetchPaymentStats,
  fetchInvestorCountries,
  fetchTrendingCampaigns,
} from "./api/api";
import type {
  DashboardSummary as SummaryType,
  DashboardCampaign,
  TrendingCampaign,
} from "./types/dashboard";
import PaymentChart from "./components/DashboardBarChart";
import InvestorPieChart from "./components/DashboardPieChart";
import DashboardTrending from "./components/DashboardTrending";
import DashboardCampaigns from "./components/DashboardCampaigns";

export default function DashboardComponent() {
  const { user, isLoaded, isSignedIn } = useUser();
  const clerkId = user?.id ?? "";

  const [summary, setSummary] = useState<SummaryType | null>(null);
  const [campaigns, setCampaigns] = useState<DashboardCampaign[]>([]);
  const [payments, setPayments] = useState<
    { date: string; total_amount: number }[]
  >([]);
  const [countries, setCountries] = useState<
    { country: string; invest_count: number }[]
  >([]);
  const [trending, setTrending] = useState<TrendingCampaign[]>([]);
  const [loading, setLoading] = useState(true);

  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !clerkId) return;

    async function loadData() {
      try {
        const [s, p, pay, c, t] = await Promise.all([
          fetchDashboardSummary(clerkId),
          fetchDashboardCampaigns(clerkId, limit, offset),
          fetchPaymentStats(clerkId),
          fetchInvestorCountries(clerkId),
          fetchTrendingCampaigns(clerkId),
        ]);
        setSummary(s);
        setCampaigns(p);
        setPayments(pay);
        setCountries(c);
        setTrending(t);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [isLoaded, isSignedIn, clerkId, limit, offset]);

  if (!isSignedIn) {
    return <Typography>Please sign in to view your dashboard.</Typography>;
  }

  if (loading) return <CircularProgress />;

  return (
    <Container maxWidth={false}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 12 }}>
          {summary && <DashboardSummary summary={summary} />}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h5" mt={4} gutterBottom>
            My Campaigns
          </Typography>

          <Stack direction="row" spacing={2} mb={2} alignItems="center">
            <Typography>Rows per page:</Typography>
            <Select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setOffset(0);
              }}
              size="small"
            >
              {[5, 10, 20, 50].map((n) => (
                <MenuItem key={n} value={n}>
                  {n}
                </MenuItem>
              ))}
            </Select>

            <Button
              variant="outlined"
              size="small"
              disabled={offset === 0}
              onClick={() => setOffset(Math.max(0, offset - limit))}
            >
              Prev
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setOffset(offset + limit)}
            >
              Next
            </Button>
          </Stack>
          <DashboardCampaigns campaigns={campaigns} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h5" mt={4}>
            Investors by Country
          </Typography>
          <InvestorPieChart data={countries} />
        </Grid>
        <Grid size={{ xs: 12, md: 12 }}>
          <Typography variant="h5" mt={4}>
            Payments (last 7 days)
          </Typography>
          <PaymentChart data={payments} />
        </Grid>
        {/* <Grid size={{ xs: 12, md: 12 }}>
          <Typography variant="h5" mt={4}>
            🔥 Top 5 Trending Campaigns
          </Typography>
          <DashboardTrending data={trending} />
        </Grid> */}
      </Grid>
    </Container>
  );
}
