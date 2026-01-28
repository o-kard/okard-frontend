"use client";

import React from "react";
import { Box, Container, Typography, Grid } from "@mui/material";
import { motion } from "framer-motion";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import CreateIcon from "@mui/icons-material/Create";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import { fadeInUp, staggerContainer } from "../animations";

const steps = [
    {
        title: "Sign Up",
        description: "Create your account and verify your identity to join our creator community.",
        icon: <AppRegistrationIcon fontSize="large" />,
    },
    {
        title: "Create Project",
        description: "Draft your campaign details. Tell your story and set your funding goals.",
        icon: <CreateIcon fontSize="large" />,
    },
    {
        title: "AI Analysis",
        description: "Receive instant AI predictions to refine and elevate your campaign for maximum success.",
        icon: <AnalyticsIcon fontSize="large" />,
    },
    {
        title: "Launch",
        description: "Publish your campaign to the world and start gathering support.",
        icon: <RocketLaunchIcon fontSize="large" />,
    },
];


export default function CreatorJourney() {
    const [hoveredStep, setHoveredStep] = React.useState<number | null>(null);

    return (
        <Box sx={{ py: 12, bgcolor: "#fff" }}>
            <Container maxWidth="lg">
                <Typography variant="h3" align="center" fontWeight="bold" mb={8} sx={{ fontSize: { xs: "2rem", sm: "3rem", md: "3.5rem" } }}>
                    Your Journey as a Creator
                </Typography>

                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    <Grid container spacing={0} justifyContent="center" sx={{ position: "relative" }}>
                        {/* Connecting Line (Desktop) */}
                        <Box
                            sx={{
                                display: { xs: "none", md: "block" },
                                position: "absolute",
                                top: 40,
                                left: "12.5%",
                                right: "12.5%",
                                height: 2,
                                bgcolor: "#e0e0e0",
                                zIndex: 0
                            }}
                        />


                        {/* Animated Line Segments */}
                        {steps.slice(0, -1).map((_, index) => (
                            <Box
                                key={`line-${index}`}
                                sx={{
                                    display: { xs: "none", md: "block" },
                                    position: "absolute",
                                    top: 40,
                                    left: `${12.5 + index * 25}%`,
                                    width: "25%",
                                    height: 2,
                                    zIndex: 1,
                                    overflow: "hidden"
                                }}
                            >
                                {(hoveredStep !== null && hoveredStep > index) && (
                                    <motion.div
                                        initial={{ x: "-100%" }}
                                        animate={{ x: "100%" }}
                                        transition={{
                                            duration: 1,
                                            repeat: Infinity,
                                            ease: "linear",
                                        }}
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            background: "linear-gradient(90deg, transparent, #12C998, transparent)",
                                        }}
                                    />
                                )}
                            </Box>
                        ))}

                        {steps.map((step, index) => (
                            <Grid
                                size={{ xs: 12, sm: 6, md: 3 }}
                                key={index}
                                onMouseEnter={() => setHoveredStep(index)}
                                onMouseLeave={() => setHoveredStep(null)}
                            >
                                <motion.div variants={fadeInUp}>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            textAlign: "center",
                                            position: "relative",
                                            zIndex: 1,
                                            px: 2,
                                            mb: { xs: 6, md: 0 }
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 80,
                                                height: 80,
                                                bgcolor: "white",
                                                border: "2px solid #12C998",
                                                borderRadius: "50%",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                color: "#12C998",
                                                mb: 3,
                                                boxShadow: "0 0 0 8px white"
                                            }}
                                        >
                                            {step.icon}
                                        </Box>
                                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                                            {index + 1}. {step.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {step.description}
                                        </Typography>
                                    </Box>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </motion.div>
            </Container>
        </Box>
    );
}
