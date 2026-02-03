import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
} from "@mui/material";

interface EditRequestModalProps {
  open: boolean;
  onClose: () => void;
  postId: string;
  clerkId: string;
  proposedChanges?: any;
}

export default function EditRequestModal({
  open,
  onClose,
  postId,
  clerkId,
  proposedChanges,
}: EditRequestModalProps) {
  const [description, setDescription] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!description.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const finalProposed = JSON.parse(JSON.stringify(proposedChanges || {}));

      if (proposedChanges?.files_map && finalProposed.rewards_payload) {
        const uploadPromises = Object.entries(proposedChanges.files_map).map(
          async ([key, file]) => {
            const fileObj = file as File;
            const order = key.replace("reward_", "");

            // Upload
            const fd = new FormData();
            fd.append("file", fileObj);
            fd.append("post_id", postId);
            fd.append("clerk_id", clerkId);

            const res = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/api/image/upload`,
              {
                method: "POST",
                body: fd,
              },
            );

            if (!res.ok) throw new Error("Failed to upload image");
            const imgData = await res.json();

            return { order, image_id: imgData.id, image_path: imgData.path };
          },
        );

        const uploadedImages = await Promise.all(uploadPromises);

        finalProposed.rewards_payload = finalProposed.rewards_payload.map(
          (r: any) => {
            const match = uploadedImages.find(
              (u) => String(u.order) === String(r.display_order),
            );
            if (match) {
              return { ...r, image_id: match.image_id };
            }
            return r;
          },
        );

        delete finalProposed.files_map;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/edit_requests/?clerk_id=${clerkId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            post_id: postId,
            description: description,
            proposed_changes: finalProposed,
            expires_at: expiresAt ? new Date(expiresAt).toISOString() : null,
          }),
        },
      );

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.detail || "Failed to submit request");
      }

      onClose();
      setDescription("");
      alert("Edit request submitted successfully!");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Request to Edit Post</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Describe what you want to change. Top 11 contributors will vote on
          this request.
        </Typography>
        <TextField
          autoFocus
          margin="dense"
          label="Description of changes"
          type="text"
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={loading}
        />
        <TextField
          margin="dense"
          label="Expiration Date (Optional, default 3 days)"
          type="datetime-local"
          fullWidth
          variant="outlined"
          value={expiresAt}
          onChange={(e) => setExpiresAt(e.target.value)}
          disabled={loading}
          sx={{ mt: 2 }}
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
        />
        {error && (
          <Typography color="error" variant="caption">
            {error}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {loading ? "Submitting..." : "Submit Request"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
