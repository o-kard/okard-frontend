"use client";

import React from "react";
import { Box, Container, Typography, Grid, Avatar } from "@mui/material";
import { motion } from "framer-motion";
import { scaleIn } from "../animations";

const teamMembers = [
    {
        name: "Pattarachai Wannasuntad",
        title: "DevOps & Developer",
        image: ""
    },
    {
        name: "Phuwapat Jaisin",
        title: "AI & Developer",
        image: ""
    },
    {
        name: "Wisapat Pattanapun",
        title: "System Desgin & Developer",
        image: ""
    }
];

export default function TeamSection() {
    return (
        <Container maxWidth="lg" sx={{ py: 12 }}>
            <Typography variant="h3" align="center" fontWeight="bold" sx={{ mb: 2, fontSize: { xs: "2rem", sm: "3rem", md: "3.5rem" } }}>
                Meet The Team
            </Typography>
            <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 8, maxWidth: "600px", mx: "auto" }}>
                The creative minds behind the platform.
            </Typography>

            <Grid container spacing={3} justifyContent="center">
                {teamMembers.map((member, index) => (
                    <Grid size={{ xs: 6, sm: 3, md: 3 }} key={index}>
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={scaleIn}
                        >
                            <Box sx={{ textAlign: "center" }}>
                                <Avatar
                                    sx={{
                                        width: 120,
                                        height: 120,
                                        mx: "auto",
                                        mb: 2,
                                        border: "4px solid white",
                                        boxShadow: "0 8px 20px rgba(0,0,0,0.1)"
                                    }}
                                    src={member.image}
                                />
                                <Typography variant="h6" fontWeight="bold" sx={{ fontSize: "1rem" }}>{member.name}</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.8rem" }}>{member.title}</Typography>
                            </Box>
                        </motion.div>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}
