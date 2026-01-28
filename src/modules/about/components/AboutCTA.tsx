"use client";

import React from "react";
import { Box, Container, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AboutCTA() {
    return (
        <Box sx={{ bgcolor: "#222", color: "white", py: 10, textAlign: "center" }}>
            <Container maxWidth="md">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <Typography variant="h3" fontWeight="bold" gutterBottom sx={{ fontFamily: "var(--font-syncopate)", textTransform: "uppercase" }}>
                        Ready to start?
                    </Typography>
                    <Typography variant="h6" sx={{ mb: 4, opacity: 0.7 }}>
                        Join thousands of creators turning their dreams into reality.
                    </Typography>
                    <Button component={Link} href="/post" variant="contained" color="success" size="large" sx={{ borderRadius: 8, px: 6, py: 1.5, fontSize: "1.2rem", fontWeight: "bold" }}>
                        Get Started Now
                    </Button>
                </motion.div>
            </Container>
        </Box>
    );
}
