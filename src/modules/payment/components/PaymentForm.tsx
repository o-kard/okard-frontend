// src/modules/payment/components/PaymentForm.tsx
"use client";
import { Stack, Typography, TextField, Button } from "@mui/material";

const QUICK = [300, 1000, 5000, 10000];

export default function PaymentForm({
  fullName,
  email,
  amount,
  setFullName,
  setEmail,
  setAmount,
}: {
  fullName: string;
  email: string;
  amount: number;
  setFullName: (v: string) => void;
  setEmail: (v: string) => void;
  setAmount: (v: number) => void;
}) {
  return (
    <Stack
      spacing={2}
      sx={{ bgcolor: "white", p: 3, borderRadius: 3, boxShadow: 1, mb: 2 }}
    >
      <Typography variant="h4" fontWeight={900}>
        Checkout
      </Typography>
      <TextField
        label="Full name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        fullWidth
      />
      <TextField
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)}
        helperText={
          email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
            ? "Invalid email format"
            : ""
        }
        fullWidth
      />

      <Typography fontWeight={800}>Enter Your Contribution</Typography>
      <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
        {QUICK.map((v) => (
          <Button
            key={v}
            variant={amount === v ? "contained" : "outlined"}
            onClick={() => setAmount(v)}
          >
            {v.toLocaleString()} USD
          </Button>
        ))}
      </Stack>

      <TextField
        label="Specify amount (USD)"
        type="number"
        value={amount || ""}
        onChange={(e) => setAmount(Number(e.target.value || 0))}
        inputProps={{ min: 0 }}
        fullWidth
      />
    </Stack>
  );
}
