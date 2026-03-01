import { Box, Paper, Typography, Stack, Chip, IconButton, keyframes } from "@mui/material";
import Link from "next/link";
import { Post } from "@/modules/post/types/post";
import { CATEGORY_COLORS } from "@/modules/home/utils/categoryColors";
import EditIcon from "@mui/icons-material/Edit";

const grow = keyframes`
  0% { transform: scaleX(0); }
  100% { transform: scaleX(1); }
`;

interface CampaignListProps {
    campaigns: Post[];
    showEditButton?: boolean;
}

export default function CampaignList({ campaigns, showEditButton }: CampaignListProps) {
    if (campaigns.length === 0) {
        return (
            <Paper sx={{ p: 4, textAlign: "center", borderRadius: 3 }}>
                <Typography color="text.secondary">No campaigns found.</Typography>
            </Paper>
        );
    }

    return (
        <Stack
            spacing={2}
            sx={{
                py: 2,
                maxHeight: "100%",
                overflowY: "auto",
                pr: 1, // Space for scrollbar
                '&::-webkit-scrollbar': {
                    width: '6px',
                },
                '&::-webkit-scrollbar-track': {
                    background: 'transparent',
                },
                '&::-webkit-scrollbar-thumb': {
                    background: 'rgba(0,0,0,0.1)',
                    borderRadius: '10px',
                    '&:hover': {
                        background: 'rgba(0,0,0,0.2)',
                    },
                },
            }}
        >
            {campaigns.map((post) => {
                const progress =
                    post.current_amount && post.goal_amount
                        ? Math.min(100, (post.current_amount / post.goal_amount) * 100)
                        : 0;

                const postImage =
                    post.images && post.images.length > 0
                        ? `${process.env.NEXT_PUBLIC_API_URL}${post.images[0].path}`
                        : "/placeholder-image.png";

                const category = CATEGORY_COLORS[post.category] || CATEGORY_COLORS.all;

                return (
                    <Box key={post.id} sx={{ position: "relative" }}>
                        <Paper
                            sx={{
                                borderRadius: 3,
                                height: { xs: "auto", sm: 200 },
                                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                                border: "1px solid",
                                borderColor: "divider",
                                overflow: "hidden",
                                transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                                "&:hover": {
                                    transform: "translateY(-4px)",
                                    boxShadow: "0 12px 24px rgba(244, 114, 182, 0.25)",
                                },
                                "&:hover .progress-bar-fill": {
                                    animation: `${grow} 1s ease-out forwards`,
                                },
                            }}
                        >
                            <Link href={`/post/show/${post.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                                <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, height: "100%" }}>
                                    {/* Image Section */}
                                    <Box
                                        sx={{
                                            width: { xs: "100%", sm: 240 },
                                            height: { xs: 200, sm: "100%" },
                                            bgcolor: "grey.100",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            flexShrink: 0,
                                            position: "relative",
                                        }}
                                    >
                                        <Box
                                            component="img"
                                            src={postImage}
                                            alt={post.post_header}
                                            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                                        />

                                        {/* Category Chip Overlayed on Image for cleaner look or keep it inside? User said keep elements. 
                                            In ContributorCard elements are inside. I'll keep them inside but refined. */}
                                    </Box>

                                    {/* Content Section */}
                                    <Box
                                        sx={{
                                            flex: 1,
                                            p: 2,
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "space-between",
                                            overflow: "hidden"
                                        }}
                                    >
                                        <Box>
                                            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={0.5}>
                                                <Typography
                                                    variant="h6"
                                                    fontWeight={700}
                                                    sx={{
                                                        lineHeight: 1.2,
                                                        mr: 1,
                                                        color: "text.primary",
                                                        lineClamp: 1,
                                                        overflow: "hidden",
                                                        display: "-webkit-box",
                                                        WebkitLineClamp: 1,
                                                        WebkitBoxOrient: "vertical"
                                                    }}
                                                >
                                                    {post.post_header}
                                                </Typography>
                                                <Chip
                                                    label={category.label}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: category.color,
                                                        color: "#fff",
                                                        fontWeight: 700,
                                                        height: 24,
                                                        fontSize: "0.7rem",
                                                        flexShrink: 0,
                                                    }}
                                                />
                                            </Box>

                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    display: "-webkit-box",
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: "vertical",
                                                    minHeight: 40
                                                }}
                                            >
                                                {post.post_description}
                                            </Typography>
                                        </Box>

                                        <Box mt={1}>
                                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                                                <Typography variant="caption" fontWeight={600} color="#12C998">
                                                    {progress.toFixed(0)}% Funded
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {new Intl.NumberFormat().format(post.current_amount)} /{" "}
                                                    {new Intl.NumberFormat().format(post.goal_amount)} THB
                                                </Typography>
                                            </Box>
                                            <Box
                                                sx={{
                                                    width: "100%",
                                                    height: 6,
                                                    bgcolor: "#eee",
                                                    borderRadius: 3,
                                                    overflow: "hidden",
                                                    position: "relative",
                                                }}
                                            >
                                                <Box
                                                    className="progress-bar-fill"
                                                    sx={{
                                                        width: `${progress}%`,
                                                        height: "100%",
                                                        bgcolor: "#12C998",
                                                        transformOrigin: "left",
                                                    }}
                                                />
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                            </Link>

                            {showEditButton && (
                                <IconButton
                                    component={Link}
                                    href={`/post/edit/${post.id}`}
                                    sx={{
                                        position: "absolute",
                                        top: 10,
                                        left: 10,
                                        zIndex: 10,
                                        bgcolor: "#12C998",
                                        color: "white",
                                        "&:hover": {
                                            bgcolor: "#0ea880",
                                            transform: "scale(1.1)",
                                        },
                                        boxShadow: 3,
                                        transition: "all 0.2s ease",
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <EditIcon fontSize="small" color="inherit" sx={{ transform: "scaleX(-1)" }} />
                                </IconButton>
                            )}
                        </Paper>
                    </Box>
                );
            })}
        </Stack>
    );
}
