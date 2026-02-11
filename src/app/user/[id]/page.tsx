"use client";
import React, { Suspense } from "react";
import { Container, Box, CircularProgress, Button } from "@mui/material";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useRouter, useParams } from "next/navigation";
import PublicProfilePanel from "@/modules/user/components/PublicProfilePanel";

function PublicProfileContent() {
    const router = useRouter();
    const params = useParams();
    const userId = params.id as string;

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "#f9fafb", width: "100%", maxWidth: "100%" }}>
            <Container maxWidth={false} sx={{ py: 4 }}>
                <Button
                    startIcon={<ArrowBackIosIcon />}
                    onClick={() => router.back()}
                    sx={{ mb: 3, color: "black", textTransform: "none", fontSize: "1rem" }}
                >
                    Back
                </Button>

                <PublicProfilePanel userId={userId} />
            </Container>
        </Box>
    );
}

export default function PublicProfilePage() {
    return (
        <Suspense fallback={
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <CircularProgress />
            </Box>
        }>
            <PublicProfileContent />
        </Suspense>
    );
}
