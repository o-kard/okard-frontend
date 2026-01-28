"use client";

import React from "react";
import { Card, CardContent, Typography, Avatar, Button, Box } from "@mui/material";
import Link from "next/link";
import { User } from "@/modules/user/types/user";

interface UserCardProps {
    user: User;
}

export default function UserCard({ user }: UserCardProps) {
    return (
        <Card sx={{ height: "100%", display: "flex", flexDirection: "column", borderRadius: 4, transition: "transform 0.2s", "&:hover": { transform: "translateY(-4px)", boxShadow: "0 10px 20px rgba(0,0,0,0.1)" } }}>
            <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", p: 3 }}>
                <Avatar
                    src={`${process.env.NEXT_PUBLIC_API_URL}${user.image?.path || ""}`}
                    alt={user.username}
                    sx={{ width: 100, height: 100, mb: 2, border: "4px solid white", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}
                />
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {user.username}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                    {user.email}
                </Typography>
                <Box mt="auto">
                    <Button component={Link} href={`/user/${user.clerk_id}`} variant="outlined" size="small" sx={{ borderRadius: 20, textTransform: "none" }}>
                        View Profile
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
}
