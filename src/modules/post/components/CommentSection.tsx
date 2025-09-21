"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
  Tooltip,
  Avatar,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ReplyIcon from "@mui/icons-material/Reply";
import SendIcon from "@mui/icons-material/Send";
import type { PostComment } from "@/modules/post/types/post";
import {
  createComment,
  fetchComments,
  likeComment,
  unlikeComment,
} from "../api/api";

// ===== helpers =====
const formatDate = (dateStr?: string) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  try {
    return new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    }).format(d);
  } catch {
    return dateStr;
  }
};

const truncate = (s: string, len: number) =>
  s.length <= len ? s : s.slice(0, len - 1) + "…";

function updateNode(
  nodes: PostComment[],
  id: string,
  update: (n: PostComment) => PostComment
): PostComment[] {
  return nodes.map((n) => {
    if (String(n.id) === String(id)) return update(n);

    const kids: PostComment[] = Array.isArray(n.children) ? n.children : [];
    return kids.length ? { ...n, children: updateNode(kids, id, update) } : n;
  });
}

// Text Input + Send Button
type InlineComposerProps = {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  submitting?: boolean;
  autoFocus?: boolean;
};

function InlineComposer({
  value,
  onChange,
  onSubmit,
  placeholder = "Write a comment…",
  submitting,
  autoFocus,
}: InlineComposerProps) {
  const disabled = submitting || !value.trim();
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={1}
      alignItems={{ sm: "center" }}
    >
      <TextField
        fullWidth
        multiline
        minRows={1}
        maxRows={6}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        onKeyDown={(e) => {
          if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && !disabled) {
            onSubmit();
          }
        }}
      />
      <Button
        variant="contained"
        endIcon={submitting ? <CircularProgress size={16} /> : <SendIcon />}
        disabled={disabled}
        onClick={onSubmit}
        sx={{ fontWeight: 800 }}
      >
        Send
      </Button>
    </Stack>
  );
}

// ตัว Comment Node (มี children ได้)
type CommentNodeProps = {
  node: PostComment;
  depth?: number;
  onToggleLike: (id: string, isLiked: boolean) => Promise<void>;
  onReply: (parentId: string, text: string) => Promise<void>;
  scrollMarginTop?: number;
  apiBaseUrl: string;
};

