"use client";
import React from "react";
import { Box, CircularProgress, Typography, useTheme } from "@mui/material";

type LoadingScreenProps = {
  message?: string;
};

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = "Loading...",
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100%",
        backgroundColor: theme.palette.background.default,
        zIndex: 9999,
        position: "fixed",
        top: 0,
        left: 0,
      }}
    >
      <Box sx={{ position: "relative", display: "inline-flex" }}>
        <CircularProgress
          size={80}
          thickness={4}
          sx={{
            color: theme.palette.primary.main,
            "& .MuiCircularProgress-circle": {
              strokeLinecap: "round",
            },
          }}
        />
      </Box>
      <Typography
        variant="h6"
        sx={{
          marginTop: 4,
          fontWeight: 600,
          color: theme.palette.text.secondary,
          letterSpacing: "0.05em",
          animation: "pulse 1.5s infinite ease-in-out",
          "@keyframes pulse": {
            "0%": { opacity: 0.6 },
            "50%": { opacity: 1 },
            "100%": { opacity: 0.6 },
          },
        }}
      >
        {message}
      </Typography>
    </Box>
  );
};

export default LoadingScreen;
