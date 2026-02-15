import { Paper, Stack, Box, Typography } from "@mui/material";
import React from "react";

interface SectionCardProps {
    title: string;
    children: React.ReactNode;
    icon?: any; // Accepting Lucide icon component
}

export const SectionCard = ({ title, children, icon: Icon }: SectionCardProps) => (
    <Paper
        variant="outlined"
        sx={{
            p: 3,
            borderRadius: 3,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            bgcolor: "white",
            borderColor: "divider",
            boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
        }}
    >
        <Stack direction="row" alignItems="center" spacing={1} mb={1}>
            {Icon && (
                <Box
                    sx={{
                        p: 0.8,
                        borderRadius: 1.5,
                        bgcolor: "#E9F5E9", // Light Green Faint
                        color: "#2E7D32",   // Green Darker
                        display: "flex",
                    }}
                >
                    <Icon size={18} />
                </Box>
            )}
            <Typography variant="h6" fontWeight={700}>
                {title}
            </Typography>
        </Stack>
        <Stack spacing={2.5}>{children}</Stack>
    </Paper>
);
