import { useEffect, useState } from "react";
import { Post } from "../types/post";
import { TextField, MenuItem, Button } from "@mui/material";
import Grid from "@mui/material/Grid";

type Props = {
  editItem: Post | null;
  onSubmit: (
    data: Omit<Post, "id" | "user_id">,
    editId?: string,
    files?: File[]
  ) => void;
  onCancel: () => void;
};

export default function PostForm({ editItem, onSubmit, onCancel }: Props) {
  const [header, setHeader] = useState("");
  const [desc, setDesc] = useState("");
  const [goal, setGoal] = useState(0);
  const [files, setFiles] = useState<File[]>([]);
  const [state, setState] = useState<Post["state"] | "">("");
  const [status, setStatus] = useState<Post["status"] | "">("");
  const [category, setCategory] = useState<Post["category"] | "">("");

  useEffect(() => {
    if (editItem) {
      setHeader(editItem.post_header);
      setDesc(editItem.post_description || "");
      setGoal(editItem.goal_amount);
      setState(editItem.state);
      setStatus(editItem.status);
      setCategory(editItem.category);
    }
  }, [editItem]);

  const handleSubmit = () => {
    const payload: Omit<Post, "id" | "user_id" | "images"> = {
      post_header: header,
      post_description: desc,
      goal_amount: goal,
      current_amount: editItem?.current_amount ?? 0,
      supporter: editItem?.supporter ?? 0,
      create_at: new Date().toISOString(),
      effective_start_from: new Date().toISOString(),
      effective_end_date: new Date().toISOString(),
      state: state as Post["state"],
      status: status as Post["status"],
      category: category as Post["category"],
    };

    onSubmit(payload, editItem?.id, files);

    setHeader("");
    setDesc("");
    setGoal(0);
    setFiles([]);
    setState("draft");
    setStatus("active");
    setCategory("tech");
  };

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 12 }}>
        <TextField
          label="Post Header"
          fullWidth
          value={header}
          onChange={(e) => setHeader(e.target.value)}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 12 }}>
        <TextField
          label="Goal Amount"
          type="text"
          fullWidth
          value={goal}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d*$/.test(value)) {
              setGoal(Number(value));
            }
          }}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 12 }}>
        <TextField
          select
          label="State"
          fullWidth
          value={state}
          onChange={(e) => setState(e.target.value as Post["state"])}
        >
          <MenuItem value="" disabled>
            Select state
          </MenuItem>
          <MenuItem value="draft">Draft</MenuItem>
          <MenuItem value="published">Published</MenuItem>
          <MenuItem value="archived">Archived</MenuItem>
        </TextField>
      </Grid>

      <Grid size={{ xs: 12, md: 12 }}>
        <TextField
          select
          label="Status"
          fullWidth
          value={status}
          onChange={(e) => setStatus(e.target.value as Post["status"])}
        >
          <MenuItem value="" disabled>
            Select status
          </MenuItem>
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="inactive">Inactive</MenuItem>
        </TextField>
      </Grid>

      <Grid size={{ xs: 12, md: 12 }}>
        <TextField
          select
          label="Category"
          fullWidth
          value={category}
          onChange={(e) => setCategory(e.target.value as Post["category"])}
        >
          <MenuItem value="" disabled>
            Select category
          </MenuItem>
          <MenuItem value="tech">Tech</MenuItem>
          <MenuItem value="education">Education</MenuItem>
          <MenuItem value="health">Health</MenuItem>
          <MenuItem value="other">Other</MenuItem>
        </TextField>
      </Grid>

      <Grid size={{ xs: 12 }}>
        <TextField
          label="Description"
          multiline
          rows={4}
          fullWidth
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <Button variant="outlined" component="label" fullWidth>
          Upload Images
          <input
            type="file"
            hidden
            multiple
            accept="image/*"
            onChange={(e) => setFiles(Array.from(e.target.files || []))}
          />
        </Button>
      </Grid>

      <Grid size={{ xs: 12 }} display="flex" gap={2}>
        <Button variant="contained" color="success" onClick={handleSubmit}>
          {editItem ? "Update" : "Create"}
        </Button>
        <Button variant="outlined" onClick={onCancel}>
          Cancel
        </Button>
      </Grid>
    </Grid>
  );
}
