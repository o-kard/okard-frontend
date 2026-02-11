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
  Typography,
  IconButton,
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
import PredictResultDialog from "@/modules/post/components/PredictResultDialog";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type FormCampaign = {
  id?: string;
  campaign_header?: string;
  campaign_description?: string;
  display_order: number;
  file?: File | null;
};

type FormReward = {
  id?: string;
  reward_header?: string;
  reward_description?: string;
  display_order: number;
  reward_amount: number;
  backup_amount: number;
  file?: File | null;
};

type CampaignManifestItem = {
  id?: string;
  display_order: number;
  campaign_header?: string;
  campaign_description?: string;
  isEdited?: boolean;
};

type RewardManifestItem = {
  id?: string;
  display_order: number;
  reward_header?: string;
  reward_description?: string;
  reward_amount?: number;
  backup_amount?: number;
  isEdited?: boolean;
};

export type FormValues = {
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

// type Props = {
//   editItem?: Post | null;
//   onSubmit?: (fd: FormData, editId?: string | null) => Promise<void> | void;
//   onSuccess?: () => void;
//   onCancel?: () => void;
// };

type PostImageItem = {
  id: string;
  file: File;
  preview: string;
  display_order: number;
};

function SortableThumb({
  item,
  onRemove,
}: {
  item: PostImageItem;
  onRemove: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div style={{ position: "relative" }}>
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <img
          src={item.preview}
          style={{
            width: 140,
            height: 100,
            objectFit: "cover",
            borderRadius: 8,
          }}
        />
        <small># {item.display_order}</small>
      </div>
      <IconButton
        size="small"
        onClick={() => onRemove(item.id)}
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.9)",
          },
        }}
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
    </div>
  );
}

export const categoryOptions = [
  { value: "art", label: "Art" },
  { value: "comics", label: "Comics" },
  { value: "crafts", label: "Crafts" },
  { value: "dance", label: "Dance" },
  { value: "design", label: "Design" },
  { value: "fashion", label: "Fashion" },
  { value: "filmVideo", label: "Film & Video" },
  { value: "food", label: "Food" },
  { value: "games", label: "Games" },
  { value: "journalism", label: "Journalism" },
  { value: "music", label: "Music" },
  { value: "photography", label: "Photography" },
  { value: "publishing", label: "Publishing" },
  { value: "technology", label: "Technology" },
  { value: "theater", label: "Theater" },
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
  onPredict?: (values: FormValues) => Promise<any>;
  onEditRequest?: (proposedChanges: any) => void;
};
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

