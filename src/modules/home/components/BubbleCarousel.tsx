"use client"
import { useEffect, useRef, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { Box, IconButton, Typography, } from "@mui/material"
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew"
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos"
import { glowHover } from "../utils/glowHover"
import { Post } from "@/modules/post/types/post";
import InfiniteMenu from "./InifiniteMenu";

type Group = {
  category: string;
  projects: Post[];
};

type BubbleCarouselProps = {
  groups: Group[];
};

export default function BubbleCarousel({ groups }: BubbleCarouselProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const sectionRef = useRef<HTMLDivElement | null>(null)
  const [isVisible, setIsVisible] = useState(true)
  const [emblaReady, setEmblaReady] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  /** ===== categories ===== */
  const categories = groups.map((g) => g.category);

  /** ===== data ===== */
  const allProjects = groups.flatMap((g) => g.projects);

  const filteredProjects =
    selectedCategory === "ALL"
      ? allProjects
      : allProjects.filter((p) => p.category === selectedCategory);

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.4 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (selectedIndex === 0 && isVisible) {
        video.play().catch(() => {})
    } else {
      video.pause()
    }
  }, [selectedIndex, isVisible])

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    watchDrag: false,
  })

  useEffect(() => {
    if (!emblaApi) return

    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap())
    emblaApi.on("select", onSelect)
    onSelect()

    return () => {
      emblaApi.off("select", onSelect)
    }
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.scrollTo(0, true);
    setEmblaReady(true);
  }, [emblaApi]);


  return (
    <Box
      ref={sectionRef}
      sx={{
        position: "relative",
        height: "100dvh",
        width: "100%",
      }}
    >
      {/* ลูกศรซ้าย */}
      <IconButton
        onClick={() => emblaApi?.scrollPrev()}
        sx={{
          position: "absolute",
          left: 24,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 10,
          color: "#fff",
          bgcolor: "rgba(0,0,0,0.4)",
          "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
        }}
      >
        <ArrowBackIosNewIcon />
      </IconButton>

      {/* ลูกศรขวา */}
      <IconButton
        onClick={() => emblaApi?.scrollNext()}
        sx={{
          position: "absolute",
          right: 24,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 10,
          color: "#fff",
          bgcolor: "rgba(0,0,0,0.4)",
          "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
        }}
      >
        <ArrowForwardIosIcon />
      </IconButton>

      {/* Embla viewport */}
      <Box
        ref={emblaRef}
        sx={{
          overflow: "hidden",
          height: "100%",
          width: "100%",
        }}
      >
        {/* Embla container */}
        <Box
          sx={{
            display: "flex",
            height: "100%",
            visibility: emblaReady ? "visible" : "hidden",
          }}
        >
          {/* 🔵 Welcome Slide */}
          <Box
            sx={{
              flex: "0 0 100%", // ✅ 1 slide = 100%
              height: "100%",
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              backgroundColor: "transparent",
              visibility: "visible",
            }}
          >
            {/* Video Background (เฉพาะ Welcome) */}
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                zIndex: 0,
              }}
            >
              <source src="/videos/seedling.mp4" type="video/mp4" />
            </video>

            {/* 🔲 Overlay */}
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                zIndex: 1,
                background: "rgba(0,0,0,0.6)",
              }}
            />

            {/* 🧩 Content */}
            <Box sx={{ position: "relative", zIndex: 2 }}>
              <Typography
                variant="h2"
                sx={{
                  mb: 2,
                  fontWeight: "bold",
                  fontFamily: "var(--font-syncopate)",
                  fontSize: {xs: "2rem", sm: "4rem", md: "6rem" },
                  color: "#12C998",
                  ...glowHover,
                }}
              >
                WELCOME TO
              </Typography>

              <Typography
                variant="h2"
                sx={{
                  mb: 2,
                  fontWeight: "bold",
                  fontFamily: "var(--font-syncopate)",
                  fontSize: {xs: "2.5rem", sm: "6rem", md: "8rem" },
                  color: "#12C998",
                  ...glowHover,
                  display: "inline-flex",
                  alignItems: "center",  
                }}
              >
                <Box
                  component="img"
                  src="/Logo_sun.svg"
                  alt="Logo"
                  sx={{
                    width: { xs: 80, sm: 130, md: 180 },
                    height: { xs: 80, sm: 130, md: 180 },
                    mr: 1,
                  }}
                />kard
              </Typography>

              <Typography sx={{ color: "#ddd" }}>
                use arrows or swipe down to explore projects
              </Typography>
            </Box>
          </Box>

          {/* ===== Slide 1: InfiniteMenu (หน้าเดียว) ===== */}
          <Box sx={{ flex: "0 0 100%", height: "100%" }}>
            {emblaReady && (
              <InfiniteMenu
                items={filteredProjects}
                isActive={selectedIndex === 1}
                scale={1.0}
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
