"use client";

import React, { useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Box, Button, TextField, Typography, Container, Paper, Alert, Divider, IconButton, InputAdornment } from "@mui/material";
import Link from "next/link";
import { Google, Visibility, VisibilityOff } from "@mui/icons-material";
import { motion } from "framer-motion";

export default function SignInComponent() {
    const { isLoaded, signIn, setActive } = useSignIn();
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!isLoaded) return;

        try {
            const result = await signIn.create({
                identifier: username,
                password,
            });

            if (result.status === "complete") {
                await setActive({ session: result.createdSessionId });
                router.push("/");
            } else {
                console.log(result);
            }
        } catch (err: any) {
            console.error("error", err.errors[0].longMessage);
            setError(err.errors[0].longMessage);
        }
    };

    // Handle Google Sign-In (Unchanged for now)
    const handleGoogleSignIn = async () => {
        if (!isLoaded) return;
        try {
            await signIn.authenticateWithRedirect({
                strategy: "oauth_google",
                redirectUrl: "/sso-callback",
                redirectUrlComplete: "/",
            });
        } catch (err: any) {
            console.error("Google sign in error", err);
            setError("Failed to sign in with Google");
        }
    };

    return (
        <Box sx={{ display: "flex", minHeight: "100vh" }}>
            {/* Left Side - Image (Visible on md and up) */}
            <Box
                component={motion.div}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                sx={{
                    display: { xs: "none", md: "flex" },
                    flex: 1,
                    backgroundImage: "url(/pattern_2.jpg)", 
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                }}
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0, 0, 0, 0.3)", 
                    }}
                />
                <Box zIndex={1} textAlign="center">
                    <Typography variant="h3" fontWeight="bold" color="white" fontFamily="var(--font-syncopate)">
                        Welcome Back
                    </Typography>
                </Box>
            </Box>

            {/* Right Side - Form */}
            <Box
                component={motion.div}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                sx={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 4,
                }}
            >
                <Container maxWidth="xs">
                    <Typography component="h1" variant="h5" fontWeight="bold" mb={3} textAlign="center">
                        Sign In
                    </Typography>

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            autoComplete="username"
                            autoFocus
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: 4 } }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ mb: 3, "& .MuiOutlinedInput-root": { borderRadius: 4 } }}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{
                                mt: 1,
                                mb: 2,
                                bgcolor: "#12C998",
                                color: "white",
                                py: 1.5,
                                borderRadius: 4,
                                fontWeight: "bold",
                                "&:hover": { bgcolor: "#0ea880" }
                            }}
                        >
                            Sign In
                        </Button>

                        <Divider sx={{ my: 2 }}>OR</Divider>

                        <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<Google />}
                            onClick={handleGoogleSignIn}
                            sx={{
                                mb: 2,
                                py: 1.5,
                                borderRadius: 4,
                                borderColor: "#ddd",
                                color: "text.primary",
                                "&:hover": { borderColor: "#bbb", bgcolor: "rgba(0,0,0,0.02)" }
                            }}
                        >
                            Sign in with Google
                        </Button>

                        <Box mt={2} textAlign="center">
                            <Typography variant="body2">
                                Don't have an account?{" "}
                                <Link href="/sign-up" style={{ color: "#12C998", textDecoration: "none", fontWeight: "bold" }}>
                                    Sign Up
                                </Link>
                            </Typography>
                        </Box>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
}
