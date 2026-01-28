"use client";

import React from "react";
import { Box, Container, Typography, Grid, Card, CardContent } from "@mui/material";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "../animations";

const values = [
    { 
        title: "Empowering Connections", 
        description: "We build a vibrant community where visionary creators and dedicated backers unite to thrive. By bridging the gap between bold ideas and the right support, we turn individual dreams into collective success.",
        color: "#FF6B6B" 
    },
    { 
        title: "Intelligent Discovery", 
        description: "We leverage advanced machine learning to match user preferences with the most relevant campaigns. Through personalized discovery, we ensure every innovation finds its perfect audience with data-driven precision.",
        color: "#4ECDC4" 
    },
    { 
        title: "Predictive Success", 
        description: "We empower every launch with AI-driven analytics to assess project potential and success probability. By providing clear predictive insights, we help creators refine their strategies and achieve tangible global impact.",
        color: "#45B7D1" 
    }
];

export default function OurValues() {
    return (
        <Box sx={{ bgcolor: "#fff", py: 12 }}>
            <Container maxWidth="lg">
                <Typography variant="h3" align="center" fontWeight="bold" sx={{ mb: 8, fontSize: { xs: "2rem", sm: "3rem", md: "3.5rem" } }}>
                    Our Core Values
                </Typography>

                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    <Grid container spacing={4}>
                        {values.map((item, index) => (
                            <Grid size={{ xs: 12, md: 4 }} key={index}>
                                <motion.div variants={fadeInUp}>
                                    <Card sx={{ height: "100%", borderRadius: 4, boxShadow: "0 10px 30px rgba(0,0,0,0.05)", borderTop: `6px solid ${item.color}` }}>
                                        <CardContent sx={{ p: 4, textAlign: "center" }}>
                                            <Box sx={{ width: 60, height: 60, borderRadius: "50%", bgcolor: `${item.color}20`, color: item.color, display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 3 }}>
                                                <Typography variant="h5" fontWeight="bold">{index + 1}</Typography>
                                            </Box>
                                            <Typography variant="h5" fontWeight="bold" gutterBottom>
                                                {item.title}
                                            </Typography>
                                            <Typography color="text.secondary">
                                                {item.description}
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
