"use client";

import React, { useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Alert,
  Divider,
  IconButton,
  InputAdornment,
} from "@mui/material";
import Link from "next/link";
import { Google, Visibility, VisibilityOff } from "@mui/icons-material";
import { motion } from "framer-motion";

export default function SignUpComponent() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [code, setCode] = useState("");

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submit clicked. isLoaded:", isLoaded, "isLoading:", isLoading);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!isLoaded || !signUp || isLoading) return;
    setIsLoading(true);

    try {
      console.log("Calling signUp.create with:", { username, email, password: "***" });
      const response = await signUp.create({
        username,
        emailAddress: email || undefined,
        password,
      });
      console.log("signUp.create response status:", response.status);

      if (response.status === "complete") {
        await setActive({ session: response.createdSessionId });
        router.push("/user/setup");
      } else if (response.status === "missing_requirements") {
        console.log("Status is missing_requirements. Preparation for email verification...");
        await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
        setVerifying(true);
      } else {
        console.warn("SignUp not complete. Status:", signUp.status, "Missing fields:", signUp.unverifiedFields);
        setError(`Registration Incomplete: ${signUp.status}. Please check verification requirements.`);
      }
    } catch (err: any) {
      console.error("Full signup error object:", err);
      const msg = err.errors?.[0]?.longMessage || err.message || "An unknown error occurred during signup";
      console.error("Signup error message:", msg);
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!isLoaded || !signUp || isLoading) return;
    setIsLoading(true);

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });
      console.log("Verification result:", completeSignUp.status);
      if (completeSignUp.status !== "complete") {
        console.warn("Verification level status:", completeSignUp.status);
        setError("Verification successful, but registration still incomplete.");
      } else {
        await setActive({ session: completeSignUp.createdSessionId });
        router.push("/user/setup");
      }
    } catch (err: any) {
      console.error("Verification error:", err);
      setError(err.errors?.[0]?.longMessage || "An error occurred during verification");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    if (!isLoaded || !signUp || isLoading) return;
    setIsLoading(true);
    try {
      await signUp.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/user/setup",
      });
    } catch (err: any) {
      console.error("Google sign up error", err);
      setError("Failed to sign up with Google");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Left Side - Form */}
      <Box
        component={motion.div}
        initial={{ opacity: 0, x: -50 }}
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
          <Typography
            component="h1"
            variant="h5"
            fontWeight="bold"
            mb={3}
            textAlign="center"
          >
            {verifying ? "Verify Your Email" : "Create Account"}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {!verifying ? (
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
                fullWidth
                id="email"
                label="Email Address (Optional)"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                autoComplete="new-password"
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
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
                disabled={isLoading}
                sx={{
                  mt: 1,
                  mb: 2,
                  bgcolor: "#12C998",
                  color: "white",
                  py: 1.5,
                  borderRadius: 4,
                  fontWeight: "bold",
                  "&:hover": { bgcolor: "#0ea880" },
                }}
              >
                {isLoading ? "Working..." : "Sign Up"}
              </Button>

              <div id="clerk-captcha"></div>

              <Divider sx={{ my: 2 }}>OR</Divider>

              <Button
                fullWidth
                variant="outlined"
                disabled={isLoading}
                startIcon={<Google />}
                onClick={handleGoogleSignUp}
                sx={{
                  mb: 2,
                  py: 1.5,
                  borderRadius: 4,
                  borderColor: "#ddd",
                  color: "text.primary",
                  "&:hover": { borderColor: "#bbb", bgcolor: "rgba(0,0,0,0.02)" },
                }}
              >
                {isLoading ? "Working..." : "Sign up with Google"}
              </Button>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleVerify} noValidate>
              <Typography variant="body2" color="text.secondary" mb={2} textAlign="center">
                We've sent a verification code to <strong>{email}</strong>. Please enter it below.
              </Typography>
              <TextField
                margin="normal"
                required
                fullWidth
                id="code"
                label="Verification Code"
                name="code"
                autoFocus
                value={code}
                onChange={(e) => setCode(e.target.value)}
                sx={{ mb: 3, "& .MuiOutlinedInput-root": { borderRadius: 4 } }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isLoading}
                sx={{
                  mt: 1,
                  mb: 2,
                  bgcolor: "#12C998",
                  color: "white",
                  py: 1.5,
                  borderRadius: 4,
                  fontWeight: "bold",
                  "&:hover": { bgcolor: "#0ea880" },
                }}
              >
                {isLoading ? "Verifying..." : "Verify Code"}
              </Button>
            </Box>
          )}

          <Box mt={2} textAlign="center">
            <Typography variant="body2">
              Already have an account?{" "}
              <Link
                href="/sign-in"
                style={{
                  color: "#12C998",
                  textDecoration: "none",
                  fontWeight: "bold",
                }}
              >
                Sign In
              </Link>
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Right Side - Image (Visible on md and up) */}
      <Box
        component={motion.div}
        initial={{ opacity: 0, x: 50 }}
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
          <Typography
            variant="h3"
            fontWeight="bold"
            color="white"
            fontFamily="var(--font-syncopate)"
          >
            Join O-Kard
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
