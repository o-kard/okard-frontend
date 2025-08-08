"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Post } from "@/modules/post/types/post";
import { Container, Typography, Box, Divider } from "@mui/material";

export default function PostDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/post/${id}`)
      .then((res) => res.json())
      .then((data) => setPost(data));
  }, [id]);

  if (!post)
    return (
      <Container maxWidth="sm">
        <Box mt={6}>Loading...</Box>
      </Container>
    );

  return (
    <Container maxWidth="sm">
      <Box mt={6} mb={4}>
        {post.images && post.images.length > 0 && (
          <Box
            component="img"
            src={`${process.env.NEXT_PUBLIC_API_URL}${post.images[0].path}`}
            alt={post.post_header}
            sx={{
              width: "100%",
              height: 256,
              objectFit: "cover",
              borderRadius: 2,
              mb: 2,
            }}
          />
        )}

        <Typography variant="h4" fontWeight="bold" gutterBottom>
          {post.post_header}
        </Typography>

        <Typography variant="body1" whiteSpace="pre-line">
          {post.post_description}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Box component="ul" sx={{ pl: 2 }}>
          <li>🎯 Goal Amount: {post.goal_amount.toLocaleString()} THB</li>
          <li>💰 Current: {post.current_amount.toLocaleString()} THB</li>
          <li>🙌 Supporters: {post.supporter ?? 0}</li>
          <li>📅 Created at: {new Date(post.create_at).toLocaleString()}</li>
          <li>
            🗓️ Start: {new Date(post.effective_start_from).toLocaleString()}
          </li>
          <li>🗓️ End: {new Date(post.effective_end_date).toLocaleString()}</li>
          <li>
            📌 Category: <strong>{post.category}</strong>
          </li>
          <li>
            📈 Status: <strong>{post.status}</strong>
          </li>
          <li>
            📝 State: <strong>{post.state}</strong>
          </li>
        </Box>
      </Box>
    </Container>
  );
}
