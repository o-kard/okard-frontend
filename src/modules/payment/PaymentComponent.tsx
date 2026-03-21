// src/modules/payment/PaymentComponent.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Container,
  Grid,
  Stack,
  Typography,
  LinearProgress,
} from "@mui/material";
import { createPayment } from "./api/api";
import type { Payment, PaymentType } from "./types/payment";
import PaymentDetail from "./components/PaymentDetail";
import PaymentForm from "./components/PaymentForm";
import PaymentMethodPicker from "./components/PaymentMethod";
import PaymentSummary from "./components/PaymentSummary";
import { resolveMediaUrl } from "@/utils/mediaUrl";
import { Campaign } from "../campaign/types/campaign";

type Props = {
  campaignId: string;
  userId: string;
};

export default function PaymentComponent({ campaignId, userId }: Props) {
  const router = useRouter();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [method, setMethod] = useState<PaymentType>("promptpay");
  const [agree, setAgree] = useState(false);

  useEffect(() => {
    if (!campaignId) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/campaign/${campaignId}`)
      .then((r) => r.json())
      .then(setCampaign);
  }, [campaignId]);

  const goal = Math.max(0, campaign?.goal_amount ?? 0);
  const current = Math.max(0, campaign?.current_amount ?? 0);
  const percent =
    goal > 0 ? Math.round((current / goal) * 100) : 0;

  const imgSrc = useMemo(
    () =>
      campaign?.images?.[0]?.path
        ? resolveMediaUrl(campaign.images[0].path)
        : undefined,
    [campaign],
  );

  const total = Math.max(0, amount || 0);

  const handleSubmit = async () => {
    if (!agree || !campaign || !userId) return;
    const payload: Payment = {
      campaign_id: campaign.id,
      full_name: fullName,
      email,
      payment_method: method,
      amount: total,
    };
    const res = await createPayment(payload, userId);
    if (res) {
      router.replace(`/campaign/show/${campaign.id}`);
    }
  };

  return (
    <Container maxWidth={false} sx={{ py: 5 }}>
      <Grid container spacing={4} alignItems="start">
        {/* LEFT */}
        <Grid size={{ xs: 12, md: 6 }}>
          <PaymentDetail
            imageSrc={imgSrc}
            title={campaign?.campaign_header ?? ""}
            category={campaign?.category ?? undefined}
          />
          <Box
            sx={{
              p: 3,
              borderTop: "1px solid",
              borderColor: "grey.200",
              bgcolor: "white",
              borderRadius: 2,
              mt: 2,
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ mb: 1 }}
            >
              <Typography variant="h5" fontWeight={800}>
                {goal.toLocaleString()} USD
              </Typography>
              <Typography color="text.secondary">
                {current.toLocaleString()} USD raised
              </Typography>
            </Stack>
            <LinearProgress
              value={Math.min(100, percent)}
              variant="determinate"
              sx={{ height: 10, borderRadius: 10 }}
            />
          </Box>
          <PaymentForm
            fullName={fullName}
            email={email}
            amount={amount}
            setFullName={setFullName}
            setEmail={setEmail}
            setAmount={setAmount}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <PaymentMethodPicker value={method} onChange={setMethod} />

          <PaymentSummary
            amount={amount}
            tip={0}
            total={total}
            agree={agree}
            onChangeTip={() => {}}
            onChangeAgree={setAgree}
            onSubmit={handleSubmit}
            disabled={
              !agree ||
              total <= 0 ||
              !fullName ||
              !email ||
              !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
            }
          />
        </Grid>
      </Grid>
    </Container>
  );
}
