"use client";

import { useState, useEffect, useRef } from "react";
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
  Chip,
  Card,
  CardContent,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

//icon
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ExploreIcon from "@mui/icons-material/Explore";
import InfoIcon from "@mui/icons-material/Info";
import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";
import CampaignIcon from "@mui/icons-material/Campaign";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

import dynamic from "next/dynamic";
import SearchBar from "./SearchBar";
import { usePathname } from "next/navigation";

import { getAllCampaigns } from "./api/api";
import { getUser } from "../user/api/api";
import { Campaign } from "../campaign/types/campaign";
import { CATEGORIES_LIST } from "../home/utils/categoryColors";
import { useUser, useAuth } from "@clerk/nextjs";
import CustomUserButton from "./CustomUserButton";

const NotificationComponent = dynamic(
  () => import("@/modules/notification/NotificationComponent"),
  { ssr: false },
);

export default function ClientNavbar({ isHome = false }: { isHome?: boolean }) {
  const { openSignIn, openSignUp, signOut } = useClerk();

  const [isHovered, setIsHovered] = useState(false);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Extract user role
  const { user } = useUser();
  const { getToken } = useAuth();
  const [userRole, setUserRole] = useState<string>("");

  useEffect(() => {
    async function fetchRole() {
      if (user?.id) {
        try {
          const token = await getToken();
          if (token) {
            const dbUser = await getUser(token);
            if (dbUser && dbUser.role) {
              setUserRole(dbUser.role);
            }
          }
        } catch (err) {
          console.error("Failed to fetch user role:", err);
        }
      } else {
        setUserRole("");
      }
    }
    fetchRole();
  }, [user?.id, getToken]);

  const [popularCampaigns, setPopularCampaigns] = useState<Campaign[]>([]);

  const pathname = usePathname();

  const [lastMoveTime, setLastMoveTime] = useState(Date.now());

  const menuBtnRef = useRef<HTMLButtonElement | null>(null);

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  useEffect(() => {
    if (isDesktop && mobileOpen) {
      setMobileOpen(false);
    }
  }, [isDesktop, mobileOpen]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  useEffect(() => {
    const updateMoveTime = () => setLastMoveTime(Date.now());
    window.addEventListener("mousemove", updateMoveTime);
    return () => window.removeEventListener("mousemove", updateMoveTime);
  }, []);

  useEffect(() => {
    if (!isHovered) return;

    const interval = setInterval(() => {
      if (Date.now() - lastMoveTime > 5000) {
        setIsHovered(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isHovered, lastMoveTime]);

  useEffect(() => {
    setIsHovered(false);
    setMobileOpen(false);
    setIsSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    async function load() {
      try {
        const data = await getAllCampaigns();
        setPopularCampaigns(data.slice(0, 2));
      } catch (err) {
        console.error("Failed to load campaigns:", err);
      }
    }
    load();
  }, []);

  const categoryList = CATEGORIES_LIST;
  const drawerContent = (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#fff",
        p: 2,
      }}
      role="presentation"
    >
      {/* 1. Header Section */}
      <Box sx={{ mb: 4, mt: 2, textAlign: "center" }}>
        <SignedIn>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Box sx={{ mb: 1 }}>
              <CustomUserButton size={64} />
            </Box>
            <Typography variant="h6" fontWeight="bold">
              {"WELCOME BACK !"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.username ? `@${user.username}` : ""}
            </Typography>
          </Box>
        </SignedIn>

        <SignedOut>
          <Box sx={{ px: 2, textAlign: "center" }}>
            <Typography
              variant="h4"
              fontWeight={800}
              sx={{
                color: "#12C998",
                mb: 1,
                fontFamily: "var(--font-syncopate)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1.5,
              }}
            >
              <img src="/Logo_sun.svg" alt="Logo" width="56" height="56" />
              kard
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Join the community of creators and supporters.
            </Typography>
            <Divider sx={{ mt: 2 }} />
          </Box>
        </SignedOut>
      </Box>

      {/* Mobile Search */}
      <Box px={1} mb={2}>
        <SearchBar
          isHome={isHome}
          closeSidebar={() => setMobileOpen(false)}
          isOpen={mobileOpen}
        />
      </Box>

      {/* 2. Menu Links */}
      <List sx={{ px: 1 }}>
        {[
          { text: "Explore", href: "/campaign", icon: <ExploreIcon /> },
          { text: "Creators", href: "/explore-user", icon: <PersonIcon /> },
          { text: "About Us", href: "/about", icon: <InfoIcon /> },
        ].map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              component={NextLink}
              href={item.href}
              onClick={() => {
                setMobileOpen(false);
                setTimeout(() => menuBtnRef.current?.blur(), 30);
              }}
              sx={{
                borderRadius: 2,
                py: 1.5,
                color: "#444",
                "&:hover": {
                  backgroundColor: "rgba(18, 201, 152, 0.1)",
                  color: "#12C998",
                },
              }}
            >
              <Box sx={{ mr: 2, color: "inherit", display: "flex" }}>
                {item.icon}
              </Box>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontFamily: "var(--font-montserrat)",
                  fontWeight: 600,
                  fontSize: "1rem",
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* 3. Bottom Actions (Sticky) */}
      <Box mt="auto" display="flex" flexDirection="column" gap={2} pb={2}>
        {userRole === "creator" && (
          <Button
            component={NextLink}
            href="/campaign/create"
            variant="contained"
            onClick={() => setMobileOpen(false)}
            startIcon={<CampaignIcon />}
            sx={{
              borderRadius: 3,
              py: 1.5,
              background: "linear-gradient(45deg, #12c998 30%, #f070a1 90%)",
              boxShadow: "0 4px 14px rgba(18, 201, 152, 0.4)",
              fontWeight: 800,
              textTransform: "none",
              fontSize: "1rem",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 6px 20px rgba(18, 201, 152, 0.5)",
                opacity: 0.9,
              },
            }}
            fullWidth
          >
            START A CAMPAIGN
          </Button>
        )}

        {userRole === "admin" && (
          <Button
            component={NextLink}
            href="/admin"
            variant="contained"
            onClick={() => setMobileOpen(false)}
            startIcon={<AdminPanelSettingsIcon />}
            sx={{
              borderRadius: 3,
              py: 1.5,
              background: "linear-gradient(45deg, #12c998 30%, #f070a1 90%)",
              boxShadow: "0 4px 14px rgba(18, 201, 152, 0.4)",
              fontWeight: 800,
              textTransform: "none",
              fontSize: "1rem",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 6px 20px rgba(18, 201, 152, 0.5)",
                opacity: 0.9,
              },
            }}
            fullWidth
          >
            ADMIN PANEL
          </Button>
        )}

        <SignedIn>
          <Button
            variant="outlined"
            color="error"
            fullWidth
            sx={{ borderRadius: 3, py: 1.25, fontWeight: "bold" }}
            onClick={() => {
              signOut();
              setMobileOpen(false);
            }}
          >
            Sign Out
          </Button>
        </SignedIn>

        <SignedOut>
          <Box display="flex" gap={2}>
            <Button
              component={NextLink}
              href="/sign-in"
              variant="outlined"
              color="inherit"
              fullWidth
              sx={{ borderRadius: 3, py: 1.25, borderColor: "#ddd" }}
              onClick={() => setMobileOpen(false)}
            >
              Login
            </Button>
            <Button
              component={NextLink}
              href="/sign-up"
              variant="contained"
              fullWidth
              sx={{
                borderRadius: 3,
                bgcolor: "black",
                color: "white",
                py: 1.25,
                fontWeight: "bold",
              }}
              onClick={() => setMobileOpen(false)}
            >
              Sign Up
            </Button>
          </Box>
        </SignedOut>
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar
        position="absolute"
        elevation={0}
        onMouseEnter={() => {
          if (!isSearchOpen) {
            setIsHovered(true);
            setLastMoveTime(Date.now());
          }
        }}
        onMouseLeave={() => {
          setIsHovered(false);
        }}
        sx={{
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          backgroundColor: {
            xs: isHome ? "transparent" : "white",
            md: isHome && !isHovered ? "transparent" : "white",
          },
          backdropFilter: isHome ? "blur(12px)" : "none",
          WebkitBackdropFilter: isHome ? "none" : "none",
          boxShadow: isHovered
            ? "0 15px 40px rgba(0, 0, 0, 0.1)"
            : isHome
              ? "0 5px 50px rgba(0, 0, 0, 0.2)"
              : "none",
          transition: "all 0.3s ease",
          height: {
            xs: "64px",
            md: "70px",
            lg: "70px",
          },
          paddingBottom: isHovered ? { md: 0.5 } : 0,
          overflow: "visible",
          borderRadius: {
            xs: "none",
            // md: isHovered ? "0 0 24px 24px" : "none"
          },
        }}
      >
        <Container maxWidth={false}>
          {/* ======================================================== */}
          {/* 📱 MOBILE VIEW (แสดงเฉพาะ xs, sm) */}
          {/* ======================================================== */}
          <Grid
            container
            alignItems="center"
            justifyContent="space-between"
            sx={{ height: "64px", display: { xs: "flex", md: "none" } }}
          >
            <IconButton
              ref={menuBtnRef}
              onClick={handleDrawerToggle}
              edge="start"
              sx={{ color: "#12C998" }}
            >
              <MenuIcon sx={{ fontSize: 28 }} />
            </IconButton>
            <Typography
              component={NextLink}
              href="/"
              variant="h6"
              sx={{
                textDecoration: "none",
                fontFamily: "var(--font-syncopate)",
                fontSize: "2rem",
                fontWeight: "bold",
                color: "#12C998",
                whiteSpace: "nowrap",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              <img
                src="/Logo_sun.svg"
                alt="Logo"
                width="40"
                height="40"
                style={{ marginRight: "8px" }}
              />
              kard
            </Typography>
            <Box>
              <SignedIn>
                <CustomUserButton />
              </SignedIn>
              <SignedOut>
                <Button
                  variant="outlined"
                  component={NextLink}
                  href="/sign-in"
                  sx={{
                    borderRadius: 2,
                    borderColor: "white",
                    color: "white",
                    fontWeight: "600",
                    border: 2,
                    "&:hover": {
                      backgroundColor: "white",
                      color: "black",
                      borderColor: "white",
                      borderWidth: 2,
                    },
                  }}
                  onClick={() => setMobileOpen(false)}
                >
                  Login
                </Button>
              </SignedOut>
            </Box>
          </Grid>

          {/* ======================================================== */}
          {/* 💻 DESKTOP VIEW (แสดงเฉพาะ md ขึ้นไป) - โค้ดเดิมของคุณ */}
          {/* ======================================================== */}
          <Box sx={{ display: { xs: "none", md: "block" }, height: "100%" }}>
            <Grid container alignItems="center" sx={{ height: "70px" }}>
              <Grid
                size={{ xs: 4, md: 3 }}
                sx={{
                  display: "flex",
                  justifyContent: {
                    xs: "center",
                    md: "flex-start",
                    lg: "flex-start",
                  },
                  alignItems: "center",
                  pl: { md: 2, lg: 0 },
                }}
              >
                <Typography
                  component={NextLink}
                  href="/"
                  variant="h6"
                  sx={{
                    textDecoration: "none",
                    fontFamily: "var(--font-syncopate)",
                    fontSize: { xs: "1.5rem", md: "1.5rem", lg: "2rem" },
                    fontWeight: "bold",
                    color: "#12C998",
                    whiteSpace: "nowrap",
                    display: "inline-flex",
                    alignItems: "center",
                  }}
                >
                  <img
                    src="/Logo_sun.svg"
                    alt="Logo"
                    width="40"
                    height="40"
                    style={{ marginRight: "8px" }}
                  />
                  <Box
                    component="span"
                    sx={{ display: { xs: "none", md: "inline", lg: "inline" } }}
                  >
                    kard
                  </Box>
                </Typography>
              </Grid>

              <Grid
                size={{ xs: 4, md: 6 }}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: { xs: 2, md: 2, lg: 4 },
                }}
              >
                <IconButton
                  sx={{
                    backgroundColor: isSearchOpen
                      ? "rgba(0, 0, 0, 0.1)"
                      : "transparent",
                    backdropFilter: isSearchOpen ? "blur(4px)" : "none",
                  }}
                  onClick={() => {
                    setIsSearchOpen(!isSearchOpen);
                    if (!isSearchOpen) setIsHovered(false);
                  }}
                >
                  <SearchIcon
                    sx={{
                      color: isHome ? (isHovered ? "black" : "white") : "black",
                    }}
                  />
                </IconButton>
                <Button
                  component={NextLink}
                  href="/campaign"
                  sx={{
                    color: isHovered ? "black" : isHome ? "white" : "black",
                    fontFamily: "var(--font-montserrat)",
                    fontSize: { xs: "1rem", md: "1rem", lg: "1.2rem" },
                    textTransform: "none",
                    whiteSpace: "nowrap",
                    "&:hover": {
                      border: "none",
                      color: "#12C998",
                      backgroundColor: "transparent",
                    },
                  }}
                >
                  Explore
                </Button>
                <Button
                  component={NextLink}
                  href="/explore-user"
                  sx={{
                    color: isHovered ? "black" : isHome ? "white" : "black",
                    fontFamily: "var(--font-montserrat)",
                    fontSize: { xs: "1rem", md: "1rem", lg: "1.2rem" },
                    textTransform: "none",
                    whiteSpace: "nowrap",
                    "&:hover": {
                      border: "none",
                      color: "#12C998",
                      backgroundColor: "transparent",
                    },
                  }}
                >
                  Creators
                </Button>
                <Button
                  component={NextLink}
                  href="/about"
                  sx={{
                    color: isHovered ? "black" : isHome ? "white" : "black",
                    fontFamily: "var(--font-montserrat)",
                    fontSize: { xs: "1rem", md: "1rem", lg: "1.2rem" },
                    textTransform: "none",
                    whiteSpace: "nowrap",
                    "&:hover": {
                      border: "none",
                      color: "#12C998",
                      backgroundColor: "transparent",
                    },
                  }}
                >
                  About Us
                </Button>
              </Grid>

              <Grid
                size={{ xs: 4, md: 3 }}
                sx={{
                  display: "flex",
                  justifyContent: {
                    xs: "center",
                    md: "flex-end",
                    lg: "flex-end",
                  },
                  alignItems: "center",
                  gap: { xs: 2, md: 2, lg: 2 },
                }}
              >
                {userRole === "creator" && (
                  <Button
                    component={NextLink}
                    href="/campaign/create"
                    variant="contained"
                    size="small"
                    startIcon={
                      <AddIcon
                        sx={{
                          "@media (min-width: 1351px)": {
                            display: "none",
                          },
                        }}
                      />
                    }
                    sx={{
                      borderRadius: 3,
                      whiteSpace: "nowrap",
                      px: { md: 1.5, lg: 3 },
                      py: { md: 0.8, lg: 1 },
                      background:
                        "linear-gradient(45deg, #12c998 30%, #0fb488 90%)",
                      boxShadow: "0 4px 10px rgba(18, 201, 152, 0.3)",
                      transition: "all 0.3s ease",
                      textTransform: "none",
                      minWidth: "auto",
                      "&:hover": {
                        transform: "scale(1.05)",
                        boxShadow: "0 6px 15px rgba(18, 201, 152, 0.4)",
                        background:
                          "linear-gradient(45deg, #12c998 10%, #f070a1 90%)",
                      },
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: "var(--font-montserrat)",
                        fontSize: { md: "0.8rem", lg: "1rem" },
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Box
                        component="span"
                        sx={{
                          display: {
                            md: "none",
                            lg: "none",
                          },
                          "@media (min-width: 1351px)": {
                            display: "inline",
                          },
                        }}
                      >
                        START A&nbsp;
                      </Box>
                      CAMPAIGN
                    </Typography>
                  </Button>
                )}

                {userRole === "admin" && (
                  <Button
                    component={NextLink}
                    href="/admin"
                    variant="contained"
                    size="small"
                    startIcon={
                      <AdminPanelSettingsIcon
                        sx={{
                          "@media (min-width: 1351px)": {
                            display: "none",
                          },
                        }}
                      />
                    }
                    sx={{
                      borderRadius: 3,
                      whiteSpace: "nowrap",
                      px: { md: 1.5, lg: 3 },
                      py: { md: 0.8, lg: 1 },
                      background:
                        "linear-gradient(45deg, #12c998 30%, #0fb488 90%)",
                      boxShadow: "0 4px 10px rgba(18, 201, 152, 0.3)",
                      transition: "all 0.3s ease",
                      textTransform: "none",
                      minWidth: "auto",
                      "&:hover": {
                        transform: "scale(1.05)",
                        boxShadow: "0 6px 15px rgba(18, 201, 152, 0.4)",
                        background:
                          "linear-gradient(45deg, #12c998 10%, #f070a1 90%)",
                      },
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: "var(--font-montserrat)",
                        fontSize: { md: "0.8rem", lg: "1rem" },
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Box
                        component="span"
                        sx={{
                          display: {
                            md: "none",
                            lg: "none",
                          },
                          "@media (min-width: 1351px)": {
                            display: "inline",
                          },
                        }}
                      >
                        ADMIN&nbsp;
                      </Box>
                      PANEL
                    </Typography>
                  </Button>
                )}

                <SignedIn>
                  <NotificationComponent
                    isHome={isHome}
                    isHovered={isHovered}
                  />
                </SignedIn>

                <SignedOut>
                  <Box display="flex" gap={2}>
                    <Button
                      component={NextLink}
                      href="/sign-in"
                      variant="text"
                      sx={{
                        color: isHovered ? "black" : isHome ? "white" : "black",
                        fontFamily: "var(--font-montserrat)",
                        fontSize: { xs: "1rem", md: "0.9rem", lg: "1.2rem" },
                        textTransform: "none",
                        whiteSpace: "nowrap",
                        "&:hover": {
                          border: "none",
                          color: "#12C998",
                          backgroundColor: "transparent",
                        },
                      }}
                      onClick={() => setMobileOpen(false)}
                    >
                      Login
                    </Button>
                    <Button
                      component={NextLink}
                      href="/sign-up"
                      sx={{
                        color: isHovered ? "black" : isHome ? "white" : "black",
                        fontFamily: "var(--font-montserrat)",
                        fontSize: { xs: "1rem", md: "0.9rem", lg: "1.2rem" },
                        textTransform: "none",
                        whiteSpace: "nowrap",
                        "&:hover": {
                          border: "none",
                          color: "#12C998",
                          backgroundColor: "transparent",
                        },
                      }}
                      onClick={() => setMobileOpen(false)}
                    >
                      Sign Up
                    </Button>
                  </Box>
                </SignedOut>

                <SignedIn>
                  <CustomUserButton />
                </SignedIn>
              </Grid>
            </Grid>

            {/* Floating Search Bar */}
            {isSearchOpen && (
              <Box
                sx={{
                  position: "absolute",
                  top: "100%", // Just below Navbar
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "600px", // Fixed width as requested "large"
                  maxWidth: "90vw",
                  zIndex: 1200,
                  pointerEvents: "auto", // Ensure interactivity
                  bgcolor: "transparent", // No full width bg
                  mt: 2, // Slight gap from navbar
                  boxShadow: "0 10px 40px rgba(0,0,0,0.1)", // Shadow on the bar container itself
                  borderRadius: 4,
                }}
              >
                <SearchBar
                  isHome={isHome}
                  closeMegaMenu={() => setIsSearchOpen(false)}
                />
              </Box>
            )}

            {/* ================= MEGA MENU CONTENT (Desktop Only) ================= */}
            <Box
              onMouseEnter={() => {
                setIsHovered(true);
                setLastMoveTime(Date.now());
              }}
              onMouseLeave={() => {
                setIsHovered(false);
              }}
              sx={{
                position: "absolute",
                top: "100%",
                left: 0,
                width: "100%",
                zIndex: 1100,
                transition: `opacity 0.3s ease, transform 0.3s ease, visibility 0s linear ${isHovered ? "0s" : "0.3s"}`,
                px: 8,
                pb: 4,
                pt: 2,
                color: "black",
                opacity: isHovered ? 1 : 0,
                pointerEvents: isHovered ? "auto" : "none",
                visibility: isHovered ? "visible" : "hidden",
                bgcolor: "white",
                borderRadius: "0 0 24px 24px",
                boxShadow: "0 15px 40px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Box
                sx={{
                  transition: "opacity 0.3s ease 0.1s, transform 0.3s ease",
                  px: 8,
                  color: "black",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 2,
                    mb: 4,
                    pb: 3,
                    justifyContent: "center",
                    borderBottom: "2px solid rgba(0,0,0,0.05)",
                  }}
                >
                  {categoryList.map((item) => (
                    <Chip
                      key={item.label}
                      icon={<item.icon sx={{ fontSize: 18 }} />}
                      component={NextLink}
                      href={`/campaign?category=${encodeURIComponent(item.value)}`}
                      label={item.label}
                      clickable
                      sx={{
                        bgcolor: "#F472B6",
                        color: "black",
                        fontWeight: "bold",
                        "& .MuiChip-icon": { color: "black" },
                        "&:hover": { bgcolor: "#ec4899" },
                      }}
                    />
                  ))}
                </Box>

                <Grid container spacing={4}>
                  <Grid
                    size={{ xs: 12, sm: 12, md: 4, lg: 4 }}
                    sx={{ borderRight: "2px solid #eee", mb: { xs: 3, md: 0 } }}
                  >
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      fontWeight="bold"
                      mb={2}
                      sx={{
                        fontFamily: "var(--font-montserrat)",
                        fontSize: "1.2rem",
                      }}
                    >
                      QUICK FILTER
                    </Typography>
                    <Box display="flex" flexDirection="column" gap={1.5}>
                      {[
                        { text: "All Campaigns", href: "/campaign" },
                        {
                          text: "Technology",
                          href: "/campaign?category=technology",
                        },
                        { text: "Just Launched", href: "/campaign?sort=newest" },
                        { text: "Ending Soon", href: "/campaign?sort=ending_soon" },
                        { text: "Latest Update", href: "/campaign?sort=updated" },
                      ].map((item) => (
                        <Typography
                          key={item.text}
                          component={NextLink}
                          href={item.href}
                          color="text.secondary"
                          sx={{
                            textDecoration: "none",
                            cursor: "pointer",
                            "&:hover": { color: "#12C998" },
                            fontSize: "0.95rem",
                          }}
                        >
                          {item.text}
                        </Typography>
                      ))}
                    </Box>
                  </Grid>

                  <Grid size={{ md: 4, lg: 4 }}>
                    <Card
                      component={NextLink}
                      href={
                        popularCampaigns[0]
                          ? `/campaign/show/${popularCampaigns[0].id}`
                          : "#"
                      }
                      sx={{
                        height: "100%",
                        borderRadius: 2,
                        color: "white",
                        position: "relative",
                        overflow: "hidden",
                        backgroundImage: `
                        linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.4), transparent),
                        url('${process.env.NEXT_PUBLIC_API_URL}${popularCampaigns[0]?.images?.[0]?.path || ""}')
                      `,
                        backgroundSize: "cover",
                        backgroundPosition: "center center",
                        display: { xs: "none", md: "flex" },
                        flexDirection: "column",
                        justifyContent: "flex-end",
                        textDecoration: "none",
                      }}
                    >
                      <CardContent sx={{ p: 2 }}>
                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          gutterBottom
                          sx={{
                            fontSize: "1rem",
                            fontFamily: "var(--font-montserrat)",
                          }}
                        >
                          Now Popular
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            opacity: 0.9,
                            mb: 2,
                            fontWeight: "medium",
                            fontSize: "1rem",
                            fontFamily: "var(--font-montserrat)",
                          }}
                        >
                          {popularCampaigns[0] ? popularCampaigns[0].campaign_header : "#"}
                        </Typography>
                        <Box
                          display="flex"
                          alignItems="center"
                          gap={1.5}
                          mt={2}
                        >
                          <div
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: "50%",
                              backgroundImage: `url('${process.env.NEXT_PUBLIC_API_URL}${
                                popularCampaigns[0]?.user?.media?.path ?? ""
                              }')`,
                              backgroundSize: "cover",
                            }}
                          ></div>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {popularCampaigns[0]
                              ? popularCampaigns[0].user.username
                              : "#"}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid size={{ md: 4, lg: 4 }}>
                    <Card
                      component={NextLink}
                      href={
                        popularCampaigns[1]
                          ? `/campaign/show/${popularCampaigns[1].id}`
                          : "#"
                      }
                      sx={{
                        display: {
                          xs: "none",
                          md: "flex",
                          lg: "flex",
                        },
                        height: "100%",
                        borderRadius: 2,
                        color: "white",
                        position: "relative",
                        overflow: "hidden",
                        backgroundImage: `
                        linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.4), transparent),
                        url('${process.env.NEXT_PUBLIC_API_URL}${popularCampaigns[1]?.images?.[0]?.path || ""}')
                      `,
                        backgroundSize: "cover",
                        backgroundPosition: "center center",
                        flexDirection: "column",
                        justifyContent: "flex-end",
                        textDecoration: "none",
                      }}
                    >
                      <CardContent sx={{ p: 2 }}>
                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          gutterBottom
                          sx={{
                            fontSize: "1rem",
                            fontFamily: "var(--font-montserrat)",
                          }}
                        >
                          Now Popular
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            opacity: 0.9,
                            mb: 2,
                            fontWeight: "medium",
                            fontSize: "1rem",
                            fontFamily: "var(--font-montserrat)",
                          }}
                        >
                          {popularCampaigns[1] ? popularCampaigns[1].campaign_header : "#"}
                        </Typography>
                        <Box
                          display="flex"
                          alignItems="center"
                          gap={1.5}
                          mt={2}
                        >
                          <div
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: "50%",
                              backgroundImage: `url('${process.env.NEXT_PUBLIC_API_URL}${
                                popularCampaigns[1]?.user?.media?.path ?? ""
                              }')`,
                              backgroundSize: "cover",
                            }}
                          ></div>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {popularCampaigns[1]
                              ? popularCampaigns[1].user.username
                              : "#"}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Box>
        </Container>
      </AppBar>

      {/*DRAWER COMPONENT (Mobile Slide Menu) */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: false }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 300 },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
}
