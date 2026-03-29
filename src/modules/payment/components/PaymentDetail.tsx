// src/modules/payment/components/PaymentLeft.tsx
"use client";
import { Box, Chip } from "@mui/material";
import { CATEGORY_COLORS } from "@/modules/home/utils/categoryColors";

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
        {category && (() => {
          const catConfig = CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS.all;
          const Icon = catConfig.icon;
          return (
            <Chip
              icon={Icon ? <Icon /> : undefined}
              label={catConfig.label || category}
              size="small"
              sx={{
                position: "absolute",
                top: 16,
                right: 16,
                zIndex: 8,
                fontWeight: 700,
                textTransform: "capitalize",
                bgcolor: catConfig.color || "primary.main",
                color: "white",
                "& .MuiChip-icon": {
                  color: "white",
                },
              }}
            />
          );
        })()}
      </Box>
    </Box>
  );
}
