import { Box, Paper, Typography, Stack, Chip, IconButton } from "@mui/material";
import Link from "next/link";
import { Post } from "@/modules/post/types/post";
import { CATEGORY_COLORS } from "@/modules/home/utils/categoryColors";
import { keyframes } from "@mui/system";
import EditIcon from "@mui/icons-material/Edit";

const grow = keyframes`
  0% {
    transform: scaleX(0);
  }
  100% {
    transform: scaleX(1);
  }
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
        <Stack spacing={2} sx={{ py: 2 }}>
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
                        <Link
                            href={`/post/show/${post.id}`}
                            style={{ textDecoration: "none" }}
                        >
                            <Paper
                                sx={{
                                    p: 4,
                                    display: "flex",
                                    flexDirection: { xs: "column", sm: "row" },
                                    gap: 2,
                                    borderRadius: 2,
                                    minHeight: "200px",
                                    transition: "all 0.3s ease",
                                    border: "1px solid transparent",
                                    "&:hover": {
                                        transform: "translateY(-4px)",
                                        boxShadow: "0 12px 24px rgba(244, 114, 182, 0.25)",
                                    },
                                    "&:hover .progress-bar-fill": {
                                        animation: `${grow} 1s ease-out forwards`,
                                    },
                                }}
                                elevation={1}
                            >
                                {/* Image Section */}
                                <Box
                                    component="img"
                                    src={postImage}
                                    alt={post.post_header}
                                    sx={{
                                        width: { xs: "100%", sm: 200 },
                                        height: { xs: 200, sm: 150 },
                                        objectFit: "cover",
                                        borderRadius: 2,
                                        backgroundColor: "#eee",
                                    }}
                                />

                                {/* Content Section */}
                                <Box
                                    flex={1}
                                    display="flex"
                                    flexDirection="column"
                                    justifyContent="space-between"
                                >
                                    <Box>
                                        <Box
                                            display="flex"
                                            justifyContent="space-between"
                                            alignItems="flex-start"
                                            mb={0.5}

                                        >
                                            <Typography
                                                variant="h6"
                                                fontWeight={700}
                                                sx={{
                                                    lineHeight: 1.2,
                                                    mr: 1,
                                                    color: "text.primary",
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
                                                    zIndex: 1, // Ensure chip is above
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
                                            }}
                                        >
                                            {post.post_description}
                                        </Typography>
                                    </Box>

                                    <Box mt={1}>
                                        <Box
                                            display="flex"
                                            justifyContent="space-between"
                                            alignItems="center"
                                            mb={0.5}
                                        >
                                            <Typography
                                                variant="caption"
                                                fontWeight={600}
                                                color="#12C998"
                                            >
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
                                                zIndex: 0,
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
                            </Paper>
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
                                <EditIcon fontSize="small" color="inherit" />
                            </IconButton>
                        )}
                    </Box>
                );
            })}
        </Stack>
    );
}
