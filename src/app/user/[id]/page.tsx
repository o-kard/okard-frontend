"use client";

import React, { Suspense } from "react";
import { Container, Box, CircularProgress, Button } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter, useParams } from "next/navigation";
import PublicProfilePanel from "@/modules/user/components/PublicProfilePanel";
import ClientNavbar from "@/modules/navbar/ClientNavbar";

function PublicProfileContent() {
    const router = useRouter();
    const params = useParams();
    const userId = params.id as string;

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "#f9fafb" }}>
            <ClientNavbar />
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => router.back()}
                    sx={{ mb: 3 }}
                >
                    Back to Explore
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
