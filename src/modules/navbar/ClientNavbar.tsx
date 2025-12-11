"use client";

import { useState, useEffect, useRef  } from "react";
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
} from "@mui/material";

//icon
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import PaletteIcon from '@mui/icons-material/Palette';          
import AutoStoriesIcon from '@mui/icons-material/AutoStories';  
import ContentCutIcon from '@mui/icons-material/ContentCut';   
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement'; 
import DesignServicesIcon from '@mui/icons-material/DesignServices'; 
import CheckroomIcon from '@mui/icons-material/Checkroom';     
import MovieIcon from '@mui/icons-material/Movie';             
import RestaurantIcon from '@mui/icons-material/Restaurant';    
import SportsEsportsIcon from '@mui/icons-material/SportsEsports'; 
import NewspaperIcon from '@mui/icons-material/Newspaper';      
import MusicNoteIcon from '@mui/icons-material/MusicNote';      
import CameraAltIcon from '@mui/icons-material/CameraAlt';      
import ComputerIcon from '@mui/icons-material/Computer';        
import TheaterComedyIcon from '@mui/icons-material/TheaterComedy'; 

import dynamic from "next/dynamic";
import SearchBar from "./SearchBar";
import { usePathname } from "next/navigation";

import { getAllPosts } from "./api/api";
import { Post } from "../post/types/post";

const NotificationComponent = dynamic(
  () => import("@/modules/notification/NotificationComponent"),
  { ssr: false }
);



export default function ClientNavbar({ isHome = false }: { isHome?: boolean }) {
  const { openSignIn, openSignUp } = useClerk();

  const [isHovered, setIsHovered] = useState(false);
  
  const [mobileOpen, setMobileOpen] = useState(false);

  const [popularPosts, setPopularPosts] = useState<Post[]>([])

  const pathname = usePathname();

  const [lastMoveTime, setLastMoveTime] = useState(Date.now());

  const menuBtnRef = useRef<HTMLButtonElement | null>(null);

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
    async function load() {
      try {
        const data = await getAllPosts();
        setPopularPosts(data.slice(0, 2)); 
      } catch (err) {
        console.error("Failed to load posts:", err);
      }
    }
    load();
  }, []);

  const categoryList = [
    { label: "Art", icon: PaletteIcon },
    { label: "Comics", icon: AutoStoriesIcon },
    { label: "Crafts", icon: ContentCutIcon },
    { label: "Dance", icon: SelfImprovementIcon },
    { label: "Design", icon: DesignServicesIcon },
    { label: "Fashion", icon: CheckroomIcon },
    { label: "Film & Video", icon: MovieIcon },
    { label: "Food", icon: RestaurantIcon },
    { label: "Games", icon: SportsEsportsIcon },
    { label: "Journalism", icon: NewspaperIcon },
    { label: "Music", icon: MusicNoteIcon },
    { label: "Photography", icon: CameraAltIcon },
    { label: "Publishing", icon: AutoStoriesIcon },
    { label: "Technology", icon: ComputerIcon },
    { label: "Theater", icon: TheaterComedyIcon },
  ];
  
