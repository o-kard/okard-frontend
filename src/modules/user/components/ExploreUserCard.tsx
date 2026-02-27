"use client";

import React from "react";
import { Card, CardContent, Typography, Avatar, Button, Box } from "@mui/material";
import Link from "next/link";
import { User } from "@/modules/user/types/user";
import CreatorBadge from "@/modules/user/components/CreatorBadge"

interface UserCardProps {
    user: User;
}

export default function ExploreUserCard({ user }: UserCardProps) {
    return (
        <Card
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                borderRadius: 4,
                overflow: "hidden",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                position: "relative",
                border: "1px solid #f0f0f0",
                "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 12px 24px rgba(0,0,0,0.08)",
                    borderColor: "transparent",
                },
            }}
        >
            {/* Gradient Header */}
            <Box
                sx={{
                    height: 80,
                    background: "linear-gradient(135deg, #e0f2fe 0%, #fce7f3 100%)", // Light blue to light pink
                    position: "relative",
                }}
            >
                {/* Creator Badge - Top Right */}
                {user.role === "creator" && (
                    <Box sx={{ position: "absolute", top: 12, right: 12, zIndex: 1 }}>
                        <CreatorBadge variant="icon" />
                    </Box>
                )}
            </Box>

            <CardContent
                sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    pt: 0, // Remove top padding to let avatar overlap
                    pb: 3,
                    px: 3,
                }}
            >
                {/* Avatar overlapping header */}
                <Avatar
                    src={user.media?.path ? `${process.env.NEXT_PUBLIC_API_URL}${user.media.path}` : undefined}
                    alt={user.username}
                    sx={{
                        width: 90,
                        height: 90,
                        mt: -5,
                        mb: 2,
                        border: "4px solid white",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                        bgcolor: user.media?.path ? "#fff" : "#9e9e9e",
                        color: "#fff",
                        fontSize: "2.5rem",
                        fontWeight: 700,
                    }}
                >
                    {!user.media?.path && user.username?.charAt(0).toUpperCase()}
                </Avatar>

                <Typography variant="h6" fontWeight={700} gutterBottom sx={{ fontSize: "1.1rem" }}>
                    {user.username}
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        mb: 3,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        minHeight: 40, // consistent height for alignment
                        fontSize: "0.85rem",
                    }}
                >
                    {user.email}
                </Typography>

                <Box mt="auto" width="100%">
                    <Button
                        component={Link}
                        href={`/user/${user.id}`}
                        variant="outlined"
                        fullWidth
                        sx={{
                            borderRadius: 3,
                            textTransform: "none",
                            borderColor: "#e0e0e0",
                            color: "text.primary",
                            "&:hover": {
                                borderColor: "#12C998",
                                color: "#12C998",
                                bgcolor: "rgba(18, 201, 152, 0.04)",
                            },
                        }}
                    >
                        View Profile
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
}
