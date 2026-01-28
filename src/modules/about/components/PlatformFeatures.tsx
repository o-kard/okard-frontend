"use client";

import React from "react";
import { Box, Container, Typography, Grid, Card, CardContent, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import RecommendIcon from "@mui/icons-material/Recommend";
import BarChartIcon from "@mui/icons-material/BarChart";
import { fadeInUp, staggerContainer } from "../animations";

const features = [
    {
        title: "Recommendation Engine",
        description: "Our advanced algorithms analyze user preferences to suggest campaigns they'll love, increasing discoverability for creators.",
        icon: <RecommendIcon sx={{ fontSize: 40, color: "white" }} />,
        color: "#ff3366"
    },
    {
        title: "Success Prediction Model",
        description: "Before you launch, our AI predicts your campaign's success probability, empowering you to refine and optimize for the best results.",
        icon: <AutoGraphIcon sx={{ fontSize: 40, color: "white" }} />,
        color: "#4f46e5"
    },
    {
        title: "Statistical Analysis",
        description: "Access comprehensive statistical data to analyze campaign performance and understand your audience better.",
        icon: <BarChartIcon sx={{ fontSize: 40, color: "white" }} />,
        color: "#0ea5e9"
    }
];

export default function PlatformFeatures() {
    return (
        <Box sx={{ py: 12, bgcolor: "#f8fafc" }}>
            <Container maxWidth="lg">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                >
                    <Box textAlign="center" mb={8}>
                        <Typography variant="overline" color="primary" fontWeight="bold">
                            Why Choose Us
                        </Typography>
                        <Typography variant="h3" fontWeight="bold" mt={1} sx={{ fontSize: { xs: "2rem", sm: "3rem", md: "3.5rem" } }}>
                            Powered by Intelligence
                        </Typography>
                        <Typography variant="body1" color="text.secondary" maxWidth="600px" mx="auto" mt={2}>
                            We leverage cutting-edge technology to connect the right ideas with the right people.
                        </Typography>
                    </Box>
                </motion.div>

                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    <Grid container spacing={4}>
                        {features.map((feature, index) => (
                            <Grid size={{ xs: 12, md: 4 }} key={index}>
                                <motion.div variants={fadeInUp} style={{ height: "100%" }}>
                                    <Card
                                        sx={{
                                            height: "100%",
                                            borderRadius: 4,
                                            display: "flex",
                                            flexDirection: "column",
                                            transition: "transform 0.3s ease",
                                            "&:hover": { transform: "translateY(-8px)", boxShadow: "0 12px 40px rgba(0,0,0,0.1)" }
                                        }}
                                    >
                                        <CardContent sx={{ p: 4, flex: 1, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                                            <Box
                                                sx={{
                                                    width: 80,
                                                    height: 80,
                                                    borderRadius: "50%",
                                                    bgcolor: feature.color,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    mb: 3,
                                                    boxShadow: `0 8px 20px ${feature.color}40`
                                                }}
                                            >
                                                {feature.icon}
                                            </Box>
                                            <Typography variant="h5" fontWeight="bold" gutterBottom>
                                                {feature.title}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                                                {feature.description}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </motion.div>
            </Container>
        </Box>
    );
}
