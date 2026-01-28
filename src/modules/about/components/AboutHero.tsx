"use client";

import React from "react";
import { Box, Container, Typography } from "@mui/material";
import { motion } from "framer-motion";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { fadeInUp } from "../animations";
import Link from "next/link";

export default function AboutHero() {
    return (
        <Box
            sx={{
                minHeight: "80vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #12C998 0%, #00d2ff 100%)",
                color: "white",
                textAlign: "center",
                position: "relative",
                pt: 10
            }}
        >
            <Container maxWidth="md">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                >
                    <Typography variant="h2" fontWeight={900} sx={{ mb: 2, mx: "auto", fontFamily: "var(--font-syncopate)", textTransform: "uppercase", letterSpacing: "0.05em", fontSize: { xs: "2rem", sm: "3rem", md: "3.5rem" } }}>
                        Built by Dreamers <br /> Funded by You
                    </Typography>
                    <Typography variant="h6" sx={{ mb: 4, opacity: 0.9, fontWeight: 300, maxWidth: "500px", mx: "auto", fontSize: { xs: "0.8rem", sm: "1rem", md: "1.2rem" } }}>
                        Every great innovation starts with a vision. We provide the platform, but you provide the heartbeat that brings these ideas to life.
                    </Typography>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                >
                    <Link href="/post">
                        <Box
                            sx={{
                                width: "64px",
                                height: "64px",
                                bgcolor: "white",
                                borderRadius: "50%",
                                mx: "auto",
                                mt: 4,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                                cursor: "pointer",
                                transition: "transform 0.2s",
                                "&:hover": {
                                    transform: "scale(1.1)"
                                }
                            }}
                        >
                            <ArrowForwardIcon sx={{ fontSize: 40, color: "#12C998" }} />
                        </Box>
                    </Link>
                </motion.div>
            </Container>

            {/* Decorative Circle */}
            <Box
                component={motion.div}
                animate={{ y: [0, -20, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                sx={{
                    position: "absolute",
                    top: "20%",
                    left: "10%",
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    border: "4px solid rgba(255,255,255,0.3)"
                }}
            />
            <Box
                component={motion.div}
                animate={{ y: [0, 30, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                sx={{
                    position: "absolute",
                    bottom: "20%",
                    right: "10%",
                    width: "120px",
                    height: "120px",
                    borderRadius: "50%",
                    bgcolor: "rgba(255,255,255,0.1)"
                }}
            />
            <Box
                component={motion.div}
                animate={{ x: [0, 30, 0], opacity: [0.3, 0.6, 0.3] }}
                transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
                sx={{
                    position: "absolute",
                    top: "15%",
                    right: "15%",
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    border: "2px dashed rgba(255,255,255,0.8)"
                }}
            />
            <Box
                component={motion.div}
                animate={{ y: [0, -40, 0], scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 9, ease: "easeInOut", delay: 1 }}
                sx={{
                    position: "absolute",
                    bottom: "30%",
                    left: "5%",
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    bgcolor: "rgba(255,255,255,0.15)"
                }}
            />
            <Box
                component={motion.div}
                animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 0] }}
                transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
                sx={{
                    position: "absolute",
                    top: "40%",
                    right: "-5%",
                    width: "150px",
                    height: "150px",
                    borderRadius: "50%",
                    border: "1px solid rgba(255,255,255,0.1)",
                    opacity: 0.5
                }}
            />
            <Box
                component={motion.div}
                animate={{ x: [0, -50, 0], y: [0, 20, 0] }}
                transition={{ repeat: Infinity, duration: 8, ease: "easeInOut", delay: 2 }}
                sx={{
                    position: "absolute",
                    bottom: "10%",
                    left: "30%",
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    bgcolor: "rgba(255, 255, 255, 0.4)",
                    boxShadow: "0 0 10px rgba(255,255,255,0.5)"
                }}
            />
            <Box
                component={motion.div}
                animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                sx={{
                    position: "absolute",
                    top: "10%",
                    left: "40%",
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    bgcolor: "white"
                }}
            />
        </Box>
    );
}
