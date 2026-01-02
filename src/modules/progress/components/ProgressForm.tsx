"use client";

import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  IconButton,
  Stack,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { createProgress } from "../api/api";
import { CreateProgressPayload } from "../types";

type Props = {
  open: boolean;
  onClose: () => void;
  postId: string;
  onSuccess: () => void;
};

type FormValues = {
  progress_header: string;
  progress_description: string;
  images: File[];
};

export default function ProgressForm({
  open,
  onClose,
  postId,
  onSuccess,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      progress_header: "",
      progress_description: "",
      images: [],
    },
  });

  const [imagePreviews, setImagePreviews] = useState<
    { file: File; preview: string }[]
  >([]);

  useEffect(() => {
    if (open) {
      reset();
      setImagePreviews([]);
    }
  }, [open, reset]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const newPreviews = newFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));
      setImagePreviews((prev) => [...prev, ...newPreviews]);
      setValue("images", [...imagePreviews.map((p) => p.file), ...newFiles]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImagePreviews((prev) => {
      const newPreviews = [...prev];
      URL.revokeObjectURL(newPreviews[index].preview);
      newPreviews.splice(index, 1);
      setValue(
        "images",
        newPreviews.map((p) => p.file),
      );
      return newPreviews;
    });
  };

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    try {
      const fd = new FormData();
      const payload: CreateProgressPayload = {
        progress_header: values.progress_header,
        progress_description: values.progress_description,
        post_id: postId,
      };
      fd.append("progress_data", JSON.stringify(payload));

      imagePreviews.forEach((item) => {
        fd.append("images", item.file);
      });

      await createProgress(fd);
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Failed to create progress", err);
      // You might want to show an error toast here
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle fontWeight={800}>Add Progress Update</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          <Stack spacing={3}>
            <TextField
              label="Title"
              fullWidth
              {...register("progress_header", {
                required: "Title is required",
              })}
              error={!!errors.progress_header}
              helperText={errors.progress_header?.message}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={4}
              {...register("progress_description")}
            />

            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Images
              </Typography>
              <Stack direction="row" flexWrap="wrap" gap={2}>
                {imagePreviews.map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: 100,
                      height: 100,
                      position: "relative",
                      borderRadius: 1,
                      overflow: "hidden",
                      border: "1px solid #eee",
                    }}
                  >
                    <img
                      src={item.preview}
                      alt="preview"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveImage(index)}
                      sx={{
                        position: "absolute",
                        top: 2,
                        right: 2,
                        bgcolor: "rgba(255,255,255,0.8)",
                        "&:hover": { bgcolor: "rgba(255,255,255,1)" },
                      }}
                    >
                      <DeleteIcon fontSize="small" color="error" />
                    </IconButton>
                  </Box>
                ))}

                <Button
                  component="label"
                  variant="outlined"
                  sx={{
                    width: 100,
                    height: 100,
                    borderRadius: 1,
                    borderStyle: "dashed",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 0.5,
                  }}
                >
                  <AddPhotoAlternateIcon color="action" />
                  <Typography variant="caption" color="text.secondary">
                    Add
                  </Typography>
                  <input
                    type="file"
                    hidden
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </Button>
              </Stack>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Post Update"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
