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
            User <b>{request.requester_username || request.requester_id}</b>{" "}
            requested changes:
          </Typography>

          {request.proposed_changes && (
            <Box
              sx={{
                mb: 3,
                p: 2,
                bgcolor: "grey.100",
                borderRadius: 1,
                border: "1px solid",
                borderColor: "grey.300",
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{ mb: 1, fontWeight: "bold" }}
              >
                Proposed Changes:
              </Typography>
              {request.proposed_changes.category && (
                <Typography
                  variant="body2"
                  sx={{ display: "block", textTransform: "capitalize" }}
                >
                  • <strong>Category:</strong>{" "}
                  {request.proposed_changes.category}
                </Typography>
              )}
              {request.proposed_changes.goal_amount !== undefined && (
                <Typography variant="body2" sx={{ display: "block" }}>
                  • <strong>Goal Amount:</strong>{" "}
                  {request.proposed_changes.goal_amount}
                </Typography>
              )}
              {request.proposed_changes.effective_end_date && (
                <Typography variant="body2" sx={{ display: "block" }}>
                  • <strong>End Date:</strong>{" "}
                  {new Date(
                    request.proposed_changes.effective_end_date,
                  ).toLocaleString()}
                </Typography>
              )}
              {request.proposed_changes.rewards_payload &&
                request.proposed_changes.rewards_payload.filter(
                  (r: any) => r.isEdited || !r.id,
                ).length > 0 && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                      • Rewards:
                    </Typography>
                    {request.proposed_changes.rewards_payload
                      .filter((r: any) => r.isEdited || !r.id)
                      .map((r: any, idx: number) => (
                        <Typography
                          key={idx}
                          variant="caption"
                          sx={{
                            display: "block",
                            ml: 2,
                            color: "text.secondary",
                          }}
                        >
                          -{" "}
                          <strong>
                            {r.reward_header || "Untitled Reward"}
                          </strong>{" "}
                          ({r.reward_amount} THB)
                          {r.reward_description &&
                            ` - ${r.reward_description.substring(0, 50)}${r.reward_description.length > 50 ? "..." : ""}`}
                        </Typography>
                      ))}
                  </Box>
                )}
            </Box>
          )}

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
