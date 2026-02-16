"use client";

import React from "react";
import { Box, Typography, Stack } from "@mui/material";
import { ContributorWithPost } from "../types";
import ContributorCard from "./ContributorCard";

interface ContributorListProps {
    contributions: ContributorWithPost[];
}

export default function ContributorList({ contributions }: ContributorListProps) {
    if (contributions.length === 0) {
        return (
            <Box sx={{ py: 8, textAlign: "center" }}>
                <Typography color="text.secondary">No contributions found.</Typography>
            </Box>
        );
    }

    return (
        <Stack
            spacing={2}
            sx={{
                py: 2,
                maxHeight: "100%",
                overflowY: "auto",
                pr: 1, // Space for scrollbar
                '&::-webkit-scrollbar': {
                    width: '6px',
                },
                '&::-webkit-scrollbar-track': {
                    background: 'transparent',
                },
                '&::-webkit-scrollbar-thumb': {
                    background: 'rgba(0,0,0,0.1)',
                    borderRadius: '10px',
                    '&:hover': {
                        background: 'rgba(0,0,0,0.2)',
                    },
                },
            }}
        >
            {contributions.map((contribution) => (
                <ContributorCard key={contribution.id} contribution={contribution} />
            ))}
        </Stack>
    );
}
