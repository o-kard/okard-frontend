"use client";

import { useState, useEffect, useRef } from "react";
import { Box, InputBase, Portal } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import SearchIcon from "@mui/icons-material/Search";
import { search } from "./api/api";
import { SearchResult } from "./types/navbar";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import PersonIcon from "@mui/icons-material/Person";
import Avatar from "@mui/material/Avatar";


export default function SearchBar({ isHome, closeMegaMenu, closeSidebar, isOpen = true }: { isHome?: boolean; closeMegaMenu?: () => void; closeSidebar?: () => void; isOpen?: boolean }) {
    const router = useRouter();
    const pathname = usePathname();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);

    const barRef = useRef<HTMLDivElement | null>(null);
    const mobileContainerRef = useRef<HTMLDivElement | null>(null);
    const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });

    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

    // Handle click outside for mobile search results
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (mobileContainerRef.current && !mobileContainerRef.current.contains(event.target as Node)) {
                setResults([]);
            }
        };

        if (results.length > 0) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [results]);

    // Clear search when switching views (Responsive change)
    useEffect(() => {
        setQuery("");
        setResults([]);

        if (isDesktop && openModal) {
            setOpenModal(false);
        }
    }, [isDesktop]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && query.trim()) {
            closeMegaMenu?.(); // Close mega menu immediately
            router.push(`/post?query=${encodeURIComponent(query)}`);
            setResults([]);
            setQuery(""); // Clear the search input
            setOpenModal(false);
            setTimeout(() => {
                closeSidebar?.();
            }, 10);
        }
    };


    const updatePosition = () => {
        if (barRef.current) {
            const rect = barRef.current.getBoundingClientRect();
            setPos({
                top: rect.bottom + 4,
                left: rect.left,
                width: rect.width,
            });
        }
    };

    useEffect(() => {
        setQuery("");
        setResults([]);
    }, [pathname]);

    useEffect(() => {
        updatePosition();
        window.addEventListener("resize", updatePosition);
        window.addEventListener("scroll", updatePosition);

        return () => {
            window.removeEventListener("resize", updatePosition);
            window.removeEventListener("scroll", updatePosition);
        };
    }, []);

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (!query.trim()) {
                setResults([]);
                return;
            }

            setLoading(true);
            try {
                const data = await search(query);
                console.log("SEARCH DATA:", data);
                setResults(data.results);
                if (data.results.length > 0) {
                    // Do not close mega menu implicitly here
                }
            } catch (err) {
                console.error("Search Error:", err);
            }
            setLoading(false);

            updatePosition();
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    useEffect(() => {
        if (results.length === 0) return;

        let animationFrameId: number;

        const trackPosition = () => {
            updatePosition();
            animationFrameId = requestAnimationFrame(trackPosition);
        };

        trackPosition(); // Start tracking

        const timer = setTimeout(() => setResults([]), 5000);

        return () => {
            cancelAnimationFrame(animationFrameId);
            clearTimeout(timer);
        };
    }, [results]);

    const handleSelect = (item: SearchResult) => {
        setQuery("");
        setResults([]);

        if (item.type === "user") router.push(`/user/${item.id}`);
        else if (item.type === "post") router.push(`/post/show/${item.id}`);

        closeSidebar?.();
    };

    return (
        <>
            {/* 🔍 MOBILE SEARCH CONTAINER (Relative for positioning results) */}
            <Box ref={mobileContainerRef} sx={{ position: "relative", display: { xs: "block", md: "none" }, width: "100%" }}>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        bgcolor: "#f5f5f5",
                        borderRadius: 2,
                        px: 2,
                        py: 0.8,
                        width: "100%",
                    }}
                >
                    <SearchIcon sx={{ color: "gray", mr: 1 }} />
                    <InputBase
                        placeholder="Search..."
                        fullWidth
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                </Box>

                {/* MOBILE SEARCH RESULTS (OVERLAY) */}
                {results.length > 0 && (
                    <Box
                        sx={{
                            position: "absolute",
                            top: "100%",
                            left: 0,
                            right: 0,
                            mt: 1,
                            maxHeight: "50vh",
                            overflowY: "auto",
                            bgcolor: "white",
                            borderRadius: 2,
                            boxShadow: 4,
                            zIndex: 100
                        }}
                    >
                        {results.map((item) => (
                            <Box
                                key={item.id}
                                onClick={() => {
                                    handleSelect(item);
                                    setResults([]); // Clear results on select
                                }}
                                sx={{
                                    p: 1,
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                    borderBottom: "1px solid #f0f0f0",
                                    "&:last-child": { borderBottom: "none" },
                                    "&:hover": { bgcolor: "#f5f5f5" }
                                }}
                            >
                                {/* Avatar/Thumbnail */}
                                {item.thumbnail ? (
                                    <img
                                        src={item.thumbnail}
                                        style={{
                                            width: 40,
                                            height: 40,
                                            objectFit: "cover",
                                            borderRadius: 8
                                        }}
                                    />
                                ) : (
                                    <Box sx={{ width: 40, height: 40, bgcolor: "#eee", borderRadius: 8 }} />
                                )}

                                <Box>
                                    <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{item.name}</div>

                                    {item.type === "post" && (
                                        <div style={{ fontSize: 11, color: "#777" }}>
                                            Campaign by {item.creator}
                                        </div>
                                    )}

                                    {item.type === "user" && (
                                        <div style={{ fontSize: 11, color: "#777" }}>USER</div>
                                    )}
                                </Box>
                            </Box>
                        ))}
                    </Box>
                )}
            </Box>

            {/* SEARCH INPUT */}
            <Box ref={barRef} sx={{ width: "100%", maxWidth: "100%", display: { xs: "none", md: "block" } }}>
                <InputBase
                    placeholder="searching..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    startAdornment={
                        <SearchIcon
                            sx={{
                                color: isHome ? "gray" : "black",
                                mr: 1,
                                fontSize: 24,
                            }}
                        />
                    }
                    sx={{
                        backgroundColor: isHome ? "#F3F4F6" : "rgba(255, 255, 255, 0.15)",
                        backdropFilter: isHome ? "none" : "blur(12px)",
                        border: isHome ? "1px solid transparent" : "1px solid rgba(255, 255, 255, 0.3)",
                        boxShadow: isHome ? "none" : "0 4px 30px rgba(0, 0, 0, 0.1)",
                        "&:hover": {
                            backgroundColor: isHome ? "#E5E7EB" : "rgba(255, 255, 255, 0.25)",
                            borderColor: isHome ? "transparent" : "rgba(255, 255, 255, 0.5)",
                        },
                        px: 1,
                        borderRadius: 4,
                        fontSize: 14,
                        height: 42,
                        width: "100%",
                    }}
                />
            </Box>

            {/* FLOATING DROPDOWN FOLLOWING NAVBAR */}
            {results.length > 0 && !openModal && pos.width > 0 && (
                <Portal>
                    <Box
                        sx={{
                            position: "fixed",
                            top: pos.top,
                            left: pos.left,
                            width: pos.width,
                            backgroundColor: "white",
                            borderRadius: 4,
                            boxShadow: 3,
                            zIndex: 2000,
                            display: { xs: "none", md: "block" },
                        }}
                    >
                        {results.map((item) => (
                            <Box
                                key={item.id}
                                onClick={() => handleSelect(item)}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    p: 1,
                                    cursor: "pointer",
                                    borderRadius: 4,
                                    "&:hover": { backgroundColor: "#f5f5f5" }
                                }}
                            >
                                {/* USER TYPE */}
                                {item.type === "user" && (
                                    item.thumbnail ? (
                                        <Avatar
                                            src={item.thumbnail}
                                            sx={{ width: 60, height: 60, borderRadius: 99 }}
                                        />
                                    ) : (
                                        <Avatar
                                            sx={{ width: 60, height: 60, bgcolor: "#e5e7eb", color: "gray" }}
                                        >
                                            <PersonIcon />
                                        </Avatar>
                                    )
                                )}

                                {/* POST TYPE */}
                                {item.type === "post" && (
                                    item.thumbnail ? (
                                        <img
                                            src={item.thumbnail}
                                            style={{
                                                width: 60,
                                                height: 60,
                                                objectFit: "cover",
                                                borderRadius: 99
                                            }}
                                        />
                                    ) : (
                                        <Box
                                            sx={{
                                                width: 60,
                                                height: 60,
                                                backgroundColor: "#e5e7eb",
                                                borderRadius: 99,
                                            }}
                                        />
                                    )
                                )}

                                <Box sx={{ display: "flex", flexDirection: "column" }}>
                                    {/* NAME */}
                                    <span style={{ fontWeight: 600 }}>{item.name}</span>

                                    {/* POST TYPE */}
                                    {item.type === "post" && item.creator && (
                                        <span style={{ fontSize: 12, color: "#777" }}>
                                            Campaign by {item.creator}
                                        </span>
                                    )}

                                    {/* USER TYPE */}
                                    {item.type === "user" && (
                                        <span style={{ fontSize: 12, color: "#777" }}>
                                            USER
                                        </span>
                                    )}
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </Portal>
            )}
        </>
    );
}