function CommentNode({
  node,
  depth = 0,
  onToggleLike,
  onReply,
  scrollMarginTop = 100,
  apiBaseUrl,
}: CommentNodeProps) {
  const isLiked = Boolean(node.is_liked);
  const likeCount = node.likes ?? 0;
  const hasChildren = Array.isArray(node.children) && node.children.length > 0;
  const canReply = depth === 0;

  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitReply = async () => {
    if (!replyText.trim()) return;
    try {
      setSubmitting(true);
      await onReply(String(node.id), replyText.trim());
      setReplyText("");
      setReplyOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      id={`c-${node.id}`}
      sx={{
        pl: { xs: depth ? 2 : 0, md: depth ? 3 : 0 },
        borderLeft: depth ? "2px solid rgba(0,0,0,0.08)" : "none",
        scrollMarginTop,
      }}
    >
      <Stack spacing={1}>
        <Box
          sx={{
            p: 2.5,
            border: "1px solid #3b3b3bff",
            borderRadius: 6,
            bgcolor: "background.paper",
          }}
        >
          {/* header */}
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            color="text.secondary"
          >
            <Avatar
              src={
                node.author.image?.path
                  ? `${apiBaseUrl}${node.author.image?.path}`
                  : undefined
              }
              alt={node.author?.username || String(node.user_id)}
              sx={{
                width: 28,
                height: 28,
                bgcolor: "#FFE6F2",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              {(node.author?.username ?? String(node.user_id))
                .slice(0, 2)
                .toUpperCase()}
            </Avatar>
            <Typography variant="caption">{node.author.username}</Typography>
            <Typography variant="caption">
              {formatDate(node.created_at)}
            </Typography>
          </Stack>

          {/* content */}
          <Typography sx={{ whiteSpace: "pre-line" }}>
            {(node as any).content}
          </Typography>

          <Stack direction="row" spacing={1} alignItems="center">
            {/* Like */}
            <Tooltip title={isLiked ? "Unlike" : "Like"}>
              <IconButton
                size="small"
                color={isLiked ? "error" : "default"}
                onClick={() => onToggleLike(String(node.id), isLiked)}
              >
                {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              </IconButton>
            </Tooltip>
            <Typography variant="body2" color="text.secondary">
              {likeCount}
            </Typography>

            {/* Reply */}
            {canReply && (
              <Tooltip title={replyOpen ? "Cancel" : "Reply"}>
                <span>
                  <IconButton
                    size="small"
                    onClick={() => setReplyOpen((v) => !v)}
                  >
                    <ReplyIcon />
                  </IconButton>
                </span>
              </Tooltip>
            )}
          </Stack>

          {canReply && replyOpen && (
            <Box sx={{ mt: 1 }}>
              <InlineComposer
                value={replyText}
                onChange={setReplyText}
                onSubmit={handleSubmitReply}
              />
            </Box>
          )}
        </Box>
      </Stack>

      {/* children */}
      {hasChildren && (
        <Stack spacing={3} sx={{ mt: 2 }}>
          {(node.children as PostComment[]).map((child) => (
            <CommentNode
              key={String(child.id)}
              node={child}
              depth={depth + 1}
              onToggleLike={onToggleLike}
              onReply={onReply}
              scrollMarginTop={scrollMarginTop}
              apiBaseUrl={apiBaseUrl}
            />
          ))}
        </Stack>
      )}
    </Box>
  );
}

type Props = {
  comments?: PostComment[] | null;
  postId: string;
  apiBaseUrl?: string;
  scrollMarginTop?: number;
  title?: string;
  clerkId?: string;
};

export default function CommentSections({
  comments,
  postId,
  apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "",
  scrollMarginTop = 100,
  title = "Comments",
  clerkId,
}: Props) {
  const parents = useMemo(() => comments ?? [], [comments]);

  const sectionRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [tree, setTree] = useState<PostComment[]>(comments ?? []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [text, setText] = useState("");
  const [posting, setPosting] = useState(false);

  useEffect(() => setTree(parents), [parents]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute("data-idx") || "0");
            setActiveIdx(idx);
          }
        });
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: [0, 0.2, 0.5, 1] }
    );

    sectionRefs.current.forEach((node, i) => {
      if (node) {
        node.setAttribute("data-idx", String(i));
        observer.observe(node);
      }
    });

    return () => observer.disconnect();
  }, [tree.length]);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchComments(postId, clerkId ?? null);
      setTree(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load comments");
    } finally {
      setLoading(false);
    }
  }, [postId, clerkId]);

  useEffect(() => {
    if (comments && comments.length) {
      setTree(comments);
    } else {
      load();
    }
  }, [comments, load]);

  const toggleLike = async (id: string, isLiked: boolean) => {
    try {
      if (!apiBaseUrl || !clerkId) return;
      const resp = isLiked
        ? await unlikeComment(id, clerkId)
        : await likeComment(id, clerkId);

      setTree((prev) =>
        updateNode(prev, id, (n) => ({
          ...n,
          likes: resp.likes ?? n.likes,
          is_liked: resp.is_liked ?? !isLiked,
        }))
      );
    } catch (e) {
      console.error("toggleLike error", e);
    }
  };

  const postComment = async (content: string, parentId?: string) => {
    if (!apiBaseUrl) return;

    const fd = new FormData();
    const qs = clerkId ? `?clerk_id=${encodeURIComponent(clerkId)}` : "";
    const payload = {
      content: content.trim(),
      post_id: postId,
      parent_id: parentId ?? null,
    };
    fd.append("data", JSON.stringify(payload));

    const res = await createComment(fd, clerkId || "");

    console.log(res);
    console.log(typeof res);

    const json = res as PostComment;

    if (parentId) {
      setTree((prev) =>
        updateNode(prev, parentId, (n) => {
          const kids = (n.children as PostComment[] | null | undefined) ?? [];
          return { ...n, children: [...kids, { ...json, children: [] }] };
        })
      );
    } else {
      setTree((prev) => [{ ...json, children: [] }, ...prev]);
    }
  };

  const onSubmit = async () => {
    if (!text.trim()) return;
    try {
      setPosting(true);
      await postComment(text);
      setText("");
    } finally {
      setPosting(false);
    }
  };

  return (
    <Box sx={{ mt: 4, px: 4 }}>
      {title && (
        <Typography variant="h4" fontWeight={900} sx={{ mb: 2 }}>
          {title}
        </Typography>
      )}

      <Box sx={{ mb: 3 }}>
        {clerkId && (
          <InlineComposer
            value={text}
            onChange={setText}
            onSubmit={onSubmit}
            submitting={posting}
            placeholder="Write a comment… (Ctrl+Enter to send)"
          />
        )}
      </Box>

      <Grid container spacing={3} alignItems="flex-start">
        <Grid size={{ xs: 12, md: 9 }}>
          {loading && (
            <Typography color="text.secondary">Loading comments…</Typography>
          )}
          {error && <Typography color="error">{error}</Typography>}
          {!loading && !error && tree.length === 0 ? (
            <Typography color="text.secondary">
              Be the first to comment.
            </Typography>
          ) : (
            <Stack spacing={4}>
              {tree.map((c, i) => (
                <Box
                  key={String(c.id) ?? `sec-${i}`}
                  id={`parent-${c.id}`}
                  component="div"
                  ref={(el) => {
                    sectionRefs.current[i] = el as HTMLDivElement | null;
                  }}
                  sx={{ scrollMarginTop }}
                >
                  <CommentNode
                    node={c}
                    onToggleLike={toggleLike}
                    onReply={(pid, text) => postComment(text, pid)}
                    scrollMarginTop={scrollMarginTop}
                    apiBaseUrl={apiBaseUrl}
                  />
                  {i < tree.length - 1}
                </Box>
              ))}
            </Stack>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
