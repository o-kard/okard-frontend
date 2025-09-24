"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import type { PostComment } from "@/modules/post/types/post";
import {
  createComment,
  fetchComments,
  likeComment,
  unlikeComment,
} from "../../api/api";
import CommentNode from "./CommentNode";
import InlineComposer from "./InlineComposer";
import { updateNode } from "../../utils/commentHelpers";

type Props = {
  comments?: PostComment[] | null;
  postId: string;
  apiBaseUrl?: string;
  scrollMarginTop?: number;
  title?: string;
  clerkId?: string;
};

export default function CommentSections({
  postId,
  apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "",
  scrollMarginTop = 100,
  title = "Comments",
  clerkId,
}: Props) {
  const sectionRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [tree, setTree] = useState<PostComment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [text, setText] = useState("");
  const [posting, setPosting] = useState(false);

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
    load();
  }, [load]);

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
