"use client";

import { useEffect } from "react";
import {
  useForm,
  useFieldArray,
  Controller,
  SubmitHandler,
} from "react-hook-form";
import {
  TextField,
  MenuItem,
  Button,
  IconButton,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import type {
  Campaign,
  Post,
  PostCategoryType,
  PostStateType,
  PostStatusType,
} from "../types/post";

type FormCampaign = {
  id?: string;
  campaign_header?: string;
  campaign_description?: string;
  order: number;
  file?: File | null;
};

type FormValues = {
  post_header: string;
  post_description: string;
  goal_amount: number;
  current_amount: number;
  supporter: number | null;
  effective_start_from: string | null;
  effective_end_date: string | null;
  state: PostStateType;
  status: PostStatusType;
  category: PostCategoryType;
  post_images: File[];
  campaigns: FormCampaign[];
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
const toIso = (local: string): string | null =>
  local ? new Date(local).toISOString() : null;

type Props = {
  editItem?: Post | null;
  onSubmit?: (fd: FormData, editId?: string | null) => Promise<void> | void;
  onSuccess?: () => void;
  onCancel?: () => void;
};

type CampaignManifestItem = {
  id?: string;
  order: number;
  campaign_header?: string;
  campaign_description?: string;
  fileIndex?: number;
};

export default function PostForm({
  editItem,
  onSubmit,
  onSuccess,
  onCancel,
}: Props) {
  const { control, register, handleSubmit, setValue, watch } =
    useForm<FormValues>({
      defaultValues: {
        post_header: "",
        post_description: "",
        goal_amount: 0,
        current_amount: 0,
        supporter: 0,
        effective_start_from: null,
        effective_end_date: null,
        state: "draft",
        status: "active",
        category: "tech",
        post_images: [],
        campaigns: [{ order: 1, file: null }],
      },
    });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "campaigns",
  });

  useEffect(() => {
    if (editItem) {
      setValue("post_header", editItem.post_header);
      setValue("post_description", editItem.post_description || "");
      setValue("goal_amount", editItem.goal_amount);
      setValue("current_amount", editItem.current_amount ?? 0);
      setValue("supporter", editItem.supporter ?? 0);
      setValue("state", editItem.state);
      setValue("status", editItem.status);
      setValue("category", editItem.category);
      setValue(
        "effective_start_from",
        toLocalInputValue(editItem?.effective_start_from)
      );
      setValue(
        "effective_end_date",
        toLocalInputValue(editItem?.effective_end_date)
      );
      const mapped = (editItem.campaigns || []).map((c, idx) => ({
        id: c.id,
        campaign_header: c.campaign_header,
        campaign_description: c.campaign_description,
        order: c.order ?? idx + 1,
        file: null,
      }));
      if (mapped.length > 0) setValue("campaigns", mapped);
    }
  }, [editItem, setValue]);

  // สร้าง manifest + ดึงไฟล์ใหม่ให้ตรงกับ fileIndex
  const buildManifestAndFiles = (items: FormCampaign[]) => {
    const manifest: CampaignManifestItem[] = [];
    const files: File[] = [];
    let next = 0;

    for (const c of items) {
      const item: CampaignManifestItem = {
        ...(c.id ? { id: c.id } : {}),
        order: Number(c.order ?? 0),
      };
      if (c.campaign_header) item.campaign_header = c.campaign_header;
      if (c.campaign_description)
        item.campaign_description = c.campaign_description;

      if (c.file) {
        item.fileIndex = next; // map ไปยังไฟล์ใหม่ตำแหน่งนี้
        files.push(c.file);
        next++;
      }
      manifest.push(item);
    }
    return { manifest, files };
  };

  const handleFormSubmit: SubmitHandler<FormValues> = async (values) => {
    const fd = new FormData();

    // --- post_data (normalize optional -> ค่า default) ---
    const postPayload = {
      post_header: values.post_header ?? "",
      post_description: values.post_description ?? "",
      goal_amount: Number(values.goal_amount || 0),
      current_amount: Number(values.current_amount || 0),
      supporter: Number(values.supporter || 0),
      effective_start_from: toIso(values.effective_start_from!),
      effective_end_date: toIso(values.effective_end_date!),
      state: values.state,
      status: values.status,
      category: values.category,
    };
    fd.append("post_data", JSON.stringify(postPayload));

    // --- post images: รองรับ FileList และ File[] ---
    const postFiles: File[] =
      values.post_images instanceof FileList
        ? Array.from(values.post_images)
        : values.post_images ?? [];
    postFiles.forEach((f) => fd.append("images", f));

    const isEdit = Boolean(editItem?.id);

    if (!isEdit) {
      // -----------------------
      // CREATE: campaigns = List<CampaignCreate> (ไม่มี id/fileIndex)
      // campaign_images = 1:1 ตาม index
      // -----------------------
      const createList = values.campaigns.map((c) => ({
        campaign_header: c.campaign_header ?? "",
        campaign_description: c.campaign_description ?? "",
        order: Number(c.order ?? 0),
      }));

      // รวบรวมไฟล์ของแคมเปญแบบ 1:1
      const campFiles: File[] = [];
      values.campaigns.forEach((c, i) => {
        // สมมติคุณเก็บไฟล์ไว้ที่ (c as any).file จาก input; ปรับตามจริงได้
        const f = (c as any).file as File | undefined;
        if (!f)
          throw new Error(`Please upload an image for campaign #${i + 1}.`);
        campFiles.push(f);
      });

      fd.append("campaigns", JSON.stringify(createList));
      campFiles.forEach((f) => fd.append("campaign_images", f));
    } else {
      const { manifest, files: newFiles } = buildManifestAndFiles(
        values.campaigns
      );

      fd.append("campaigns", JSON.stringify(manifest));
      newFiles.forEach((f) => fd.append("campaign_images", f));
    }

    await onSubmit?.(fd, editItem?.id ?? null);
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <TextField
            label="Post Header"
            fullWidth
            {...register("post_header", { required: true })}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            label="Goal Amount"
            fullWidth
            {...register("goal_amount", {
              required: true,
              valueAsNumber: true,
              validate: (v) => Number.isFinite(v) || "Invalid number",
            })}
          />
        </Grid>

        <Controller
          name="state"
          control={control}
          render={({ field }) => (
            <TextField
              select
              label="State"
              fullWidth
              value={field.value ?? ""}
              onChange={field.onChange}
            >
              <MenuItem value="draft">Draft</MenuItem>
              <MenuItem value="published">Published</MenuItem>
              <MenuItem value="archived">Archived</MenuItem>
            </TextField>
          )}
        />

        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <TextField
              select
              label="Status"
              fullWidth
              value={field.value ?? ""}
              onChange={field.onChange}
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </TextField>
          )}
        />

        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <TextField
              select
              label="Category"
              fullWidth
              value={field.value ?? ""}
              onChange={field.onChange}
            >
              {categoryOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>
          )}
        />

        <Grid size={{ xs: 12 }}>
          <TextField
            label="Start (effective_start_from)"
            type="datetime-local"
            fullWidth
            defaultValue=""
            {...register("effective_start_from")}
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            label="End (effective_end_date)"
            type="datetime-local"
            fullWidth
            defaultValue=""
            {...register("effective_end_date")}
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            label="Description"
            multiline
            rows={4}
            fullWidth
            {...register("post_description")}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Button variant="outlined" component="label" fullWidth>
            Upload Post Images
            <input
              type="file"
              hidden
              multiple
              accept="image/*"
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                setValue("post_images", files);
              }}
            />
          </Button>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
            Campaigns
          </Typography>

          {fields.map((field, idx) => (
            <Grid
              container
              spacing={1}
              key={field.id}
              sx={{ mb: 2, p: 1, border: "1px dashed #ddd", borderRadius: 1 }}
            >
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Campaign Header"
                  fullWidth
                  {...register(`campaigns.${idx}.campaign_header` as const)}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Order"
                  type="number"
                  fullWidth
                  {...register(`campaigns.${idx}.order` as const, {
                    valueAsNumber: true,
                  })}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Campaign Description"
                  fullWidth
                  multiline
                  rows={3}
                  {...register(
                    `campaigns.${idx}.campaign_description` as const
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Button variant="outlined" component="label" fullWidth>
                  {watch(`campaigns.${idx}.file`)
                    ? "Change Image (optional for update)"
                    : "Upload Campaign Image"}
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => {
                      const f = (e.target.files && e.target.files[0]) || null;
                      setValue(`campaigns.${idx}.file`, f);
                    }}
                  />
                </Button>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <IconButton color="error" onClick={() => remove(idx)}>
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          ))}

          <Button
            startIcon={<AddIcon />}
            variant="outlined"
            onClick={() => append({ order: fields.length + 1, file: null })}
          >
            Add Campaign
          </Button>
        </Grid>

        <Grid size={{ xs: 12 }} display="flex" gap={2} sx={{ mt: 2 }}>
          <Button type="submit" variant="contained" color="success" fullWidth>
            {editItem ? "Update (with campaigns)" : "Create (with campaigns)"}
          </Button>
          <Button variant="outlined" onClick={onCancel}>
            Cancel
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
