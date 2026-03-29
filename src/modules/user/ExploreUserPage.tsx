"use client";

import React, { useEffect, useState } from "react";
import { Container, Grid, Typography, Box, CircularProgress, IconButton, Drawer, useMediaQuery, TextField, InputAdornment, Pagination } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import { listUsers } from "@/modules/user/api/api";
import { User } from "@/modules/user/types/user";
import ExploreUserCard from "./components/ExploreUserCard";
import ExploreUserHeader from "./components/ExploreUserHeader";
import ExploreUserFilterSidebar from "./components/ExploreUserFilterSidebar";

export default function ExploreUserPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const isMdUp = useMediaQuery("(min-width:900px)");

    // Close mobile menu when screen size increases
    useEffect(() => {
        if (isMdUp) {
            setMobileOpen(false);
        }
    }, [isMdUp]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await listUsers();
                setUsers(data);
            } catch (error) {
                console.error("Failed to fetch users:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (user.first_name && user.first_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (user.surname && user.surname.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesRole = roleFilter === "all" ||
            (roleFilter === "creator" && user.role?.toLowerCase() === "creator") ||
            (roleFilter === "user" && user.role?.toLowerCase() === "user");
        
        const isNotSuspended = user.status !== "suspended";
        const isNotAdmin = user.role?.toLowerCase() !== "admin";

        return matchesSearch && matchesRole && isNotSuspended && isNotAdmin;
    });

    // Pagination
    const [page, setPage] = useState(1);
    const usersPerPage = 12;
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
    const paginatedUsers = filteredUsers.slice((page - 1) * usersPerPage, page * usersPerPage);

    // Reset pagination when filter changes
    useEffect(() => {
        setPage(1);
    }, [searchQuery, roleFilter]);

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ mb: 10 }}>
            <ExploreUserHeader />
            <Grid container spacing={4} sx={{ mt: 10 }}>

                {/* Mobile Menu Button & Search */}
                {!isMdUp && (
                    <Grid size={{ xs: 12 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" px={1} gap={2}>
                            <IconButton onClick={() => setMobileOpen(true)} sx={{ border: '1px solid #ddd', borderRadius: 2 }}>
                                <MenuIcon />
                                <Typography variant="button" sx={{ ml: 1, fontWeight: 600 }}>Filters</Typography>
                            </IconButton>

                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Search user..."
                                variant="outlined"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                sx={{
                                    bgcolor: "rgba(255,255,255,0.5)",
                                    borderRadius: 4,
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 4,
                                        fontSize: "0.9rem",
                                        height: "36px",
                                        paddingRight: "2px"
                                    },
                                    '& .MuiOutlinedInput-input': {
                                        padding: "2px 2px",
                                    }
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon color="action" fontSize="small" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Box>
                    </Grid>
                )}

                {/* Sidebar (Desktop) */}
                {isMdUp && (
                    <Grid size={{ xs: 12, md: 3, lg: 2.5 }}>
                        <ExploreUserFilterSidebar
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
                            selectedRole={roleFilter}
                            onRoleChange={setRoleFilter}
                        />
                    </Grid>
                )}

                {/* User Grid */}
                <Grid size={{ xs: 12, md: 9, lg: 9.5 }}>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                        Found : {filteredUsers.length} Users
                    </Typography>
                    <Grid container spacing={3}>
                        {paginatedUsers.map((user) => (
                            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={user.id}>
                                <ExploreUserCard user={user} />
                            </Grid>
                        ))}
                        {filteredUsers.length === 0 && (
                            <Grid size={{ xs: 12 }}>
                                <Box textAlign="center" py={5}>
                                    <Typography variant="h6" color="text.secondary">No users found matching your criteria.</Typography>
                                </Box>
                            </Grid>
                        )}
                    </Grid>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <Box display="flex" justifyContent="center" mt={4}>
                            <Pagination
                                count={totalPages}
                                page={page}
                                onChange={(event, value) => {
                                    setPage(value);
                                    window.scrollTo({ top: 0, behavior: "smooth" });
                                }}
                                color="primary"
                                shape="circular"
                                size="large"
                                sx={{
                                    "& .MuiPaginationItem-root": {
                                        fontWeight: 600,
                                        color: "#888",
                                        "&.Mui-selected": {
                                            bgcolor: "rgba(0, 0, 0, 0.12)",
                                            color: "#333",
                                            backdropFilter: "blur(4px)",
                                            "&:hover": {
                                                bgcolor: "rgba(0, 0, 0, 0.20)",
                                            },
                                        },
                                    },
                                }}
                            />
                        </Box>
                    )}
                </Grid>
            </Grid>

            {/* Mobile Drawer */}
            <Drawer
                anchor="left"
                open={mobileOpen}
                onClose={() => setMobileOpen(false)}
            >
                <Box sx={{ width: 300, p: 2, height: "100%", bgcolor: "#fff" }}>
                    <ExploreUserFilterSidebar
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        selectedRole={roleFilter}
                        onRoleChange={setRoleFilter}
                        hideSearch={true}
                        onClose={() => setMobileOpen(false)}
                    />
                </Box>
            </Drawer>
        </Container>
    );
}