// --- ส่วนเนื้อหาใน Sidebar (Mobile Drawer) ---
  const drawerContent = (
    <Box sx={{ width: 300, p: 2, height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header ของ Sidebar */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography
          variant="h6"
          sx={{
            fontFamily: "var(--font-syncopate)",
            fontWeight: "bold",
            fontSize: "1.2rem",
            color: "#12C998",
          }}
        >
          🌞kard
        </Typography>
        <IconButton onClick={handleDrawerToggle}>
          <CloseIcon />
        </IconButton>
      </Box>
      
      <Divider sx={{ mb: 2 }} />

      {/* Mobile Search */}
      <SearchBar isHome={isHome} closeSidebar={() => {setMobileOpen(false);     
      setTimeout(() => {
        menuBtnRef.current?.blur();   // remove hover/focus
      }, 30);}} />

      {/* Menu Links */}
      <List>
        {["Explore", "About Us"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton component={NextLink} 
                            href={index === 0 ? "/post" : "/about"}
                            sx={{
                              "&:hover": {
                                backgroundColor: "#12C998",
                                border: "none",
                                color: "white",
                              }
                            }}>
              <ListItemText 
                primary={text} 
                primaryTypographyProps={{ fontFamily: "var(--font-montserrat)", fontWeight: 600 }} 
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Auth Actions (Mobile) */}
      <Box mt="auto" display="flex" flexDirection="column" gap={2}>
        <Button
            component={NextLink}
            href="/post/create"
            variant="contained"
            color="success"
            fullWidth
            sx={{ borderRadius: 2, py: 1.5 }}
        >
            START A CAMPAIGN
        </Button>

        <SignedOut>
          <Button variant="outlined" color="inherit" fullWidth sx={{ borderRadius: 2, py: 1.25  }} onClick={() => openSignIn({})}>
            Login
          </Button>
          <Button variant="contained" sx={{ borderRadius: 2, bgcolor: "black", color: "white", py: 1.5  }} fullWidth onClick={() => openSignUp({})}>
            Sign Up
          </Button>
        </SignedOut>

        <SignedIn>
           {/* Mobile User Profile Layout */}
           <Box display="flex" alignItems="center" gap={2} p={1} bgcolor="#f9f9f9" borderRadius={2}>
              <UserButton />
              <Typography variant="body2" fontWeight="bold">My Account</Typography>
           </Box>
        </SignedIn>
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar
        position="absolute"
        elevation={0}
        onMouseEnter={() => {
          setIsHovered(true);
          setLastMoveTime(Date.now());
        }}
        onMouseLeave={() => {
          // ไม่ปิดทันที เพราะอาจไป hover mega navbar ต่อ
        }}
        sx={{
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          backgroundColor: {
              xs: isHome ? "transparent" : "white",
              md: (isHome && !isHovered) ? "transparent" : "white"
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
            md: isHovered ? "auto" : "70px",
            lg: isHovered ? "auto" : "70px" 
          },
          paddingBottom: isHovered ? { md: 0.5} : 0,
          overflow: "hidden",
          borderRadius: {
            xs: "none",
            md: isHovered ? "0 0 24px 24px" : "none" 
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
             <IconButton ref={menuBtnRef} onClick={handleDrawerToggle} edge="start" sx={{ color: "#12C998" }}>
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
                }}
              >
                🌞kard
              </Typography>
              <Box>
                <SignedIn>
                   <UserButton />
                </SignedIn>
                <SignedOut>
                   <Button variant="outlined" 
                          sx={{ borderRadius: 2, 
                                borderColor: "white",
                                color: "white",
                                fontWeight: "600", 
                                border: 2 ,
                                "&:hover": {
                                  backgroundColor: "white",
                                  color: "black",
                                  borderColor: "white",
                                  borderWidth: 2
                                }
                              }} 
                          onClick={() => openSignIn({})}>Login</Button>
                </SignedOut>
              </Box>
          </Grid>


          {/* ======================================================== */}
          {/* 💻 DESKTOP VIEW (แสดงเฉพาะ md ขึ้นไป) - โค้ดเดิมของคุณ */}
          {/* ======================================================== */}
          <Box sx={{ display: { xs: "none", md: "block" }, height: "100%" }}>
            <Grid container alignItems="center" sx={{ height: "70px" }}> 
              <Grid
                size={{ xs: 4, md: 4 }}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 4 
                  
                }}
              >
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
                  }}
                >
                  🌞kard
                </Typography>
                <Button
                  component={NextLink}
                  href="/post"
                  sx={{
                    color: isHovered ? "black" : isHome ? "white" : "black",
                    fontFamily: "var(--font-montserrat)",
                    fontSize: "1.2rem",
                    textTransform: "none",
                    "&:hover": {
                      border: "none",
                      color: "#12C998",
                      backgroundColor: "transparent"
                    }
                  }}
                >
                  Explore
                </Button>
                <Button
                  component={NextLink}
                  href="/about"
                  sx={{
                    color: isHovered ? "black" : isHome ? "white" : "black",
                    fontFamily: "var(--font-montserrat)",
                    fontSize: "1.2rem",
                    textTransform: "none",
                    whiteSpace: "nowrap",
                    "&:hover": {
                      border: "none",
                      color: "#12C998",
                      backgroundColor: "transparent"
                    }
                  }}
                >
                  About Us
                </Button>
              </Grid>

              <Grid
                size={{ xs: 4, md: 4 }}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  zIndex: 999
                }}
              >
                <SearchBar isHome={isHome} closeMegaMenu={() => setIsHovered(false)} />
              </Grid>

              <Grid
                size={{ xs: 4, md: 4 }}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 2, 
                }}
              >
                <Button
                  component={NextLink}
                  href="/post/create"
                  variant="contained"
                  color="success"
                  size="medium"
                  sx={{ borderRadius: 2, whiteSpace: "nowrap" }}
                >
                  <Typography
                    sx={{
                      fontFamily: "var(--font-montserrat)",
                      fontSize: "0.9rem",
                      fontWeight: 500,
                    }}
                  >
                    START A CAMPAIGN
                  </Typography>
                </Button>

                <SignedIn>
                  <NotificationComponent isHome={isHome} isHovered={isHovered}/>
                </SignedIn>

                <SignedOut>
                  <Box display="flex" gap={2}>
                    <Button
                      variant="text"
                      sx={{
                        color: isHovered ? "black" : isHome ? "white" : "black",
                        fontFamily: "var(--font-montserrat)",
                        fontSize: "1.2rem",
                        textTransform: "none",
                        whiteSpace: "nowrap",
                        "&:hover": {
                          border: "none",
                          color: "#12C998",
                          backgroundColor: "transparent"
                        }
                      }}
                      onClick={() => openSignIn({})}
                    >
                      Login
                    </Button>
                    <Button
                      variant="text"
                      sx={{
                        color: isHovered ? "black" : isHome ? "white" : "black",
                        fontFamily: "var(--font-montserrat)",
                        fontSize: "1.2rem",
                        textTransform: "none",
                        whiteSpace: "nowrap",
                        "&:hover": {
                          border: "none",
                          color: "#12C998",
                          backgroundColor: "transparent"
                        }
                      }}
                      onClick={() => openSignUp({})}
                    >
                      Sign Up
                    </Button>
                  </Box>
                </SignedOut>

                <SignedIn>
                  <UserButton
                    userProfileMode="navigation"
                    userProfileUrl="/user"
                    appearance={{
                      elements: {
                        avatarBox: { width: "40px", height: "40px" },
                      },
                    }}
                  />
                </SignedIn>
              </Grid>
            </Grid>

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
                transition: "opacity 0.3s ease 0.1s, transform 0.3s ease",
                px: 8,
                color: "black",
                opacity: isHovered ? 1 : 0, 
                pointerEvents: isHovered ? "auto" : "none", 
                bgcolor: "white"
              }}
            >
              <Box sx={{
                transition: "opacity 0.3s ease 0.1s, transform 0.3s ease",
                pt: 2, pb: 4, px: 8,
                color: "black",
              }}>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 2, mb: 4, pb: 3,
                    justifyContent: "center",
                    borderBottom: "2px solid rgba(0,0,0,0.05)",
                  }}>
                  {categoryList.map((item) => (
                    <Chip
                      key={item.label}
                      icon={<item.icon sx={{ fontSize: 18 }} />}
                      component={NextLink}
                      href={`/post?category=${encodeURIComponent(item.label)}`}
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
                <Grid size={{xs: 12, sm: 12, md: 3, lg: 3}} sx={{ borderRight: "2px solid #eee", mb: {xs: 3, md: 0} }}>
                    <Typography variant="subtitle2" color="text.secondary" fontWeight="bold" mb={2}
                    sx={{
                      fontFamily: "var(--font-montserrat)",
                      fontSize: "1.2rem"
                    }}>
                      QUICK FILTER
                    </Typography>
                    <Box display="flex" flexDirection="column" gap={1.5}>
                        {["All Campaigns", "Technology", "Just Launched", "Ending Soon", "Latest Update"].map(text => (
                            <Typography key={text}  color="text.secondary" sx={{ cursor: "pointer", "&:hover": { color: "#12C998" }, fontSize: "0.95rem" }}>{text}</Typography>
                        ))}
                    </Box>
                </Grid>
                <Grid size={{xs: 12, sm: 12, md: 3, lg: 3}} sx={{ borderRight: "2px solid #eee", mb: {xs: 3, md: 0} }}>
                    <Typography variant="subtitle2" color="text.secondary" fontWeight="bold" mb={2}
                    sx={{
                      fontFamily: "var(--font-montserrat)",
                      fontSize: "1.2rem"
                    }}>
                      POPULAR SEARCH
                    </Typography>
                    <Box display="flex" flexDirection="column" gap={1.5}>
                        {["Console", "Machine", "Documentary", "Electric-Bike"].map(text => (
                            <Typography key={text} color="text.secondary" sx={{ cursor: "pointer", "&:hover": { color: "#12C998" }, fontSize: "0.95rem" }}>{text}</Typography>
                        ))}
                    </Box>
                </Grid>
                <Grid size={{md: 6, lg: 3}}>
                  <Card
                    component={NextLink}
                    href={popularPosts[0] ? `/post/show/${popularPosts[0].id}` : "#"}
                    sx={{
                      height: "100%", 
                      borderRadius: 2,
                      color: "white", 
                      position: "relative", 
                      overflow: "hidden", 
                      backgroundImage: `
                        linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.4), transparent),
                        url('${process.env.NEXT_PUBLIC_API_URL}${popularPosts[0]?.images?.[0]?.path || ""}')
                      `,
                      backgroundSize: "cover",
                      backgroundPosition: "center center",
                      display: { xs: "none", md: "flex" },
                      flexDirection: "column",
                      justifyContent: "flex-end",
                      textDecoration: "none",
                    }}
                  >
                    <CardContent sx={{ p: 2}}>
                      <Typography variant="h6" fontWeight="bold" gutterBottom sx={{fontSize: "1rem", fontFamily: "var(--font-montserrat)"}}>
                        Now Popular
                      </Typography>
                      <Typography variant="body1" sx={{ opacity: 0.9, mb: 2, fontWeight: 'medium', fontSize: "1rem",fontFamily: "var(--font-montserrat)" }}>
                        {popularPosts[0] ? popularPosts[0].post_header : "#"}
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1.5} mt={2}>
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: "50%",
                            backgroundImage: `url('${process.env.NEXT_PUBLIC_API_URL}${
                              popularPosts[0]?.user?.image?.path ?? ""
                            }')`,
                            backgroundSize: "cover",
                          }}
                        ></div>
                      <Typography variant="subtitle2" fontWeight="bold">
                          {popularPosts[0] ? popularPosts[0].user.username: "#"}
                      </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={{lg: 3}}>
                  <Card
                    component={NextLink}
                    href={popularPosts[1] ? `/post/show/${popularPosts[1].id}` : "#"}
                    sx={{
                      display: { 
                        xs: "none",   
                        md: "none",   
                        lg: "flex"   
                      },
                      height: "100%", 
                      borderRadius: 2,
                      color: "white", 
                      position: "relative", 
                      overflow: "hidden", 
                      backgroundImage: `
                        linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.4), transparent),
                        url('${process.env.NEXT_PUBLIC_API_URL}${popularPosts[1]?.images?.[0]?.path || ""}')
                      `,
                      backgroundSize: "cover",
                      backgroundPosition: "center center",
                      flexDirection: "column",
                      justifyContent: "flex-end",
                      textDecoration: "none",
                    }}
                  >
                    <CardContent sx={{ p: 2}}>
                      <Typography variant="h6" fontWeight="bold" gutterBottom sx={{fontSize: "1rem", fontFamily: "var(--font-montserrat)"}}>
                        Now Popular
                      </Typography>
                      <Typography variant="body1" sx={{ opacity: 0.9, mb: 2, fontWeight: 'medium', fontSize: "1rem",fontFamily: "var(--font-montserrat)" }}>
                        {popularPosts[1] ? popularPosts[1].post_header : "#"}
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1.5} mt={2}>
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: "50%",
                            backgroundImage: `url('${process.env.NEXT_PUBLIC_API_URL}${
                              popularPosts[1]?.user?.image?.path ?? ""
                            }')`,
                            backgroundSize: "cover",
                          }}
                        ></div>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {popularPosts[1] ? popularPosts[1].user.username: "#"}
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
        ModalProps={{ keepMounted: true }} 
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
