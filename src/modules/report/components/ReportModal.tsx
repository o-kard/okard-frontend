import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

interface ReportModalProps {
  open: boolean;
  onClose: () => void;
  postId: string;
  clerkId: string;
}

export default function ReportModal({
  open,
  onClose,
  postId,
  clerkId,
}: ReportModalProps) {
  const [type, setType] = useState("problem");
  const [header, setHeader] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!description.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/reports/?clerk_id=${clerkId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            post_id: postId,
            type: type,
            header: header,
            description: description,
          }),
        }
      );

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.detail || "Failed to submit report");
      }

      onClose();
      setDescription("");
      setHeader("");
      alert("Report submitted successfully!");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Report Problem</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="dense">
          <InputLabel>Type</InputLabel>
          <Select
            value={type}
            label="Type"
            onChange={(e) => setType(e.target.value)}
            disabled={loading}
          >
            <MenuItem value="problem">Problem</MenuItem>
            <MenuItem value="spam">Spam</MenuItem>
            <MenuItem value="inappropriate">Inappropriate</MenuItem>
          </Select>
        </FormControl>
        <TextField
          margin="dense"
          label="Header (Optional)"
          type="text"
          fullWidth
          variant="outlined"
          value={header}
          onChange={(e) => setHeader(e.target.value)}
          disabled={loading}
        />
        <TextField
          margin="dense"
          label="Description"
          type="text"
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={loading}
          required
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
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !description.trim()}
          color="error"
        >
          {loading ? "Submitting..." : "Submit Report"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
