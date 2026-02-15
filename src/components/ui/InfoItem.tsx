import { Stack, Box, Typography } from "@mui/material";
import React from "react";

interface InfoItemProps {
    icon: any; // Accepting Lucide icon component
    label: string;
    value: string | React.ReactNode;
    isLink?: boolean;
}

export const InfoItem = ({
    icon: Icon,
    label,
    value,
    isLink = false,
}: InfoItemProps) => (
    <Stack direction="row" spacing={2} alignItems="center">
        <Box
            sx={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                bgcolor: "rgb(243, 246, 249)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#64748b",
                flexShrink: 0,
            }}
        >
            <Icon size={18} />
        </Box>
        <Box>
            <Typography variant="caption" color="text.secondary" fontWeight={600} display="block">
                {label}
            </Typography>
            <Typography
                variant="body2"
                component="div"
                sx={{
                    wordBreak: "break-word",
                    fontWeight: 500,
                    color: isLink ? "primary.main" : "text.primary",
                }}
            >
                {value || "—"}
            </Typography>
        </Box>
    </Stack>
);
