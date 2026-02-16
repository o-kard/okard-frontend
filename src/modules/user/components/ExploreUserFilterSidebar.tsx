"use client";

import React from "react";
import {
    Box,
    Typography,
    RadioGroup,
    FormControlLabel,
    Radio,
    TextField,
    InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface UserFilterSidebarProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    selectedRole: string;
    onRoleChange: (value: string) => void;
    hideSearch?: boolean;
    onClose?: () => void;
}

export default function ExploreUserFilterSidebar({ searchQuery, onSearchChange, selectedRole, onRoleChange, hideSearch = false, onClose }: UserFilterSidebarProps) {
    return (
        <Box
            sx={{
                p: 3,
                position: { md: "sticky" },
                top: { md: 100 },
                background: "rgba(255, 255, 255, 0.7)",
                backdropFilter: "blur(10px)",
                borderRadius: 4,
                border: "1px solid rgba(255, 255, 255, 0.3)",
                boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
            }}
        >
            {!hideSearch && (
                <>
                    <Typography variant="body2" fontWeight={600} sx={{ mb: 2 }}>
                        Search
                    </Typography>
                    <TextField
                        fullWidth
                        size="small"
                        placeholder="Search user..."
                        variant="outlined"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        sx={{
                            mb: 2,
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
                </>
            )}

            <Typography variant="body2" fontWeight={600} sx={{ mb: 2 }}>
                User Filters
            </Typography>

            <RadioGroup
                value={selectedRole}
                onChange={(e) => {
                    onRoleChange(e.target.value);
                    if (onClose) onClose();
                }}
                name="role-radio-group"
            >
                <FormControlLabel
                    value="all"
                    control={<Radio size="small" sx={{ color: "#12C998", '&.Mui-checked': { color: "#12C998" } }} />}
                    label={<Typography variant="body2">All Users</Typography>}
                />
                <FormControlLabel
                    value="creator"
                    control={<Radio size="small" sx={{ color: "#12C998", '&.Mui-checked': { color: "#12C998" } }} />}
                    label={<Typography variant="body2">Creators</Typography>}
                />
                <FormControlLabel
                    value="user"
                    control={<Radio size="small" sx={{ color: "#12C998", '&.Mui-checked': { color: "#12C998" } }} />}
                    label={<Typography variant="body2">Backers</Typography>}
                />
            </RadioGroup>
        </Box>
    );
}
