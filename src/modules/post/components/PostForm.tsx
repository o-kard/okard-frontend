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

const categoryOptions = [
  { value: "tech", label: "Technology" },
  { value: "education", label: "Education" },
  { value: "health", label: "Health & Wellness" },
  { value: "other", label: "Other" },
];

const toLocalInputValue = (iso?: string | null): string => {
  if (!iso) return "";
  const d = new Date(iso);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
};

const toIso = (local: string): string | null => {
  return local ? new Date(local).toISOString() : null;
};

export default function PostForm({ editItem, onSubmit, onCancel }: Props) {
  const [header, setHeader] = useState("");
  const [desc, setDesc] = useState("");
  const [goal, setGoal] = useState<number | "">("");
  const [files, setFiles] = useState<File[]>([]);
  const [state, setState] = useState<Post["state"] | "">("");
  const [status, setStatus] = useState<Post["status"] | "">("");
  const [category, setCategory] = useState<Post["category"] | "">("");
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");

  useEffect(() => {
    if (editItem) {
      setHeader(editItem.post_header);
      setDesc(editItem.post_description || "");
      setGoal(editItem.goal_amount);
      setState(editItem.state);
      setStatus(editItem.status);
      setCategory(editItem.category);
      setStartAt(toLocalInputValue(editItem?.effective_start_from));
      setEndAt(toLocalInputValue(editItem?.effective_end_date));
    }
  }, [editItem]);

  const handleSubmit = () => {
    const payload: Omit<Post, "id" | "user_id" | "images"> = {
      post_header: header,
      post_description: desc,
      goal_amount: goal === "" ? 0 : Number(goal),
      current_amount: editItem?.current_amount ?? 0,
      supporter: editItem?.supporter ?? 0,
      effective_start_from: toIso(startAt),
      effective_end_date: toIso(endAt),
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
    setStartAt("");
    setEndAt("");
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
          label="Start (effective_start_from)"
          type="datetime-local"
          fullWidth
          value={startAt}
          onChange={(e) => setStartAt(e.target.value)}
          slotProps={{
            inputLabel: { shrink: true },
          }}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 12 }}>
        <TextField
          label="End (effective_end_date)"
          type="datetime-local"
          fullWidth
          value={endAt}
          onChange={(e) => setEndAt(e.target.value)}
          slotProps={{
            inputLabel: { shrink: true },
          }}
        />
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
          {categoryOptions.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
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
