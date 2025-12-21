"use client";

import { useState, useEffect, useRef } from "react";
import { Box, InputBase, Portal } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { search } from "./api/api";
import { SearchResult } from "./types/navbar";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import PersonIcon from "@mui/icons-material/Person";
import Avatar from "@mui/material/Avatar";


export default function SearchBar({ isHome, closeMegaMenu, closeSidebar }: { isHome?: boolean; closeMegaMenu?: () => void; closeSidebar?: () => void }) {
const router = useRouter();
const pathname = usePathname();
const [query, setQuery] = useState("");
const [results, setResults] = useState<SearchResult[]>([]);
const [loading, setLoading] = useState(false);
const [openModal, setOpenModal] = useState(false);

const barRef = useRef<HTMLDivElement | null>(null);
const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });

const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim()) {
        router.push(`/post?query=${encodeURIComponent(query)}`);
        setResults([]);
        closeMegaMenu?.();
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
const timer = setTimeout(() => setResults([]), 5000);
return () => clearTimeout(timer);
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
    {/* 🔍 MOBILE SEARCH BAR */}
    <Box 
        sx={{ 
            display: { xs: "flex", md: "none" },
            alignItems: "center",
            bgcolor: "#f5f5f5",
            borderRadius: 2,
            px: 2,
            py: 0.8,
            mb: 2,
            width: "100%",
            cursor: "pointer"
        }}
        onClick={() => setOpenModal(true)}  
    >
        <SearchIcon sx={{ color: "gray", mr: 1 }} />
        <InputBase
            placeholder="Search..."
            fullWidth
            sx={{
                pointerEvents: "none",  
            }}    
        />
    </Box>
    {/* MOBILE SEARCH MODAL */}
    {openModal && (
        <Box
            sx={{
                position: "fixed",
                inset: 0,
                bgcolor: "rgba(0,0,0,0.5)",
                zIndex: 1100,
                display: { xs: "flex", md: "none" },
                justifyContent: "center",
                alignItems: "center",
            }}
            onClick={() => {setOpenModal(false);closeSidebar?.();}}  
        >
        <Box
            onClick={(e) => e.stopPropagation()} 
            sx={{
                width: "90%",
                maxWidth: 400,
                bgcolor: "white",
                borderRadius: 3,
                p: 2,
                boxShadow: 5,
                height: "fit-content",
                maxHeight: "40%",
                overflow: "hidden"
            }}
        >
            {/* SEARCH INPUT */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 2, backgroundColor: "#F3F4F6", borderRadius: 2, p: 1 }}>
                <SearchIcon sx={{ color: "gray", mr: 1 }} />
                <InputBase
                    autoFocus
                    placeholder="Search..."
                    fullWidth
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
            </Box>

            {/* RESULTS */}
            {results.length > 0 && (
                <Box sx={{ maxHeight: "50vh", overflowY: "auto" }}>
                    {results.map((item) => (
                        <Box
                            key={item.id}
                            onClick={() => {
                                handleSelect(item);
                                setOpenModal(false);
                            }}
                            sx={{
                                p: 1,
                                borderRadius: 2,
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                                "&:hover": { bgcolor: "#f5f5f5" }
                            }}
                        >
                            {/* Avatar/Thumbnail */}
                            {item.thumbnail ? (
                                <img
                                    src={item.thumbnail}
                                    style={{
                                        width: 50,
                                        height: 50,
                                        objectFit: "cover",
                                        borderRadius: 8
                                    }}
                                />
                            ) : (
                                <Box sx={{ width: 50, height: 50, bgcolor: "#eee", borderRadius: 8 }} />
                            )}

                            <Box>
                                <div style={{ fontWeight: 600 }}>{item.name}</div>

                                {item.type === "post" && (
                                    <div style={{ fontSize: 12, color: "#777" }}>
                                        Campaign by {item.creator}
                                    </div>
                                )}

                                {item.type === "user" && (
                                    <div style={{ fontSize: 12, color: "#777" }}>USER</div>
                                )}
                            </Box>
                        </Box>
                    ))}
                </Box>
            )}
        </Box>
    </Box>
    )}

    {/* SEARCH INPUT */}
    <Box ref={barRef} sx={{ width: "100%", maxWidth: 500, display: { xs: "none", md: "block" } }}>
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
        backgroundColor: "#F3F4F6",
        px: 1,
        borderRadius: 4,
        fontSize: 14,
        height: 36,
        width: "100%",
        }}
    />
    </Box>

    {/* FLOATING DROPDOWN FOLLOWING NAVBAR */}
    {results.length > 0 && !openModal && (
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
                    sx={{ width: 60, height: 60, borderRadius: 99}}
                />
                ) : (
                <Avatar
                    sx={{ width: 60, height: 60, bgcolor: "#e5e7eb", color: "gray"}}
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
