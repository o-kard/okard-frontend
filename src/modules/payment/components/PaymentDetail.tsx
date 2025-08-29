// src/modules/payment/components/PaymentLeft.tsx
"use client";
import { Box, Chip } from "@mui/material";

export default function PaymentDetail({
  imageSrc,
  title,
  category,
}: {
  imageSrc?: string;
  title: string;
  category?: string;
}) {
  return (
    <Box
      sx={{
        bgcolor: "common.white",
        borderRadius: 3,
        boxShadow: 1,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "relative",
          height: { xs: 420, md: 520 },
          bgcolor: "grey.100",
        }}
      >
        {imageSrc && (
          <Box
            component="img"
            src={imageSrc}
            alt={title}
            sx={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        )}
        {category && (
          <Chip
            label={category}
            color="primary"
            sx={{ position: "absolute", top: 16, right: 16, fontWeight: 700 }}
          />
        )}
      </Box>
    </Box>
  );
}
