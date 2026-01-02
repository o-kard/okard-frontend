import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField,
  Chip,
  Stack,
  CircularProgress,
} from "@mui/material";

type Props = {
  open: boolean;
  onClose: () => void;
  request: any; // EditRequestOut
  clerkId: string;
};

export default function ReviewEditRequestModal({
  open,
  onClose,
  request,
  clerkId,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState("");

  const handleVote = async (decision: "approve" | "reject") => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/edit_requests/${request.id}/vote?clerk_id=${clerkId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ decision, comment }),
        },
      );
      if (!res.ok) {
        const err = await res.json();
        alert(`Error: ${err.detail}`);
      } else {
        alert("Vote cast successfully!");
        onClose();
        window.location.reload();
      }
    } catch (e) {
      console.error(e);
      alert("Vote failed");
    } finally {
      setLoading(false);
    }
  };

  if (!request) return null;
  console.log(request);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Review Edit Request</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <Typography variant="body2" color="text.secondary">
            User <b>{request.requester_id}</b> requested changes:
          </Typography>

          <Box sx={{ p: 2, bgcolor: "grey.100", borderRadius: 2 }}>
            <Typography
              variant="body2"
              sx={{ whiteSpace: "pre-wrap", fontFamily: "monospace" }}
            >
              {request.display_changes ||
                JSON.stringify(request.proposed_changes, null, 2)}
            </Typography>
          </Box>

          <TextField
            label="Comment (Optional)"
            fullWidth
            multiline
            rows={2}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Close
        </Button>
        <Button
          onClick={() => handleVote("reject")}
          color="error"
          variant="outlined"
          disabled={loading}
        >
          Reject
        </Button>
        <Button
          onClick={() => handleVote("approve")}
          color="success"
          variant="contained"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Approve"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
