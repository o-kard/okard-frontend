import { useState } from "react";
import { CampaignComment } from "../../types/campaign";
import { Avatar, Box, IconButton, Stack, Tooltip, Typography } from "@mui/material";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ReplyIcon from "@mui/icons-material/Reply";
import InlineComposer from "./InlineComposer";
import { formatDate } from "../../utils/commentHelpers";
import { resolveMediaUrl } from "@/utils/mediaUrl";

type CommentNodeProps = {
  node: CampaignComment;
  depth?: number;
  onToggleLike: (id: string, isLiked: boolean) => Promise<void>;
  onReply: (parentId: string, text: string) => Promise<void>;
  scrollMarginTop?: number;
  apiBaseUrl: string;
};

export default function CommentNode({
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
                node.author.media?.path
                  ? resolveMediaUrl(node.author.media?.path)
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

          {/* composer */}
          {replyOpen && (
            <Box sx={{ mt: 2 }}>
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
        <Stack spacing={3} sx={{ mt: 2, ml: { xs: 2, md: 3 } }}>
          {(node.children as CampaignComment[]).map((child) => (
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