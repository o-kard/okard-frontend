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
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Box,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";

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
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!description.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("post_id", postId);
      formData.append("type", type);
      if (header) formData.append("header", header);
      formData.append("description", description);

      files.forEach((file) => {
        formData.append("files", file);
      });

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/reports/?clerk_id=${clerkId}`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.detail || "Failed to submit report");
      }

      onClose();
      setDescription("");
      setHeader("");
      setFiles([]);
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

        <Box sx={{ mt: 2, mb: 1 }}>
          <Button
            component="label"
            variant="outlined"
            startIcon={<CloudUploadIcon />}
            disabled={loading}
          >
            Upload Images
            <input
              type="file"
              hidden
              multiple
              accept="image/*"
              onChange={(e) => {
                if (e.target.files) {
                  setFiles((prev) => [
                    ...prev,
                    ...Array.from(e.target.files || []),
                  ]);
                }
              }}
            />
          </Button>

          <List dense>
            {files.map((file, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={file.name}
                  secondary={`${(file.size / 1024).toFixed(2)} KB`}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() =>
                      setFiles((prev) => prev.filter((_, i) => i !== index))
                    }
                    disabled={loading}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Box>
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
