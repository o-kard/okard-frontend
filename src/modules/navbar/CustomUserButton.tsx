"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
import {
    Avatar,
    Menu,
    MenuItem,
    IconButton,
    Box,
    Typography,
    Divider,
    ListItemIcon
} from "@mui/material";
import Logout from "@mui/icons-material/Logout";
import Settings from "@mui/icons-material/Settings";
import Person from "@mui/icons-material/Person";

interface CustomUserButtonProps {
    size?: number;
}

export default function CustomUserButton({ size = 40 }: CustomUserButtonProps) {
    const { user } = useUser();
    const { signOut } = useClerk();
    const router = useRouter();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const pathname = usePathname();

    const handleClose = () => {
        setAnchorEl(null);
    };

    // Close menu when route changes
    useEffect(() => {
        handleClose();
    }, [pathname]);

    // Close menu on window resize
    useEffect(() => {
        window.addEventListener("resize", handleClose);
        return () => window.removeEventListener("resize", handleClose);
    }, []);

    // Close menu automatically after 5 seconds
    useEffect(() => {
        if (!open) return;
        const timer = setTimeout(() => {
            handleClose();
        }, 5000);
        return () => clearTimeout(timer);
    }, [open]);

    // Close menu on scroll
    useEffect(() => {
        if (!open) return;
        const handleScroll = () => {
            handleClose();
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [open]);

    if (!user) return null;

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };


    const handleProfile = () => {
        router.push(`/user`);
        handleClose();
    };

    const handleSignOut = () => {
        signOut();
        handleClose();
    };

    return (
        <>
            <IconButton
                onClick={handleClick}
                aria-controls={open ? "account-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                sx={{
                    padding: 0,
                    ml: 0,
                }}
            >
                <Avatar
                    sx={{ width: size, height: size }}
                    src={user.imageUrl}
                    alt={user.fullName || user.username || "User"}
                    imgProps={{ referrerPolicy: "no-referrer" }}
                />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                disableScrollLock={true}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: "visible",
                        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.15))",
                        mt: 1.5,
                        "& .MuiAvatar-root": {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        bgcolor: "rgba(255, 255, 255, 0.8)",
                        backdropFilter: "blur(20px)",
                        border: "1px solid rgba(255, 255, 255, 0.3)",
                        borderRadius: 4,
                        minWidth: 280,
                        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                    },
                }}
                transformOrigin={{ horizontal: "center", vertical: "top" }}
                anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
            >
                <Box px={2} py={1}>
                    <Typography variant="subtitle1" fontWeight="bold">
                        {user.fullName || user.username}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                        {user.primaryEmailAddress?.emailAddress}
                    </Typography>
                </Box>
                <Divider />
                <MenuItem onClick={handleProfile}>
                    <ListItemIcon>
                        <Person fontSize="small" />
                    </ListItemIcon>
                    Profile
                </MenuItem>
                <MenuItem onClick={handleSignOut}>
                    <ListItemIcon>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    Sign Out
                </MenuItem>
            </Menu>
        </>
    );
}
