"use client";

import { SignedIn, SignedOut, UserButton, useClerk } from "@clerk/nextjs";
import NextLink from "next/link";
import {
  AppBar,
  Typography,
  Container,
  InputBase,
  Box,
  Button,
  Grid,
} from "@mui/material";

import NotificationComponent from "@/modules/notification/NotificationComponent";

export default function ClientNavbar({ isHome = false }: { isHome?: boolean }) {
  const { openSignIn, openSignUp } = useClerk();

  return (
    <AppBar
      position="absolute"
      elevation={0}
      sx={{
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        backgroundColor: isHome ? "transparent" : "white",
        backdropFilter: isHome ? "none" : "none",
        WebkitBackdropFilter: isHome ? "none" : "none",
        color: isHome ? "white" : "black",
        boxShadow: "none",
        transition: "all 0.3s ease",
      }}
    >
      <Container maxWidth="xl">
        <Grid container>
          <Grid
            size={{ xs: 12, md: 1 }}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <Typography
              component={NextLink}
              href="/"
              variant="h6"
              fontWeight="bold"
              color="black"
              sx={{ textDecoration: "none" }}
            >
              🌞 kard
            </Typography>
          </Grid>

          <Grid
            size={{ xs: 12, md: 8 }}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            <Button
              component={NextLink}
              href="/post"
              color="inherit"
              sx={{ color: "black" }}
            >
              Explore
            </Button>
            <Button
              component={NextLink}
              href="/about"
              color="inherit"
              sx={{ color: "black" }}
            >
              About Us
            </Button>
            <InputBase
              placeholder="searching..."
              sx={{
                backgroundColor: "white",
                px: 1,
                borderRadius: 1,
                fontSize: 14,
                height: 36,
                minWidth: 120,
              }}
            />
          </Grid>

          <Grid
            size={{ xs: 12, md: 3 }}
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Button
              component={NextLink}
              href="/post/create"
              variant="contained"
              color="success"
              size="small"
            >
              START A CAMPAIGN
            </Button>

            <SignedIn>
              <NotificationComponent />
            </SignedIn>

            <SignedOut>
              <Box display="flex" gap={1}>
                <Button
                  variant="text"
                  sx={{ color: "black" }}
                  onClick={() => openSignIn({})}
                >
                  Login
                </Button>
                <Button
                  variant="text"
                  sx={{ color: "white" }}
                  onClick={() => openSignUp({})}
                >
                  Sign Up
                </Button>
              </Box>
            </SignedOut>

            <SignedIn>
              <UserButton userProfileMode="navigation" userProfileUrl="/user" />
            </SignedIn>
          </Grid>
        </Grid>
      </Container>
    </AppBar>
  );
}
