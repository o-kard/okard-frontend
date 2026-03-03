"use client";
import { useEffect, useMemo, useState, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Container,
  Typography,
  Chip,
  LinearProgress,
  Button,
  IconButton,
  Grid,
  Stack,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ShareIcon from "@mui/icons-material/Share";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import CloseIcon from "@mui/icons-material/Close";

import { Post, Media } from "@/modules/post/types/post";
import PostDetailTabs from "@/modules/post/components/PostDetailTabs";
import CampaignSections from "@/modules/post/components/CampaginSection";
import RewardSections from "@/modules/post/components/RewardSection";
import CommentSections from "@/modules/post/components/comment/CommentSection";
import { useAuth, useUser } from "@clerk/nextjs";
import ReportModal from "@/modules/report/components/ReportModal";
import ReportIcon from "@mui/icons-material/Report";
import { fetchPostById, fetchRecommendedPosts } from "@/modules/post/api/api";
import PostList from "@/modules/post/components/PostList";
import { getUser, getUserById } from "@/modules/user/api/api";
import ReviewEditRequestModal from "@/modules/edit_request/components/ReviewEditRequestModal";
import CreatorCard from "@/modules/post/components/CreatorCard";
import RateReviewIcon from "@mui/icons-material/RateReview";
import ProgressForm from "@/modules/progress/components/ProgressForm";
import ProgressSection from "@/modules/progress/components/ProgressSection";
import { getProgressByPostId } from "@/modules/progress/api/api";
import { Progress } from "@/modules/progress/types";
import AddIcon from "@mui/icons-material/Add";
import { CATEGORY_COLORS } from "@/modules/home/utils/categoryColors";
import { useBookmark } from "@/modules/post/hooks/useBookmark";
import BookmarkIconMini from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { predictionLabel } from "@/utils/label";

export default function PostDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [post, setPost] = useState<Post | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();
  const { user } = useUser();
  const [appUser, setAppUser] = useState<string>("");
  const { getToken } = useAuth();
  const [openReportModal, setOpenReportModal] = useState(false);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [reviewRequest, setReviewRequest] = useState<any>(null);
  const [recommendedPosts, setRecommendedPosts] = useState<Post[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  const { isBookmarked, handleToggleBookmark, setIsBookmarked } = useBookmark(
    id,
    false,
  );

  // ✅ Track if post has been fetched to prevent duplicate view logs
  const hasFetchedPost = useRef(false);

  // Progress
  const [progressItems, setProgressItems] = useState<Progress[]>([]);
  const [openProgressForm, setOpenProgressForm] = useState(false);
  const [editProgressItem, setEditProgressItem] = useState<Progress | null>(
    null,
  );

  const fetchProgress = () => {
    if (!id) return;
    getProgressByPostId(id)
      .then(setProgressItems)
      .catch((err) => console.error("Failed to fetch progress", err));
  };

  useEffect(() => {
    async function fetchRole() {
      if (user?.id) {
        try {
          const token = await getToken();
          if (token) {
            const dbUser = await getUser(token);
            if (dbUser && dbUser.role) {
              setAppUser(dbUser.id);
            }
          }
        } catch (err) {
          console.error("Failed to fetch user role:", err);
        }
      }
    }
    fetchRole();
  }, [user?.id, getToken]);
  console.log(appUser);

  useEffect(() => {
    if (!id) return;
    // Fetch pending requests
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/edit_requests/?post_id=${id}`)
      .then((res) => {
        if (res.ok) return res.json();
        return [];
      })
      .then((data) => setPendingRequests(data))
      .catch((err) => console.error("Failed to fetch edit requests", err));

    fetchProgress();
  }, [id]);

  const portableReview = useMemo(() => {
    if (!appUser || pendingRequests.length === 0) return null;
    return pendingRequests.find((req) =>
      req.approvers?.some((app: any) => app.user_id === appUser),
    );
  }, [appUser, pendingRequests]);

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "-";
    let s = dateStr.trim().replace(" ", "T");
    if (!/[zZ]|[+\-]\d{2}:?\d{2}$/.test(s)) s += "Z";
    return new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    }).format(new Date(s));
  };

  useEffect(() => {
    if (!id) return;

    // ✅ Prevent duplicate fetches
    if (hasFetchedPost.current) return;
    hasFetchedPost.current = true;

    const clerkId = user?.id;

    const url = clerkId
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/post/${id}?clerk_id=${clerkId}`
      : `${process.env.NEXT_PUBLIC_API_URL}/api/post/${id}`;

    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        setPost(data);
        setIsBookmarked(data.is_bookmarked || false);

        // Fetch recommendations after getting the post
        setLoadingRecommendations(true);
        fetchRecommendedPosts(id, 4)
          .then(async (recData) => {
            if (recData && recData.recommendations) {
              // Fetch full post details for each recommendation
              const postsData = await Promise.all(
                recData.recommendations.map((rec) =>
                  fetchPostById(rec.post_id),
                ),
              );
              // Filter out any failed fetches (nulls)
              setRecommendedPosts(postsData.filter(Boolean));
            }
          })
          .catch((err) => console.error("Failed to fetch recommendations", err))
          .finally(() => setLoadingRecommendations(false));
      })
      .catch(console.error);
  }, [id, user?.id]);

  const handleBookmarkClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    await handleToggleBookmark();
  };

  const imgSrc = useMemo(
    () =>
      post?.images?.[0]?.path
        ? `${process.env.NEXT_PUBLIC_API_URL}${post.images[0].path}`
        : undefined,
    [post],
  );

  // Build slider media: video first (if any), then images
  const sliderMedia = useMemo(() => {
    if (!post) return [];
    const items: Media[] = [];
    if (post.video) items.push(post.video);
    if (post.images) items.push(...post.images);
    return items.length > 0 ? items : (post.media ?? []);
  }, [post]);

  const goal = Math.max(0, post?.goal_amount ?? 0);
  const current = Math.max(0, post?.current_amount ?? 0);
  const percent =
    goal > 0 ? Math.min(100, Math.round((current / goal) * 100)) : 0;

  const daysLeft = useMemo(() => {
    if (!post?.effective_end_date) return undefined;
    const end = new Date(post.effective_end_date.replace(" ", "T"));
    const diff = Math.ceil((+end - Date.now()) / (1000 * 60 * 60 * 24));
    return isFinite(diff) ? diff : undefined;
  }, [post?.effective_end_date]);

  if (!post) {
    return (
      <Container maxWidth={false}>
        <Box sx={{ py: 8 }}>Loading...</Box>
      </Container>
    );
  }

  const categoryConfig = CATEGORY_COLORS[post.category];
  const CategoryIcon = categoryConfig?.icon;

  return (
    <Container
      maxWidth={false}
      sx={{
        py: 5,
        bgcolor: "#FAFAFA",
        minHeight: "100vh",
        padding: 0,
        paddingLeft: { xs: 0, md: 0 },
        paddingRight: { xs: 0, sm: 0 },
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            mb: 3,
            display: "flex",
            alignItems: "center",
            gap: 1,
            paddingTop: 2,
          }}
        >
          <Button
            component={Link}
            href="/post"
            startIcon={<ArrowBackIosNewIcon sx={{ fontSize: 14 }} />}
            sx={{
              color: "text.secondary",
              textTransform: "none",
              fontWeight: 700,
              "&:hover": { color: "primary.main", bgcolor: "transparent" },
            }}
          >
            Back
          </Button>
        </Box>

        <Grid
          container
          spacing={4}
          alignItems="start"
          sx={{ paddingLeft: 0, paddingRight: 0 }}
        >
          {/* LEFT: card */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Box
              sx={{
                bgcolor: "common.white",
                borderRadius: 4,
                boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
                overflow: "hidden",
              }}
            >
              {/* Image Carousel */}
              <Box
                sx={{
                  position: "relative",
                  height: { xs: 420, md: 520 },
                  bgcolor: "grey.100",
                  overflow: "hidden",
                }}
              >
                {sliderMedia.length > 0 && (
                  <>
                    {sliderMedia[currentIndex].media_type?.startsWith(
                      "video/",
                    ) ? (
                      <Box
                        component="video"
                        src={`${process.env.NEXT_PUBLIC_API_URL}${sliderMedia[currentIndex].path}`}
                        controls
                        sx={{
                          position: "absolute",
                          inset: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                          bgcolor: "black",
                        }}
                      />
                    ) : (
                      <Box
                        component="img"
                        src={`${process.env.NEXT_PUBLIC_API_URL}${sliderMedia[currentIndex].path}`}
                        alt={post.post_header}
                        sx={{
                          position: "absolute",
                          inset: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          transition: "opacity 0.5s ease-in-out",
                        }}
                      />
                    )}

                    {sliderMedia.length > 1 && (
                      <>
                        {/* Prev Button */}
                        <IconButton
                          onClick={() =>
                            setCurrentIndex((prev) =>
                              prev === 0 ? sliderMedia.length - 1 : prev - 1,
                            )
                          }
                          sx={{
                            position: "absolute",
                            top: "50%",
                            left: 16,
                            transform: "translateY(-50%)",
                            bgcolor: "rgba(0,0,0,0.4)",
                            color: "white",
                            "&:hover": { bgcolor: "rgba(0,0,0,0.6)" },
                          }}
                        >
                          <ArrowBackIosNewIcon fontSize="small" />
                        </IconButton>

                        {/* Next Button */}
                        <IconButton
                          onClick={() =>
                            setCurrentIndex((prev) =>
                              prev === sliderMedia.length - 1 ? 0 : prev + 1,
                            )
                          }
                          sx={{
                            position: "absolute",
                            top: "50%",
                            right: 16,
                            transform: "translateY(-50%)",
                            bgcolor: "rgba(0,0,0,0.4)",
                            color: "white",
                            "&:hover": { bgcolor: "rgba(0,0,0,0.6)" },
                          }}
                        >
                          <ArrowBackIosNewIcon
                            fontSize="small"
                            sx={{ transform: "rotate(180deg)" }}
                          />
                        </IconButton>

                        {/* Indicator Dots */}
                        <Stack
                          direction="row"
                          spacing={1}
                          sx={{
                            position: "absolute",
                            bottom: 16,
                            left: "50%",
                            transform: "translateX(-50%)",
                          }}
                        >
                          {sliderMedia.map((_, i) => (
                            <Box
                              key={i}
                              onClick={() => setCurrentIndex(i)}
                              sx={{
                                width: 10,
                                height: 10,
                                borderRadius: "50%",
                                bgcolor:
                                  i === currentIndex
                                    ? "primary.main"
                                    : "rgba(255,255,255,0.6)",
                                cursor: "pointer",
                              }}
                            />
                          ))}
                        </Stack>
                      </>
                    )}
                  </>
                )}

                <Chip
                  icon={CategoryIcon ? <CategoryIcon /> : undefined}
                  label={categoryConfig?.label ?? post.category}
                  sx={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    fontWeight: 700,
                    textTransform: "capitalize",
                    bgcolor: categoryConfig?.color ?? "primary.main",
                    color: "white",
                    "& .MuiChip-icon": {
                      color: "white",
                    },
                  }}
                />
              </Box>

              {/* ตัวเลข + progress */}
              <Box
                sx={{
                  p: 4,
                  borderTop: "1px solid",
                  borderColor: "rgba(0,0,0,0.04)",
                }}
              >
                <Stack
                  direction="row"
                  alignItems="baseline"
                  spacing={1}
                  justifyContent="space-between"
                  sx={{ mb: 2 }}
                >
                  <Box>
                    <Typography
                      variant="h4"
                      fontWeight={900}
                      sx={{ letterSpacing: "-0.02em" }}
                    >
                      {current.toLocaleString()}{" "}
                      <Box
                        component="span"
                        sx={{
                          fontSize: 20,
                          color: "text.secondary",
                          fontWeight: 600,
                        }}
                      >
                        THB
                      </Box>
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontWeight={500}
                    >
                      raised of {goal.toLocaleString()} THB goal
                    </Typography>
                  </Box>

                  <Typography
                    variant="h5"
                    fontWeight={800}
                    color="primary.main"
                  >
                    {percent}%
                  </Typography>
                </Stack>

                <LinearProgress
                  variant="determinate"
                  value={percent}
                  sx={{
                    height: 12,
                    borderRadius: 6,
                    bgcolor: "grey.100",
                    "& .MuiLinearProgress-bar": {
                      borderRadius: 6,
                      backgroundImage:
                        "linear-gradient(90deg, #18C59B 0%, #0B9B78 100%)",
                    },
                  }}
                />
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  sx={{ mt: 2 }}
                  color="text.secondary"
                >
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <AccessTimeIcon fontSize="small" />
                    <Typography variant="body2" fontWeight={600}>
                      {daysLeft !== undefined
                        ? daysLeft < 0
                          ? "Ended"
                          : `${daysLeft} days left`
                        : "-"}
                    </Typography>
                  </Stack>
                </Stack>
              </Box>
            </Box>
          </Grid>

          {/* RIGHT: meta + actions */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Typography variant="h3" fontWeight={800} sx={{ mb: 1 }}>
              {post.post_header}
            </Typography>

            {/* author */}
            <Stack
              direction="row"
              alignItems="center"
              spacing={1.5}
              sx={{ mb: 1.5 }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  bgcolor: "#FFE6F2",
                  display: "grid",
                  placeItems: "center",
                  overflow: "hidden",
                }}
              >
                {post.user?.media?.path ? (
                  <Box
                    component="img"
                    src={`${process.env.NEXT_PUBLIC_API_URL}${post.user.media.path}`}
                    alt={post.user.username}
                    sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <PersonIcon sx={{ color: "#ff4081" }} />
                )}
              </Box>
              <Typography fontWeight={700}>
                {[post.user?.first_name, post.user?.surname]
                  .filter(Boolean)
                  .join(" ") ||
                  post.user?.username ||
                  "Unknown creator"}
              </Typography>
            </Stack>

            <Typography color="text.secondary" sx={{ mb: 2 }}>
              {post.post_description}
            </Typography>

            {/* stats */}
            <Stack spacing={1.5} sx={{ mb: 2 }}>
              <Stack direction="row" alignItems="center" spacing={1.2}>
                <GroupIcon />
                <Typography fontWeight={700}>
                  {post.supporter ?? 0} SUPPORTER
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1.2}>
                <AccessTimeIcon />
                <Typography fontWeight={700}>
                  {formatDate(post.effective_end_date)}
                </Typography>
              </Stack>
              {post.ai_label && (
                <Stack
                  direction="column"
                  sx={{ mt: 2, flexWrap: "wrap", gap: 1 }}
                >
                  {post.ai_label.success_label && (
                    <Chip
                      label={`SUCCESS RATE : ${predictionLabel(post.ai_label.success_label.toUpperCase())}`}
                      sx={{
                        width: "fit-content",
                        bgcolor: "#FFED9E",
                        fontWeight: 800,
                        color: "black",
                        borderRadius: 2,
                      }}
                    />
                  )}
                  {/* {post.ai_label.risk_label && (
                    <Chip
                      label={`RISK ${post.ai_label.risk_label.toUpperCase()}`}
                      sx={{
                        width: "fit-content",
                        bgcolor: "#FFB0B0",
                        fontWeight: 800,
                        color: "black",
                        borderRadius: 2,
                      }}
                    />
                  )} */}
                  {post.ai_label.days_to_state_label && (
                    <Chip
                      label={`DAYS TO STATE : ${post.ai_label.days_to_state_label.toUpperCase()}`}
                      sx={{
                        width: "fit-content",
                        bgcolor: "#B0E5FF",
                        fontWeight: 800,
                        color: "black",
                        borderRadius: 2,
                      }}
                    />
                  )}
                  {post.ai_label.goal_eval_label && (
                    <Chip
                      label={`GOAL EVAL : ${post.ai_label.goal_eval_label.toUpperCase()}`}
                      sx={{
                        width: "fit-content",
                        bgcolor: "#D3FFB0",
                        fontWeight: 800,
                        color: "black",
                        borderRadius: 2,
                      }}
                    />
                  )}
                </Stack>
              )}
            </Stack>

            <Stack
              direction="row"
              spacing={1.2}
              alignItems="center"
              sx={{ mb: 2.5, flexWrap: "wrap" }}
            >
              <Button
                variant="outlined"
                onClick={handleBookmarkClick}
                startIcon={
                  isBookmarked ? <BookmarkIcon /> : <BookmarkIconMini />
                }
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 700,
                  borderColor: "divider",
                  color: isBookmarked ? "primary.main" : "text.primary",
                  "&:hover": {
                    borderColor: "text.primary",
                    bgcolor: "transparent",
                  },
                }}
              >
                {isBookmarked ? "Saved" : "Save"}
              </Button>
              <IconButton
                sx={{
                  color: "#1877F2",
                  bgcolor: "rgba(24,119,242,0.08)",
                  "&:hover": { bgcolor: "rgba(24,119,242,0.15)" },
                }}
              >
                <FacebookIcon />
              </IconButton>
              <IconButton
                sx={{
                  color: "#E1306C",
                  bgcolor: "rgba(225,48,108,0.08)",
                  "&:hover": { bgcolor: "rgba(225,48,108,0.15)" },
                }}
              >
                <InstagramIcon />
              </IconButton>
              <IconButton
                sx={{
                  color: "text.secondary",
                  bgcolor: "rgba(0,0,0,0.04)",
                  "&:hover": { bgcolor: "rgba(0,0,0,0.08)" },
                }}
              >
                <ShareIcon />
              </IconButton>

              {/* Report Button (Everyone) */}
              {appUser && appUser !== post.user_id && (
                <IconButton
                  sx={{
                    color: "error.main",
                    bgcolor: "rgba(211,47,47,0.08)",
                    "&:hover": { bgcolor: "rgba(211,47,47,0.15)" },
                  }}
                  onClick={() => setOpenReportModal(true)}
                  title="Report this post"
                >
                  <ReportIcon />
                </IconButton>
              )}

              {portableReview && (
                <Button
                  variant="contained"
                  color="warning"
                  startIcon={<RateReviewIcon />}
                  onClick={() => setReviewRequest(portableReview)}
                >
                  Review Request
                </Button>
              )}
            </Stack>

            <ReviewEditRequestModal
              open={!!reviewRequest}
              onClose={() => setReviewRequest(null)}
              request={reviewRequest}
              clerkId={user?.id || ""}
            />

            <ReportModal
              open={openReportModal}
              onClose={() => setOpenReportModal(false)}
              postId={post.id}
              clerkId={user?.id || ""}
            />
            <Button
              variant="contained"
              fullWidth
              disabled={daysLeft !== undefined && daysLeft < 0}
              sx={{
                bgcolor:
                  daysLeft !== undefined && daysLeft < 0
                    ? "grey.400"
                    : "#18C59B",
                background:
                  daysLeft !== undefined && daysLeft < 0
                    ? "grey.400"
                    : "linear-gradient(45deg, #18C59B 30%, #12a884 90%)",
                color: "white",
                fontWeight: 800,
                borderRadius: 3,
                height: 60,
                fontSize: 18,
                letterSpacing: "0.02em",
                textTransform: "none",
                boxShadow:
                  daysLeft !== undefined && daysLeft < 0
                    ? "none"
                    : "0 8px 24px rgba(24, 197, 155, 0.35)",
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow:
                    daysLeft !== undefined && daysLeft < 0
                      ? "none"
                      : "0 12px 28px rgba(24, 197, 155, 0.5)",
                  transform:
                    daysLeft !== undefined && daysLeft < 0
                      ? "none"
                      : "translateY(-2px)",
                },
              }}
              onClick={() => router.push(`/payment/${id}`)}
            >
              {daysLeft !== undefined && daysLeft < 0
                ? "Campaign Ended"
                : "Contribute this Campaign"}
            </Button>
          </Grid>
        </Grid>
        <Box
          sx={{
            width: "100%",
          }}
        >
          <PostDetailTabs
            stickyTop={64}
            sections={[
              {
                key: "campaign",
                label: "Campaign",
                content: (
                  <Grid container spacing={4}>
                    <Grid size={{ xs: 12, md: 8 }}>
                      <CampaignSections
                        campaigns={post.campaigns}
                        apiBaseUrl={process.env.NEXT_PUBLIC_API_URL}
                        scrollMarginTop={100}
                        title=""
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                      <CreatorCard user={post.user} />
                    </Grid>
                  </Grid>
                ),
              },
              {
                key: "rewards",
                label: "Rewards",
                content: (
                  <Grid container spacing={4}>
                    <Grid size={{ xs: 12, md: 8 }}>
                      <RewardSections
                        rewards={post.rewards}
                        apiBaseUrl={process.env.NEXT_PUBLIC_API_URL}
                        scrollMarginTop={100}
                        title=""
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                      <CreatorCard user={post.user} />
                    </Grid>
                  </Grid>
                ),
              },
              {
                key: "progress",
                label: "Progress",
                content: (
                  <Grid container spacing={4}>
                    <Grid size={{ xs: 12, md: 8 }}>
                      <Box>
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="flex-start"
                          spacing={2}
                        >
                          {appUser && post.user_id === appUser && (
                            <Button
                              variant="contained"
                              startIcon={<AddIcon />}
                              onClick={() => {
                                setEditProgressItem(null);
                                setOpenProgressForm(true);
                              }}
                              size="small"
                              sx={{
                                bgcolor: "#18C59B",
                                color: "white",
                                fontWeight: 800,
                                borderRadius: 2,
                                px: 3,
                                py: 1,
                                textTransform: "none",
                                boxShadow:
                                  "0 4px 14px 0 rgba(24, 197, 155, 0.39)",
                                "&:hover": {
                                  bgcolor: "#12a884",
                                  boxShadow:
                                    "0 6px 20px 0 rgba(24, 197, 155, 0.23)",
                                },
                              }}
                            >
                              Add Update
                            </Button>
                          )}
                        </Stack>

                        <ProgressSection
                          items={progressItems}
                          apiBaseUrl={process.env.NEXT_PUBLIC_API_URL}
                          title=""
                          isOwner={Boolean(appUser && post.user_id === appUser)}
                          onEdit={(item) => {
                            setEditProgressItem(item);
                            setOpenProgressForm(true);
                          }}
                        />
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                      <CreatorCard user={post.user} />
                    </Grid>
                  </Grid>
                ),
              },
              {
                key: "comment",
                label: "Comment",
                content: (
                  <Grid container spacing={4}>
                    <Grid size={{ xs: 12, md: 8 }}>
                      <CommentSections
                        postId={post.id}
                        apiBaseUrl={process.env.NEXT_PUBLIC_API_URL}
                        scrollMarginTop={100}
                        title=""
                        clerkId={user?.id}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                      <CreatorCard user={post.user} />
                    </Grid>
                  </Grid>
                ),
              },
              {
                key: "community",
                label: "Community",
                content: (
                  <Box>
                    <Typography variant="h5" fontWeight={900} sx={{ mb: 1.5 }}>
                      Community
                    </Typography>
                    <Typography color="text.secondary">
                      Community posts / discussions…
                    </Typography>
                  </Box>
                ),
              },
            ]}
          />
        </Box>

        {/* Recommended Posts Section */}
        <Box sx={{ mt: 8, mb: 4, px: { xs: 2, md: 0 } }}>
          <Typography variant="h4" fontWeight={900} sx={{ mb: 4 }}>
            Recommended Campaigns
          </Typography>

          {loadingRecommendations ? (
            <LinearProgress sx={{ borderRadius: 1 }} />
          ) : recommendedPosts.length > 0 ? (
            <PostList
              posts={recommendedPosts}
              onEdit={() => {}}
              onDelete={() => {}}
            />
          ) : (
            <Typography color="text.secondary">
              No recommended campaigns found.
            </Typography>
          )}
        </Box>

        {/* Modals */}
        <ProgressForm
          open={openProgressForm}
          onClose={() => setOpenProgressForm(false)}
          postId={post.id}
          onSuccess={() => {
            fetchProgress();
            setEditProgressItem(null);
          }}
          initialData={editProgressItem}
        />
      </Container>
    </Container>
  );
}
