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
import { createProgress, updateProgress } from "../api/api";
import { CreateProgressPayload, Progress } from "../types";

type Props = {
  open: boolean;
  onClose: () => void;
  postId: string;
  onSuccess: () => void;
  initialData?: Progress | null;
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
  initialData,
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
    { file?: File; preview: string }[]
  >([]);

  useEffect(() => {
    if (open) {
      if (initialData) {
        setValue("progress_header", initialData.progress_header);
        setValue(
          "progress_description",
          initialData.progress_description || "",
        );
        setValue("images", []);

        // existing images
        if (initialData.images && initialData.images.length > 0) {
          const img = initialData.images[0];
          setImagePreviews([
            {
              preview: `${process.env.NEXT_PUBLIC_API_URL}${img.path}`,
            },
          ]);
        } else {
          setImagePreviews([]);
        }
      } else {
        reset();
        setImagePreviews([]);
      }
    }
  }, [open, initialData, reset, setValue]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Replace existing image
      const newPreview = {
        file,
        preview: URL.createObjectURL(file),
      };
      // Revoke old object url if it was a blob
      if (imagePreviews.length > 0 && imagePreviews[0].file) {
        URL.revokeObjectURL(imagePreviews[0].preview);
      }

      setImagePreviews([newPreview]);
      setValue("images", [file]);
    }
  };

  const handleRemoveImage = (index: number) => {
    if (imagePreviews[index].file) {
      URL.revokeObjectURL(imagePreviews[index].preview);
    }
    setImagePreviews([]);
    setValue("images", []);
  };

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    try {
      const fd = new FormData();
      const payload: any = {
        progress_header: values.progress_header,
        progress_description: values.progress_description,
      };

      if (!initialData) {
        payload.post_id = postId;
      }

      fd.append("progress_data", JSON.stringify(payload));

      if (values.images && values.images.length > 0) {
        fd.append("images", values.images[0]);
      }

      if (initialData) {
        await updateProgress(initialData.id, fd);
      } else {
        await createProgress(fd);
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Failed to save progress", err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle fontWeight={800}>
        {initialData ? "Edit Progress Update" : "Add Progress Update"}
      </DialogTitle>
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
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={4}
              {...register("progress_description")}
              slotProps={{ inputLabel: { shrink: true } }}
            />

            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Image (Max 1)
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

                {imagePreviews.length === 0 && (
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
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </Button>
                )}
              </Stack>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting
              ? "Submitting..."
              : initialData
                ? "Save Changes"
                : "Post Update"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
