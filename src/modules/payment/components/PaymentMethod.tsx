// src/modules/payment/components/PaymentMethod.tsx
"use client";
import {
  Stack,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import type { PaymentType } from "../types/payment";

type Props = {
  value: PaymentType;
  onChange: (v: PaymentType) => void;
};

export default function PaymentMethodPicker({ value, onChange }: Props) {
  return (
    <Stack
      spacing={2}
      sx={{ bgcolor: "white", p: 3, borderRadius: 3, boxShadow: 1, mb: 2 }}
    >
      <Typography fontWeight={800}>Payment Method</Typography>
      <ToggleButtonGroup
        value={value}
        exclusive
        onChange={(_, val) => val && onChange(val)}
      >
        <ToggleButton value="promptpay">PromptPay</ToggleButton>
        <ToggleButton value="card">Card</ToggleButton>
        <ToggleButton value="true_money_wallet">True Money Wallet</ToggleButton>
        <ToggleButton value="pay_by_bank">Pay by Bank</ToggleButton>
      </ToggleButtonGroup>
    </Stack>
  );
}
