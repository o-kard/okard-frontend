// modules/post/components/PostList.tsx
import { Post } from "../types/post";
import Link from "next/link";
import { Box, Typography, Chip, Button, LinearProgress } from "@mui/material";
import Grid from "@mui/material/Grid";

type Props = {
  posts: Post[];
  onEdit: (post: Post) => void;
  onDelete: (id: string) => void;
};

export default function PostList({ posts }: Props) {
  return (
    <Grid container spacing={2}>
      {posts.map((post) => {
        const img = post.images?.[0]?.path
          ? `${process.env.NEXT_PUBLIC_API_URL}${post.images[0].path}`
          : undefined;

        const goal = Math.max(0, post.goal_amount || 0);
        const raised = Math.max(0, post.current_amount || 0);
        const percent =
          goal > 0 ? Math.min(100, Math.round((raised / goal) * 100)) : 0;

        const isOngoing = post.status === "active" && post.state !== "archived";

        return (
          <Grid key={post.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <Box
              className="card"
              sx={{
                position: "relative",
                borderRadius: 3,
                overflow: "hidden",
                boxShadow: 2,
                bgcolor: "background.paper",
                transition: "box-shadow .2s ease, transform .2s ease",
                "&:hover": { boxShadow: 6, transform: "translateY(-2px)" },

                /* --- hover targets --- */
                "&:hover .imgOverlay": { opacity: 0.75 }, // gradient โผล่ตอน hover
                "&:hover .textOnImage": { transform: "translateY(-35px)" }, // ข้อความเลื่อนขึ้น
                "&:hover .hoverCta": { opacity: 1, transform: "translateY(0)" }, // ปุ่มเลื่อนขึ้น + เฟดอิน
              }}
            >
              {/* IMAGE AREA */}
              <Box
                sx={{ position: "relative", height: 300, bgcolor: "grey.200" }}
              >
                {img && (
                  <Box
                    component="img"
                    src={img}
                    alt={post.post_header}
                    sx={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                )}

                {/* gradient overlay: เริ่มโปร่งใส, โผล่เมื่อ hover */}
                <Box
                  className="imgOverlay"
                  sx={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,1) 100%)",
                    opacity: 0,
                    transition: "opacity .25s ease",
                  }}
                />

                {/* ข้อความบนรูป (เลื่อนขึ้นเล็กน้อยตอน hover) */}
                <Box
                  className="textOnImage"
                  sx={{
                    position: "absolute",
                    left: 12,
                    right: 12,
                    bottom: 12,
                    transform: "translateY(0)",
                    transition: "transform .25s ease",
                    pointerEvents: "none",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    color="#fff"
                    sx={{ textShadow: "0 1px 2px rgba(0,0,0,.6)" }}
                  >
                    {post.post_header}
                  </Typography>
                  <Typography
                    variant="h6"
                    fontWeight={800}
                    color="#fff"
                    sx={{ textShadow: "0 1px 2px rgba(0,0,0,.6)" }}
                  >
                    {goal.toLocaleString()} THB
                  </Typography>

                  <Box sx={{ mt: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={percent}
                      sx={{
                        height: 6,
                        borderRadius: 999,
                        backgroundColor: "rgba(255,255,255,.35)",
                        "& .MuiLinearProgress-bar": { borderRadius: 999 },
                      }}
                    />
                    <Typography
                      variant="caption"
                      color="#fff"
                      sx={{ display: "block", mt: 0.5, opacity: 0.9 }}
                    >
                      {raised.toLocaleString()} THB raised | {percent}% funded
                    </Typography>
                  </Box>
                </Box>

                {/* CTA บนรูป: โผล่เฉพาะตอน hover (เลื่อนขึ้น + เฟดอิน) */}
                <Box
                  className="hoverCta"
                  sx={{
                    position: "absolute",
                    left: 12,
                    right: 12,
                    bottom: 12,
                    display: "flex",
                    justifyContent: "flex-start",
                    opacity: 0,
                    transform: "translateY(10px)",
                    transition: "opacity .25s ease, transform .25s ease",
                  }}
                >
                  <Button
                    component={Link}
                    href={`/post/show/${post.id}`}
                    size="small"
                    variant="contained"
                    sx={{
                      fontWeight: 700,
                      borderRadius: 2,
                      bgcolor: "common.white",
                      color: "text.primary",
                      "&:hover": { bgcolor: "grey.100" },
                    }}
                  >
                    VIEW CAMPAIGN
                  </Button>
                </Box>
              </Box>

              {/* BODY */}
              <Box sx={{ px: 2, pt: 1.5, pb: 2 }}>
                {post.post_description && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    {post.post_description}
                  </Typography>
                )}

                <Box
                  sx={{ mt: 1.5, display: "flex", justifyContent: "flex-end" }}
                >
                  {isOngoing && (
                    <Chip
                      label="ONGOING"
                      size="small"
                      sx={{
                        fontWeight: 700,
                        borderRadius: 999,
                        bgcolor: "warning.main",
                        color: "common.black",
                        "& .MuiChip-label": { px: 1 },
                      }}
                    />
                  )}
                </Box>
              </Box>
            </Box>
          </Grid>
        );
      })}
    </Grid>
  );
}