export default function PostForm({
  editItem,
  onSubmit,
  onSuccess,
  onCancel,
  onPredict,
  onEditRequest,
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
        category: "technology",
        post_images: [],
        campaigns: [{ display_order: 1, file: null }],
        rewards: [
          { display_order: 1, file: null, reward_amount: 0, backup_amount: 0 },
        ],
      },
    });

  const [postImagePreviews, setPostImagePreviews] = useState<string[]>([]);
  const [campaignPreviews, setCampaignPreviews] = useState<
    Record<number, string>
  >({});
  const [rewardPreviews, setRewardPreviews] = useState<Record<number, string>>(
    {}
  );
  const [postImages, setPostImages] = useState<PostImageItem[]>([]);
  const sensors = useSensors(useSensor(PointerSensor));
  const onDragEnd = (e: any) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = postImages.findIndex((x) => x.id === active.id);
    const newIndex = postImages.findIndex((x) => x.id === over.id);
    const next = arrayMove(postImages, oldIndex, newIndex).map((x, i) => ({
      ...x,
      display_order: i + 1,
    }));
    setPostImages(next);
  };

  useEffect(() => {
    return () => {
      postImagePreviews.forEach((u) => URL.revokeObjectURL(u));
      Object.values(campaignPreviews).forEach((u) => URL.revokeObjectURL(u));
      Object.values(rewardPreviews).forEach((u) => URL.revokeObjectURL(u));
    };
  }, []);

  const handlePostFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);

    if (newFiles.length === 0) return;

    setPostImages((currentImages) => {
      const newItems = newFiles.map((f, i) => ({
        id: `${f.name}-${i}-${crypto.randomUUID()}`,
        file: f,
        preview: URL.createObjectURL(f),
        display_order: currentImages.length + i + 1,
      }));

      const combinedImages = [...currentImages, ...newItems];

      console.log("Updated Images State:", combinedImages);

      setValue(
        "post_images",
        combinedImages.map((img) => img.file)
      );

      return combinedImages;
    });
  };

  const handleRemovePostImage = (idToRemove: string) => {
    setPostImages((currentImages) => {
      const imageToRemove = currentImages.find((img) => img.id === idToRemove);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview);
      }

      const remainingImages = currentImages.filter(
        (img) => img.id !== idToRemove
      );

      const updatedImages = remainingImages.map((img, index) => ({
        ...img,
        display_order: index + 1,
      }));

      setValue(
        "post_images",
        updatedImages.map((img) => img.file)
      );

      return updatedImages;
    });
  };

  const handleClearPostImages = () => {
    postImagePreviews.forEach((u) => URL.revokeObjectURL(u));
    setPostImagePreviews([]);
    setPostImages([]);
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

  useEffect(() => {
    console.log("PostForm mounted, onPredict =", onPredict);
  }, [onPredict]);

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
      .sort(
        (a, b) => Number(a.display_order ?? 0) - Number(b.display_order ?? 0)
      );

    const campaignMapped = sortedCamps.map((c, idx) => ({
      id: c.id,
      campaign_header: c.campaign_header,
      campaign_description: c.campaign_description,
      display_order: Number(c.display_order ?? idx + 1),
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
      .sort(
        (a, b) => Number(a.display_order ?? 0) - Number(b.display_order ?? 0)
      );

    const rewardMapped = sortedRewards.map((c, idx) => ({
      id: c.id,
      reward_header: c.reward_header,
      reward_description: c.reward_description,
      reward_amount: Number(c.reward_amount ?? 0),
      backup_amount: Number(c.backup_amount ?? 0),
      display_order: Number(c.display_order ?? idx + 1),
      file: null as File | null,
    }));

    if (rewardMapped.length > 0) {
      replaceRewards(rewardMapped);
    } else {
      setValue("rewards", []);
    }

    // ----- Post images -----
    const postUrls: string[] = Array.isArray(editItem.images)
      ? editItem.images.map((img) => toAbsolute(img.path)).filter(Boolean)
      : [];

    const mappedImages = postUrls.map((url, idx) => ({
      id: editItem.images?.[idx]?.id ?? `${idx}-${crypto.randomUUID()}`,
      file: null as any,
      preview: url,
      display_order: idx + 1,
    }));

    setPostImages(mappedImages);

    const campMap: Record<number, string> = {};
    // Use sortedCamps to match the form field order
    sortedCamps.forEach((c, i) => {
      if (Array.isArray(c.images) && c.images.length > 0) {
        campMap[i] = toAbsolute(c.images[0].path);
      }
    });
    setCampaignPreviews(campMap);

    const rewardMap: Record<number, string> = {};
    // Use sortedRewards to match the form field order
    sortedRewards.forEach((r, i) => {
      if (Array.isArray(r.images) && r.images.length > 0) {
        rewardMap[i] = toAbsolute(r.images[0].path);
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
        display_order: Number(c.display_order ?? 0),
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

  const buildManifestAndFilesForReward = (
    items: FormReward[],
    originalMap?: Map<string, any>
  ) => {
    const rewardManifest: RewardManifestItem[] = [];
    const rewardFiles: File[] = [];

    for (const c of items) {
      const item: RewardManifestItem = {
        ...(c.id ? { id: c.id } : {}),
        display_order: Number(c.display_order ?? 0),
      };
      if (c.reward_header != null) item.reward_header = c.reward_header;
      if (c.reward_description != null)
        item.reward_description = c.reward_description;
      if (c.reward_amount != null) item.reward_amount = Number(c.reward_amount);
      if (c.backup_amount != null) item.backup_amount = Number(c.backup_amount);

      let isEdited = false;

      // Check for file change
      if (c.file) {
        isEdited = true;
        rewardFiles.push(c.file);
      }

      // Check for text/value changes if originalMap provided
      if (c.id && originalMap && originalMap.has(c.id)) {
        const orig = originalMap.get(c.id);
        if (
          orig.reward_header !== c.reward_header ||
          orig.reward_description !== c.reward_description ||
          Number(orig.reward_amount) !== Number(c.reward_amount) ||
          Number(orig.backup_amount) !== Number(c.backup_amount)
        ) {
          isEdited = true;
        }
      } else if (!c.id) {
        // New item is considered edited
        isEdited = true;
      }

      item.isEdited = isEdited;

      // For Edit Request payload, we might filter outside,
      // but here we just mark it.
      rewardManifest.push(item);
    }
    return { rewardManifest, rewardFiles };
  };

  const handleFormSubmit: SubmitHandler<FormValues> = async (values) => {
    const fd = new FormData();
    const isEdit = Boolean(editItem?.id);
    const pickedNewFiles = (watch("post_images") ?? []).length > 0;

    // --- post_data (normalize optional -> default) ---
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

    // Prepare Maps for comparison
    const originalRewardsMap = new Map();
    if (editItem?.rewards) {
      editItem.rewards.forEach((r) => originalRewardsMap.set(r.id, r));
    }

    if (!isEdit) {
      const createCampaignList = values.campaigns.map((c, idx) => ({
        campaign_header: c.campaign_header ?? "",
        campaign_description: c.campaign_description ?? "",
        display_order: Number(c.display_order ?? idx + 1),
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
        display_order: Number(c.display_order ?? idx + 1),
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
        values.rewards,
        originalRewardsMap
      );

      fd.append("campaigns", JSON.stringify(campaignManifest));
      campaignFiles.forEach((f) => fd.append("campaign_images", f));

      fd.append("rewards", JSON.stringify(rewardManifest));
      rewardFiles.forEach((f) => fd.append("reward_images", f));
    }

    // --- Image Handling ---
    const newImages = postImages.filter((it) => it.file);
    const existingImages = postImages.filter((it) => !it.file);

    // New Images
    if (newImages.length > 0) {
      newImages
        .sort((a, b) => a.display_order - b.display_order)
        .forEach((it) => fd.append("images", it.file));

      fd.append(
        "images_manifest",
        JSON.stringify(
          newImages.map((it) => ({
            filename: it.file.name,
            display_order: it.display_order,
          }))
        )
      );
    }

    if (isEdit) {
      const reorder = existingImages.map((it) => ({
        id: it.id,
        display_order: it.display_order,
      }));
      fd.append("images_reorder", JSON.stringify(reorder));
    }

    // Sensitive Fields
    const sensitiveFieldsChanged: Partial<FormValues> = {};
    let hasSensitiveChanges = false;
    let rewardsChanged = false;

    // Only check for sensitive changes if the post is already PUBLISHED
    if (isEdit && editItem && editItem.state === "published") {
      // Check Category
      if (values.category !== editItem.category) {
        hasSensitiveChanges = true;
        sensitiveFieldsChanged.category = values.category;
      }

      // Check Goal Amount
      if (Number(values.goal_amount) !== Number(editItem.goal_amount)) {
        hasSensitiveChanges = true;
        sensitiveFieldsChanged.goal_amount = Number(values.goal_amount);
      }

      // Check Status
      if (values.status !== editItem.status) {
        hasSensitiveChanges = true;
        sensitiveFieldsChanged.status = values.status;
      }

      // Check Effective End Date
      // Compare ISO strings or timestamps
      const oldEnd = editItem.effective_end_date
        ? toIso(toLocalInputValue(editItem.effective_end_date) || "")
        : null;
      const newEnd = values.effective_end_date
        ? toIso(values.effective_end_date)
        : null;

      if (oldEnd !== newEnd) {
        hasSensitiveChanges = true;
        sensitiveFieldsChanged.effective_end_date = newEnd || undefined;
      }

      // Check Rewards
      const originalRewards = editItem.rewards || [];
      const currentRewards = values.rewards;

      const origStr = JSON.stringify(
        originalRewards.map((r) => ({
          h: r.reward_header,
          d: r.reward_description,
          a: r.reward_amount,
          b: r.backup_amount,
        }))
      );
      const currStr = JSON.stringify(
        currentRewards.map((r) => ({
          h: r.reward_header,
          d: r.reward_description,
          a: r.reward_amount,
          b: r.backup_amount,
        }))
      );

      if (origStr !== currStr) {
        hasSensitiveChanges = true;
        rewardsChanged = true;
      }
    }

    if (hasSensitiveChanges && onEditRequest) {
      const proposed: any = {};
      if (sensitiveFieldsChanged.category) proposed.category = values.category;
      if (sensitiveFieldsChanged.goal_amount)
        proposed.goal_amount = values.goal_amount;
      if (sensitiveFieldsChanged.status) proposed.status = values.status;
      if (sensitiveFieldsChanged.effective_end_date)
        proposed.effective_end_date = values.effective_end_date;

      if (rewardsChanged) {
        // Re-build with original map to ensure isEdited is set correctly
        const map = new Map();
        if (editItem?.rewards) {
          editItem.rewards.forEach((r) => map.set(r.id, r));
        }
        const { rewardManifest } = buildManifestAndFilesForReward(
          values.rewards,
          map
        );
        // FILTER HERE: Only satisfy user request "take only isEdited = true"
        // CHANGE: Send FULL list to handle deletions and reordering.
        // The backend will treat this list as the "Target State".
        // Any existing reward NOT in this list will be deleted.
        proposed.rewards_payload = rewardManifest;

        // Build files map for Edit Request handling
        const filesMap: Record<string, File> = {};
        values.rewards.forEach((r) => {
          const rewardItem = r as any;
          if (rewardItem.file) {
            filesMap[`reward_${r.display_order}`] = rewardItem.file;
          }
        });
        proposed.files_map = filesMap;
      }

      onEditRequest(proposed);
      return;
    }

    if (isEdit) {
      // Submit Direct
      await onSubmit?.(fd, editItem?.id ?? null);
    } else {
      await onSubmit?.(fd, editItem?.id ?? null);
    }

    onSuccess?.();
  };

  const [openModal, setOpenModal] = useState(false);
  const [loadingPredict, setLoadingPredict] = useState(false);
  const [predictResult, setPredictResult] = useState<any>(null);

  const onPredictClick = () => {
    console.log("✅ Predict button clicked");
    if (!onPredict) {
      console.warn("⚠️ onPredict not provided");
      return;
    }

    handleSubmit(
      async (values) => {
        try {
          setOpenModal(true);
          setLoadingPredict(true);
          setPredictResult(null);

          console.log("👉 calling onPredict now");
          const result = await onPredict(values);
          setPredictResult(result || { message: "No result returned" });
        } catch (err) {
          console.error("Predict error:", err);
          setPredictResult({ message: "Prediction failed ❌" });
        } finally {
          setLoadingPredict(false);
        }
      },
      (errors) => {
        console.log("❌ Predict validation errors:", errors);
      }
    )();
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
            type="number"
            helperText={
              editItem && editItem.state === "published"
                ? "Changing this will trigger an Edit Request"
                : ""
            }
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
              disabled={!!(editItem?.state === "published")}
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
              helperText={
                editItem && editItem.state === "published"
                  ? "Changing this will trigger an Edit Request"
                  : ""
              }
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
              helperText={
                editItem && editItem.state === "published"
                  ? "Changing this will trigger an Edit Request"
                  : ""
              }
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
            disabled={!!(editItem?.state === "published")}
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
            helperText={
              editItem && editItem.state === "published"
                ? "Changing this will trigger an Edit Request"
                : ""
            }
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

          {postImages.length > 0 && (
            <DndContext sensors={sensors} onDragEnd={onDragEnd}>
              <SortableContext
                items={postImages.map((x) => x.id)}
                strategy={verticalListSortingStrategy}
              >
                <Box
                  sx={{
                    mt: 1,
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(140px,1fr))",
                    gap: 2,
                  }}
                >
                  {postImages.map((it) => (
                    <SortableThumb
                      key={it.id}
                      item={it}
                      onRemove={handleRemovePostImage}
                    />
                  ))}
                </Box>
              </SortableContext>
            </DndContext>
          )}

          <Box>
            <Button
              size="small"
              variant="text"
              color="error"
              onClick={() => handleClearPostImages()}
            >
              Clear image
            </Button>
          </Box>
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
                  {...register(`campaigns.${idx}.display_order` as const, {
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
                {!editItem && (
                  <IconButton color="error" onClick={() => remove(idx)}>
                    <DeleteIcon />
                  </IconButton>
                )}
              </Grid>
            </Grid>
          ))}

          <Button
            startIcon={<AddIcon />}
            variant="outlined"
            onClick={() =>
              append({ display_order: fields.length + 1, file: null })
            }
          >
            Add Campaign
          </Button>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Typography variant="h6" sx={{ mt: 4, mb: 1 }}>
            Rewards
          </Typography>
          {rewardFields.map((field, idx) => {
            // Check if this reward has backers (backup_amount > 0) AND post is published
            const isPublished = editItem?.state === "published";
            const hasBackers = Number(field.backup_amount) > 0;
            const isDisabled = isPublished && hasBackers;
            console.log("isDisabled", isDisabled);
            console.log("hasBackers", hasBackers);
            console.log("isPublished", isPublished);

            return (
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
                    disabled={isDisabled}
                    {...register(`rewards.${idx}.reward_header` as const)}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label="Order"
                    type="number"
                    fullWidth
                    {...register(`rewards.${idx}.display_order` as const, {
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
                    disabled={isDisabled}
                    {...register(`rewards.${idx}.reward_description` as const)}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    label="Reward Amount"
                    fullWidth
                    disabled={isDisabled}
                    {...register(`rewards.${idx}.reward_amount` as const, {
                      valueAsNumber: true,
                    })}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    disabled={isDisabled}
                  >
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
                          disabled={isDisabled}
                          onClick={() => handleClearRewardImage(idx)}
                        >
                          Clear image
                        </Button>
                      </Box>
                    </Box>
                  )}
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <IconButton
                    color="error"
                    onClick={() => removeReward(idx)}
                    disabled={isDisabled}
                  >
                    <DeleteIcon />
                  </IconButton>
                  {isDisabled && (
                    <Typography variant="caption" color="error" sx={{ ml: 1 }}>
                      Cannot edit/delete because it has backers
                    </Typography>
                  )}
                </Grid>
              </Grid>
            );
          })}
          <Button
            startIcon={<AddIcon />}
            variant="outlined"
            onClick={() =>
              appendReward({
                display_order: rewardFields.length + 1,
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
          <Button
            variant="outlined"
            color="primary"
            type="button"
            onClick={onPredictClick}
          >
            Predict
          </Button>
          <Button variant="outlined" onClick={onCancel}>
            Cancel
          </Button>
        </Grid>
      </Grid>

      <PredictResultDialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        loading={loadingPredict}
        result={predictResult}
      />
    </form>
  );
}
