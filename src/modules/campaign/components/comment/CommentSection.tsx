"use client";

import { useState } from "react";
import {
  Box,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import type { CampaignComment } from "@/modules/campaign/types/campaign";
import CommentNode from "./CommentNode";
import InlineComposer from "./InlineComposer";
import { useComments } from "../../hooks/useComments";
import { useCommentActions } from "../../hooks/useCommentActions";

type Props = {
  comments?: CampaignComment[] | null;
  campaignId: string;
  campaignOwnerId?: string;
  apiBaseUrl?: string;
  scrollMarginTop?: number;
  title?: string;
  clerkId?: string;
};

export default function CommentSections({
  campaignId,
  apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "",
  scrollMarginTop = 100,
  title = "Comments",
  clerkId,
}: Props) {
  const [text, setText] = useState("");
  const [posting, setPosting] = useState(false);

  const { tree, setTree, loading, error, reload } = useComments(campaignId, clerkId);
  const { toggleLike, campaignComment } = useCommentActions(setTree, campaignId, clerkId, apiBaseUrl);

  const onSubmit = async () => {
    if (!text.trim()) return;
    try {
      setPosting(true);
      await campaignComment(text);
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
                  sx={{ scrollMarginTop }}
                >
                  <CommentNode
                    node={c}
                    onToggleLike={toggleLike}
                    onReply={(pid, text) => campaignComment(text, pid)}
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
