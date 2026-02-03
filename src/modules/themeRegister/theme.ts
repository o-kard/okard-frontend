"use client";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#12C998",
    },
    secondary: {
      main: "#F472B6",
    },
    background: {
      default: "#ffffff",
    },
    text: {
      primary: "#222222",
      secondary: "#666666",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
  },
});

export default theme;
