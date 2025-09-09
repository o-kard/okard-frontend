"use client";

import { useEffect, useState } from "react";
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
  Box,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import type {
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

type FormReward = {
  id?: string;
  reward_header?: string;
  reward_description?: string;
  order: number;
  reward_amount: number;
  backup_amount: number;
  file?: File | null;
};

type CampaignManifestItem = {
  id?: string;
  order: number;
  campaign_header?: string;
  campaign_description?: string;
  isEdited?: boolean;
};

type RewardManifestItem = {
  id?: string;
  order: number;
  reward_header?: string;
  reward_description?: string;
  reward_amount?: number;
  backup_amount?: number;
  isEdited?: boolean;
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
  rewards: FormReward[];
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

const toAbsolute = (p?: string) => {
  if (!p) return "";
  if (
    p.startsWith("blob:") ||
    p.startsWith("http://") ||
    p.startsWith("https://")
  )
    return p;
  const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ?? "";
  const rel = p.startsWith("/") ? p : `/${p}`;
  return `${base}${rel}`;
};

type Props = {
  editItem?: Post | null;
  onSubmit?: (fd: FormData, editId?: string | null) => Promise<void> | void;
  onSuccess?: () => void;
  onCancel?: () => void;
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
        rewards: [{ order: 1, file: null, reward_amount: 0, backup_amount: 0 }],
      },
    });

  const [postImagePreviews, setPostImagePreviews] = useState<string[]>([]);
  const [campaignPreviews, setCampaignPreviews] = useState<
    Record<number, string>
  >({});
  const [rewardPreviews, setRewardPreviews] = useState<Record<number, string>>(
    {}
  );

  useEffect(() => {
    return () => {
      postImagePreviews.forEach((u) => URL.revokeObjectURL(u));
      Object.values(campaignPreviews).forEach((u) => URL.revokeObjectURL(u));
      Object.values(rewardPreviews).forEach((u) => URL.revokeObjectURL(u));
    };
  }, []);

  const handlePostFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    postImagePreviews.forEach((u) => URL.revokeObjectURL(u));
    const urls = files.map((f) => URL.createObjectURL(f));
    setPostImagePreviews(urls);
    setValue("post_images", files);
  };

  const handleClearPostImages = () => {
    postImagePreviews.forEach((u) => URL.revokeObjectURL(u));
    setPostImagePreviews([]);
    setValue("post_images", []);
  };

  const handleCampaignFileChange = (
    idx: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const f = (e.target.files && e.target.files[0]) || null;
    setValue(`campaigns.${idx}.file`, f);
    if (campaignPreviews[idx]) URL.revokeObjectURL(campaignPreviews[idx]);
    setCampaignPreviews((s) => ({
      ...s,
      [idx]: f ? URL.createObjectURL(f) : "",
    }));
  };

  const handleClearCampaignImage = (idx: number) => {
    if (campaignPreviews[idx]) URL.revokeObjectURL(campaignPreviews[idx]);
    setCampaignPreviews((s) => {
      const n = { ...s };
      delete n[idx];
      return n;
    });
    setValue(`campaigns.${idx}.file`, null);
  };

  const handleRewardFileChange = (
    idx: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const f = (e.target.files && e.target.files[0]) || null;
    setValue(`rewards.${idx}.file`, f);
    if (rewardPreviews[idx]) URL.revokeObjectURL(rewardPreviews[idx]);
    setRewardPreviews((s) => ({
      ...s,
      [idx]: f ? URL.createObjectURL(f) : "",
    }));
  };

  const handleClearRewardImage = (idx: number) => {
    if (rewardPreviews[idx]) URL.revokeObjectURL(rewardPreviews[idx]);
    setRewardPreviews((s) => {
      const n = { ...s };
      delete n[idx];
      return n;
    });
    setValue(`rewards.${idx}.file`, null);
  };

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "campaigns",
  });
  const {
    fields: rewardFields,
    append: appendReward,
    remove: removeReward,
    replace: replaceRewards,
  } = useFieldArray({ control, name: "rewards" });

  useEffect(() => {
    if (!editItem) return;

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

    // ----- Campaigns: sort by order -----
    const sortedCamps = (editItem.campaigns || [])
      .slice()
      .sort((a, b) => Number(a.order ?? 0) - Number(b.order ?? 0));

    const campaignMapped = sortedCamps.map((c, idx) => ({
      id: c.id,
      campaign_header: c.campaign_header,
      campaign_description: c.campaign_description,
      order: Number(c.order ?? idx + 1),
      file: null as File | null,
    }));

    if (campaignMapped.length > 0) {
      replace(campaignMapped);
    } else {
      setValue("campaigns", []);
    }

    // ----- Rewards: sort by order -----
    const sortedRewards = (editItem.rewards || [])
      .slice()
      .sort((a, b) => Number(a.order ?? 0) - Number(b.order ?? 0));

    const rewardMapped = sortedRewards.map((c, idx) => ({
      id: c.id,
      reward_header: c.reward_header,
      reward_description: c.reward_description,
      reward_amount: Number(c.reward_amount ?? 0),
      backup_amount: Number(c.backup_amount ?? 0),
      order: Number(c.order ?? idx + 1),
      file: null as File | null,
    }));

    if (rewardMapped.length > 0) {
      replaceRewards(rewardMapped);
    } else {
      setValue("rewards", []);
    }

    const postUrls: string[] = Array.isArray(editItem.images)
      ? editItem.images.map((img) => toAbsolute(img.path)).filter(Boolean)
      : [];

    setPostImagePreviews(postUrls);

    const campMap: Record<number, string> = {};
    (editItem.campaigns || []).forEach((c, i) => {
      if (Array.isArray(c.image) && c.image.length > 0) {
        campMap[i] = toAbsolute(c.image[0].path);
      }
    });
    setCampaignPreviews(campMap);

    const rewardMap: Record<number, string> = {};
    (editItem.rewards || []).forEach((r, i) => {
      if (Array.isArray(r.image) && r.image.length > 0) {
        rewardMap[i] = toAbsolute(r.image[0].path);
      }
    });
    setRewardPreviews(rewardMap);
  }, [editItem, setValue, replace, replaceRewards]);

  const buildManifestAndFilesForCampaign = (items: FormCampaign[]) => {
    const campaignManifest: CampaignManifestItem[] = [];
    const campaignFiles: File[] = [];

    for (const c of items) {
      const item: CampaignManifestItem = {
        ...(c.id ? { id: c.id } : {}),
        order: Number(c.order ?? 0),
      };
      if (c.campaign_header) item.campaign_header = c.campaign_header;
      if (c.campaign_description)
        item.campaign_description = c.campaign_description;

      if (c.file) {
        item.isEdited = true;
        campaignFiles.push(c.file);
      } else {
        item.isEdited = false;
      }
      campaignManifest.push(item);
    }
    return { campaignManifest, campaignFiles };
  };

  const buildManifestAndFilesForReward = (items: FormReward[]) => {
    const rewardManifest: RewardManifestItem[] = [];
    const rewardFiles: File[] = [];

    for (const c of items) {
      const item: RewardManifestItem = {
        ...(c.id ? { id: c.id } : {}),
        order: Number(c.order ?? 0),
      };
      if (c.reward_header != null) item.reward_header = c.reward_header;
      if (c.reward_description != null)
        item.reward_description = c.reward_description;
      if (c.reward_amount != null) item.reward_amount = Number(c.reward_amount);
      if (c.backup_amount != null) item.backup_amount = Number(c.backup_amount);

      if (c.file) {
        item.isEdited = true;
        rewardFiles.push(c.file);
      } else {
        item.isEdited = false;
      }

      rewardManifest.push(item);
    }
    return { rewardManifest, rewardFiles };
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
      const createCampaignList = values.campaigns.map((c, idx) => ({
        campaign_header: c.campaign_header ?? "",
        campaign_description: c.campaign_description ?? "",
        order: Number(c.order ?? idx + 1),
      }));

      const campFiles: File[] = [];
      values.campaigns.forEach((c, i) => {
        const f = (c as any).file as File | undefined;
        if (!f)
          throw new Error(`Please upload an image for campaign #${i + 1}.`);
        campFiles.push(f);
      });

      fd.append("campaigns", JSON.stringify(createCampaignList));
      campFiles.forEach((f) => fd.append("campaign_images", f));

      const createRewardList = values.rewards.map((c, idx) => ({
        reward_header: c.reward_header ?? "",
        reward_description: c.reward_description ?? "",
        reward_amount: Number(c.reward_amount ?? 0),
        backup_amount: Number(c.backup_amount ?? 0),
        order: Number(c.order ?? idx + 1),
      }));

      const rewardFiles: File[] = [];
      values.rewards.forEach((c, i) => {
        const f = (c as any).file as File | undefined;
        if (!f) throw new Error(`Please upload an image for reward #${i + 1}.`);
        rewardFiles.push(f);
      });

      fd.append("rewards", JSON.stringify(createRewardList));
      rewardFiles.forEach((f) => fd.append("reward_images", f));
    } else {
      const { campaignManifest, campaignFiles } =
        buildManifestAndFilesForCampaign(values.campaigns);

      const { rewardManifest, rewardFiles } = buildManifestAndFilesForReward(
        values.rewards
      );

      fd.append("campaigns", JSON.stringify(campaignManifest));
      campaignFiles.forEach((f) => fd.append("campaign_images", f));

      fd.append("rewards", JSON.stringify(rewardManifest));
      rewardFiles.forEach((f) => fd.append("reward_images", f));
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
              slotProps={{
                select: { MenuProps: { disableScrollLock: true } },
              }}
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
              slotProps={{
                select: { MenuProps: { disableScrollLock: true } },
              }}
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
              slotProps={{
                select: { MenuProps: { disableScrollLock: true } },
              }}
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
              onChange={handlePostFilesChange}
            />
          </Button>
          {postImagePreviews.length > 0 && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Preview ({postImagePreviews.length})
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                  gap: 2,
                }}
              >
                {postImagePreviews.map((url, i) => (
                  <img
                    key={i}
                    src={toAbsolute(url)}
                    style={{
                      width: "100%",
                      height: 120,
                      objectFit: "cover",
                      borderRadius: 8,
                      border: "1px solid #ddd",
                    }}
                  />
                ))}
              </Box>
              <Button
                size="small"
                variant="text"
                color="error"
                sx={{ mt: 1 }}
                onClick={handleClearPostImages}
              >
                Clear all images
              </Button>
            </Box>
          )}
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
                    onChange={(e) => handleCampaignFileChange(idx, e)}
                  />
                </Button>

                {campaignPreviews[idx] && (
                  <Box sx={{ mt: 1 }}>
                    <img
                      src={toAbsolute(campaignPreviews[idx])}
                      alt={`camp-${idx}`}
                      style={{
                        width: 200,
                        height: 140,
                        objectFit: "cover",
                        borderRadius: 8,
                        border: "1px solid #ddd",
                      }}
                    />
                    <Box>
                      <Button
                        size="small"
                        variant="text"
                        color="error"
                        onClick={() => handleClearCampaignImage(idx)}
                      >
                        Clear image
                      </Button>
                    </Box>
                  </Box>
                )}
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

        <Grid size={{ xs: 12 }}>
          <Typography variant="h6" sx={{ mt: 4, mb: 1 }}>
            Rewards
          </Typography>
          {rewardFields.map((field, idx) => (
            <Grid
              container
              spacing={1}
              key={field.id}
              sx={{ mb: 2, p: 1, border: "1px dashed #ddd", borderRadius: 1 }}
            >
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Reward Header"
                  fullWidth
                  {...register(`rewards.${idx}.reward_header` as const)}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Order"
                  type="number"
                  fullWidth
                  {...register(`rewards.${idx}.order` as const, {
                    valueAsNumber: true,
                  })}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Reward Description"
                  fullWidth
                  multiline
                  rows={3}
                  {...register(`rewards.${idx}.reward_description` as const)}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Reward Amount"
                  fullWidth
                  {...register(`rewards.${idx}.reward_amount` as const, {
                    valueAsNumber: true,
                  })}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Button variant="outlined" component="label" fullWidth>
                  {watch(`rewards.${idx}.file`)
                    ? "Change Image (optional for update)"
                    : "Upload Reward Image"}
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => handleRewardFileChange(idx, e)}
                  />
                </Button>

                {rewardPreviews[idx] && (
                  <Box sx={{ mt: 1 }}>
                    <img
                      src={toAbsolute(rewardPreviews[idx])}
                      alt={`reward-${idx}`}
                      style={{
                        width: 200,
                        height: 140,
                        objectFit: "cover",
                        borderRadius: 8,
                        border: "1px solid #ddd",
                      }}
                    />
                    <Box>
                      <Button
                        size="small"
                        variant="text"
                        color="error"
                        onClick={() => handleClearRewardImage(idx)}
                      >
                        Clear image
                      </Button>
                    </Box>
                  </Box>
                )}
              </Grid>
              <Grid size={{ xs: 12 }}>
                <IconButton color="error" onClick={() => removeReward(idx)}>
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          ))}
          <Button
            startIcon={<AddIcon />}
            variant="outlined"
            onClick={() =>
              appendReward({
                order: rewardFields.length + 1,
                file: null,
                reward_amount: 0,
                backup_amount: 0,
              })
            }
          >
            Add Reward
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
