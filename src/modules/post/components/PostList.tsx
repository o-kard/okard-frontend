import { Post } from "../types/post";
import Link from "next/link";
import { Box, Typography, Tooltip, IconButton } from "@mui/material";
import Grid from "@mui/material/Grid";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

type Props = {
  posts: Post[];
  onEdit: (post: Post) => void;
  onDelete: (id: string) => void;
};

export default function PostList({ posts, onEdit, onDelete }: Props) {
  return (
    <Grid container spacing={2}>
      {posts.map((post) => (
        <Grid key={post.id} size={{ xs: 12, md: 4 }}>
          <Box
            sx={{
              border: "1px solid #ccc",
              borderRadius: 2,
              boxShadow: 1,
              "&:hover": { boxShadow: 4 },
              display: "flex",
              flexDirection: "column",
              height: "100%",
              overflow: "hidden",
            }}
          >
            {post.images && post.images.length > 0 && (
              <Box
                component="img"
                src={`${process.env.NEXT_PUBLIC_API_URL}${post.images[0].path}`}
                alt={post.post_header}
                sx={{
                  height: 200,
                  width: "100%",
                  objectFit: "cover",
                }}
              />
            )}

            <Box
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                flexGrow: 1,
              }}
            >
              <Typography variant="h6" gutterBottom>
                {post.post_header}
              </Typography>
              <Typography variant="body2" sx={{ flexGrow: 1 }}>
                {post.post_description}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 1 }}
              >
                {post.goal_amount.toLocaleString()} THB
              </Typography>

              <Box display="flex" justifyContent="center" gap={1} mr={1}>
                <Link href={`/post/show/${post.id}`}>
                  <Tooltip title="View">
                    <IconButton color="success">
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                </Link>

                <Link href={`/post/edit/${post.id}`}>
                  <Tooltip title="Edit">
                    <IconButton color="primary">
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                </Link>

                <Tooltip title="Delete">
                  <IconButton color="error" onClick={() => onDelete(post.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
}
