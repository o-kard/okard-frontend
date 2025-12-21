"use client";
import { useEffect, useMemo, useState } from "react";
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
import CloseIcon from "@mui/icons-material/Close";

import { Post } from "@/modules/post/types/post";
import PostDetailTabs from "@/modules/post/components/PostDetailTabs";
import CampaignSections from "@/modules/post/components/CampaginSection";
import RewardSections from "@/modules/post/components/RewardSection";
import CommentSections from "@/modules/post/components/comment/CommentSection";
import { useUser } from "@clerk/nextjs";
import EditRequestModal from "@/modules/edit_request/components/EditRequestModal";
import ReportModal from "@/modules/report/components/ReportModal";
import EditIcon from "@mui/icons-material/Edit";
import ReportIcon from "@mui/icons-material/Report";
import { getUserById } from "@/modules/user/api/api";
import ReviewEditRequestModal from "@/modules/edit_request/components/ReviewEditRequestModal";
import RateReviewIcon from "@mui/icons-material/RateReview";
import ProgressForm from "@/modules/progress/components/ProgressForm";
import ProgressSection from "@/modules/progress/components/ProgressSection";
import { getProgressByPostId } from "@/modules/progress/api/api";
import { Progress } from "@/modules/progress/types";
import AddIcon from "@mui/icons-material/Add";

