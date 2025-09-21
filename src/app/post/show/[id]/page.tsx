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
import CommentSections from "@/modules/post/components/CommentSection";
import { useUser } from "@clerk/nextjs";

export default function PostDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [post, setPost] = useState<Post | null>(null);
  const router = useRouter();
  const { user } = useUser();

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
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/post/${id}`)
      .then((r) => r.json())
      .then(setPost);
  }, [id]);

  const imgSrc = useMemo(
    () =>
      post?.images?.[0]?.path
        ? `${process.env.NEXT_PUBLIC_API_URL}${post.images[0].path}`
        : undefined,
    [post]
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
            <Box
              sx={{
                position: "relative",
                height: { xs: 420, md: 520 },
                bgcolor: "grey.100",
              }}
            >
              {imgSrc && (
                <Box
                  component="img"
                  src={imgSrc}
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
              <Box
                sx={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 0,
                  height: 0,
                  borderTop: "12px solid transparent",
                  borderBottom: "12px solid transparent",
                  borderLeft: "18px solid #10b981",
                  opacity: 0.9,
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
          </Stack>

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
                  <Typography variant="h5" fontWeight={900} sx={{ mb: 1.5 }}>
                    Progress
                  </Typography>
                  <Typography color="text.secondary">
                    Updates or milestones go here…
                  </Typography>
                </Box>
              ),
            },
            {
              key: "comment",
              label: "Comment",
              content: (
                <CommentSections
                  comments={post.comments}
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
