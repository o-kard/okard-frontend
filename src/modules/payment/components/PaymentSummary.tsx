// src/modules/payment/components/PaymentSummary.tsx
"use client";
import {
  Stack,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Divider,
} from "@mui/material";

export default function PaymentSummary({
  amount,
  tip,
  total,
  agree,
  onChangeTip,
  onChangeAgree,
  onSubmit,
  disabled,
}: {
  amount: number;
  tip: number;
  total: number;
  agree: boolean;
  onChangeTip: (n: number) => void;
  onChangeAgree: (b: boolean) => void;
  onSubmit: () => void;
  disabled?: boolean;
}) {
  return (
    <Stack
      spacing={2}
      sx={{ bgcolor: "white", p: 3, borderRadius: 3, boxShadow: 1 }}
    >
      <Divider />
      <Typography fontWeight={800}>Summary</Typography>

      <Stack direction="row" justifyContent="space-between">
        <Typography color="text.secondary">Your contribution</Typography>
        <Typography color="text.secondary">
          {(amount || 0).toLocaleString()} USD
        </Typography>
      </Stack>

      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography color="text.secondary">Okard tip</Typography>
        <TextField
          size="small"
          type="number"
          value={tip || ""}
          onChange={(e) => onChangeTip(Number(e.target.value || 0))}
          inputProps={{ min: 0, style: { textAlign: "right", width: 110 } }}
        />
      </Stack>

      <Stack
        direction="row"
        justifyContent="space-between"
        sx={{ bgcolor: "#eee", p: 1.2, borderRadius: 1 }}
      >
        <Typography fontWeight={800}>Total</Typography>
        <Typography fontWeight={800}>{total.toLocaleString()} USD</Typography>
      </Stack>

      <FormControlLabel
        control={
          <Checkbox
            checked={agree}
            onChange={(e) => onChangeAgree(e.target.checked)}
          />
        }
        label="I agree to the Terms of Use and have read and understand the Privacy Policy"
      />

      <Button
        variant="contained"
        size="large"
        sx={{ bgcolor: "#18C59B", fontWeight: 800 }}
        disabled={disabled}
        onClick={onSubmit}
      >
        SUBMIT PAYMENT
      </Button>
    </Stack>
  );
}