export default function PostDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [post, setPost] = useState<Post | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();
  const { user } = useUser();
  const [appUser, setAppUser] = useState<{ id: string } | null>(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openReportModal, setOpenReportModal] = useState(false);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [reviewRequest, setReviewRequest] = useState<any>(null);

  // Progress
  const [progressItems, setProgressItems] = useState<Progress[]>([]);
  const [openProgressForm, setOpenProgressForm] = useState(false);

  const fetchProgress = () => {
    if (!id) return;
    getProgressByPostId(id)
      .then(setProgressItems)
      .catch((err) => console.error("Failed to fetch progress", err));
  };

  useEffect(() => {
    if (user?.id) {
      getUserById(user.id).then((u) => setAppUser(u));
    }
  }, [user?.id]);

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
      req.approvers?.some((app: any) => app.user_id === appUser.id),
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

    const clerkId = user?.id;

    const url = clerkId
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/post/${id}?clerk_id=${clerkId}`
      : `${process.env.NEXT_PUBLIC_API_URL}/api/post/${id}`;

    fetch(url)
      .then((r) => r.json())
      .then(setPost)
      .catch(console.error);
  }, [id, user?.id]);

  const imgSrc = useMemo(
    () =>
      post?.images?.[0]?.path
        ? `${process.env.NEXT_PUBLIC_API_URL}${post.images[0].path}`
        : undefined,
    [post],
  );

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

  return (
    <Container
      maxWidth={false}
      sx={{
        py: 5,
        bgcolor: "#fff8de",
        padding: 0,
        paddingLeft: { xs: 0, md: 0 },
        paddingRight: { xs: 0, sm: 0 },
      }}
    >
      <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
        <ArrowBackIosNewIcon fontSize="small" />
        <Typography
          component={Link}
          href="/post"
          sx={{ color: "inherit", textDecoration: "none" }}
        >
          Back
        </Typography>
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
              borderRadius: 3,
              boxShadow: 1,
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
              {post.images && post.images.length > 0 && (
                <>
                  <Box
                    component="img"
                    src={`${process.env.NEXT_PUBLIC_API_URL}${post.images[currentIndex].path}`}
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

                  {/* Prev Button */}
                  <IconButton
                    onClick={() =>
                      setCurrentIndex((prev) =>
                        prev === 0 ? post.images!.length - 1 : prev - 1,
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
                        prev === post.images!.length - 1 ? 0 : prev + 1,
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
                    {post.images.map((_, i) => (
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

              <Chip
                label={post.category}
                color="primary"
                sx={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  fontWeight: 700,
                }}
              />
            </Box>

            {/* ตัวเลข + progress */}
            <Box sx={{ p: 3, borderTop: "1px solid", borderColor: "grey.200" }}>
              <Stack
                direction="row"
                alignItems="center"
                spacing={2}
                justifyContent="space-between"
                sx={{ mb: 1 }}
              >
                <Typography variant="h5" fontWeight={800}>
                  {goal.toLocaleString()} THB
                </Typography>
                <Box
                  sx={{
                    ml: "auto",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    color: "text.secondary",
                  }}
                >
                  <Box
                    sx={{
                      width: 18,
                      height: 18,
                      borderRadius: 1,
                      border: "2px solid",
                      borderColor: "grey.600",
                    }}
                  />
                  <Typography variant="body2">
                    {current.toLocaleString()} THB
                  </Typography>
                </Box>
              </Stack>

              <LinearProgress
                variant="determinate"
                value={percent}
                sx={{
                  height: 10,
                  borderRadius: 999,
                  bgcolor: "grey.200",
                  "& .MuiLinearProgress-bar": { borderRadius: 999 },
                }}
              />
              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{ mt: 1.2 }}
                color="text.secondary"
              >
                <Typography variant="caption">
                  {current.toLocaleString()} THB raised
                </Typography>
                <Typography variant="caption">
                  {daysLeft ?? "-"} days left
                </Typography>
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
              }}
            >
              <PersonIcon fontSize="small" />
            </Box>
            <Typography fontWeight={700}>Mia Roberts</Typography>
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
            <Chip
              label={`SUCCESS RATE ${percent}%`}
              sx={{
                width: "fit-content",
                bgcolor: "#FFED9E",
                fontWeight: 800,
                color: "black",
                borderRadius: 2,
              }}
            />
          </Stack>

          <Stack
            direction="row"
            spacing={1.2}
            alignItems="center"
            sx={{ mb: 2.5, flexWrap: "wrap" }}
          >
            <Button variant="outlined" startIcon={<BookmarkIconMini />}>
              Remind Me
            </Button>
            <IconButton sx={{ bgcolor: "#e7f0ff" }}>
              <Typography>f</Typography>
            </IconButton>
            <IconButton sx={{ bgcolor: "#ffe7f0" }}>
              <InstagramIcon />
            </IconButton>
            <IconButton sx={{ bgcolor: "#f1f1f1" }}>
              <CloseIcon />
            </IconButton>
            <IconButton sx={{ bgcolor: "#f1f1f1" }}>
              <ShareIcon />
            </IconButton>

            {/* Edit Button (Owner Only) */}
            {appUser && post.user_id === appUser.id && (
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => setOpenEditModal(true)}
                color="primary"
              >
                Edit
              </Button>
            )}

            {/* Report Button (Everyone) */}
            <IconButton
              sx={{ bgcolor: "#fff0f0", color: "error.main" }}
              onClick={() => setOpenReportModal(true)}
              title="Report this post"
            >
              <ReportIcon />
            </IconButton>

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

          <EditRequestModal
            open={openEditModal}
            onClose={() => setOpenEditModal(false)}
            postId={post.id}
            clerkId={user?.id || ""}
            proposedChanges={undefined}
          />

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
            sx={{
              bgcolor: "#18C59B",
              color: "white",
              fontWeight: 800,
              borderRadius: 2,
              height: 56,
              fontSize: 18,
              letterSpacing: "0.06em",
              textTransform: "none",
              "&:hover": { bgcolor: "#12a884" },
            }}
            onClick={() => router.push(`/payment/${id}`)}
          >
            Contribute this Campaign
          </Button>

          <Box component="ul" sx={{ pl: 2, mt: 3, color: "text.secondary" }}>
            <li>
              Created at:{" "}
              {formatDate((post as any).created_at ?? post.created_at)}
            </li>
            <li>End: {formatDate(post.effective_end_date)}</li>
            <li>Category: {post.category}</li>
            <li>
              Status: {post.status} | State: {post.state}
            </li>
          </Box>
        </Grid>
      </Grid>
      <Box
        sx={{
          bgcolor: "white",
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
                <CampaignSections
                  campaigns={post.campaigns}
                  apiBaseUrl={process.env.NEXT_PUBLIC_API_URL}
                  scrollMarginTop={100}
                  title=""
                />
              ),
            },
            {
              key: "rewards",
              label: "Rewards",
              content: (
                <RewardSections
                  rewards={post.rewards}
                  apiBaseUrl={process.env.NEXT_PUBLIC_API_URL}
                  scrollMarginTop={100}
                  title=""
                />
              ),
            },
            {
              key: "progress",
              label: "Progress",
              content: (
                <Box>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ mb: 1.5 }}
                  >
                    <Typography variant="h5" fontWeight={900}>
                      Progress
                    </Typography>
                    {appUser && post.user_id === appUser.id && (
                      <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setOpenProgressForm(true)}
                        size="small"
                      >
                        Add Update
                      </Button>
                    )}
                  </Stack>

                  <ProgressSection
                    items={progressItems}
                    apiBaseUrl={process.env.NEXT_PUBLIC_API_URL}
                    title=""
                  />
                </Box>
              ),
            },
            {
              key: "comment",
              label: "Comment",
              content: (
                <CommentSections
                  postId={post.id}
                  apiBaseUrl={process.env.NEXT_PUBLIC_API_URL}
                  scrollMarginTop={100}
                  title=""
                  clerkId={user?.id}
                />
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

      {/* Modals */}
      <ProgressForm
        open={openProgressForm}
        onClose={() => setOpenProgressForm(false)}
        postId={post.id}
        onSuccess={fetchProgress}
      />
    </Container>
  );
}

function BookmarkIconMini() {
  return (
    <Box
      component="span"
      sx={{
        width: 16,
        height: 16,
        display: "inline-block",
        border: "2px solid currentColor",
        borderRadius: "4px",
        position: "relative",
      }}
    >
      <Box
        component="span"
        sx={{
          position: "absolute",
          left: "50%",
          top: "42%",
          width: 0,
          height: 0,
          transform: "translate(-50%,-50%)",
          borderTop: "6px solid currentColor",
          borderLeft: "4px solid transparent",
          borderRight: "4px solid transparent",
        }}
      />
    </Box>
  );
}
