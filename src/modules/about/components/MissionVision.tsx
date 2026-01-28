"use client";

import React from "react";
import { Box, Container, Typography, Grid } from "@mui/material";
import { motion } from "framer-motion";
import { fadeInUp } from "../animations";

export default function MissionVision() {
    return (
        <Container maxWidth="lg" sx={{ py: 12 }}>
            <Grid container spacing={8} alignItems="center">
                <Grid size={{ xs: 12, md: 6 }}>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={fadeInUp}
                    >
                        <Typography variant="overline" color="primary" fontWeight="bold" fontSize="1rem">
                            Our Mission
                        </Typography>
                        <Typography variant="h3" fontWeight="bold" sx={{ mb: 3, color: "#333", fontSize: { xs: "2rem", sm: "3rem", md: "3.5rem" } }}>
                            Connecting Dreams to Reality.
                        </Typography>
                        <Typography variant="body1" color="text.secondary" paragraph sx={{ fontSize: "1.1rem", lineHeight: 1.8 }}>
                            We build the <Box component="span" fontWeight="bold" color="primary.main">intelligent bridge</Box> that connects visionary dreamers with the dedicated supporters needed to turn bold ideas into reality.
                        </Typography>
                        <Typography variant="body1" color="text.secondary" paragraph sx={{ fontSize: "1.1rem", lineHeight: 1.8 }}>
                            By leveraging <Box component="span" fontWeight="bold" color="secondary.main">advanced AI and machine learning</Box>, we ensure every project finds its perfect audience through smart, data-driven discovery.
                        </Typography>

                        <Box sx={{ mt: 3, pl: 2, borderLeft: "4px solid #12C998" }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: "#333" }}>
                                Empowering Impact
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ fontSize: "1.1rem", fontStyle: "italic" }}>
                                "Our platform empowers creators to refine their potential and transform ambitious sparks into tangible global impact."
                            </Typography>
                        </Box>
                    </motion.div>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <motion.div
                        initial={{ opacity: 0, x: 100 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <Box
                            sx={{
                                height: "400px",
                                width: "100%",
                                borderRadius: 4,
                                backgroundImage: "url('/bridge.jpg')",
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
                            }}
                        />
                    </motion.div>
                </Grid>
            </Grid>
        </Container>
    );
}
