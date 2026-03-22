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
  Campaign,
  CampaignCategoryType,
  CampaignStateType,
} from "../types/campaign";
import PredictResultDialog from "@/modules/campaign/components/PredictResultDialog";
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

type FormInformation = {
  id?: string;
  information_header?: string;
  information_description?: string;
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

type InformationManifestItem = {
  id?: string;
  display_order: number;
  information_header?: string;
  information_description?: string;
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
  campaign_header: string;
  campaign_description: string;
  goal_amount: number;
  current_amount: number;
  supporter: number | null;
  effective_start_from: string | null;
  effective_end_date: string | null;
  state: CampaignStateType;
  category: CampaignCategoryType;
  campaign_media: File[];
  informations: FormInformation[];
  rewards: FormReward[];
};

type CampaignMediaItem = {
  id: string;
  file: File;
  preview: string;
  display_order: number;
};

function SortableThumb({
  item,
  onRemove,
}: {
  item: CampaignMediaItem;
  onRemove: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  const isVideo =
    item.file?.type?.startsWith("video/") ||
    item.preview?.toLowerCase().endsWith(".mp4") ||
    item.preview?.toLowerCase().endsWith(".mov") ||
    item.preview?.toLowerCase().endsWith(".webm");

  return (
    <div style={{ position: "relative" }}>
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        {isVideo ? (
          <video
            src={item.preview}
            style={{
              width: "100%",
              height: "auto",
              aspectRatio: "4 / 3",
              objectFit: "cover",
              borderRadius: 8,
              backgroundColor: "#000",
            }}
            controls={false}
            muted
          />
        ) : (
          <img
            src={item.preview}
            style={{
              width: "100%",
              height: "auto",
              aspectRatio: "4 / 3",
              objectFit: "cover",
              borderRadius: 8,
            }}
          />
        )}
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
  editItem?: Campaign | null;
  onSubmit?: (fd: FormData, editId?: string | null) => Promise<void> | void;
  onSuccess?: () => void;
  onCancel?: () => void;
  onPredict?: (
    values: FormValues,
    mediaState: { hasVideo: boolean; hasImage: boolean },
  ) => Promise<any>;
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

export default function CampaignForm({
  editItem,
  onSubmit,
  onSuccess,
  onCancel,
  onPredict,
  onEditRequest,
}: Props) {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    mode: "onChange",
    defaultValues: {
      campaign_header: "",
      campaign_description: "",
      goal_amount: 0,
      current_amount: 0,
      supporter: 0,
      effective_start_from: null,
      effective_end_date: null,
      state: "draft",
      category: "technology",
      campaign_media: [],
      informations: [{ display_order: 1, file: null }],
      rewards: [
        { display_order: 1, file: null, reward_amount: 0, backup_amount: 0 },
      ],
    },
  });

  const [campaignMediaPreviews, setCampaignMediaPreviews] = useState<string[]>(
    [],
  );
  const [informationPreviews, setInformationPreviews] = useState<
    Record<number, string>
  >({});
  const [rewardPreviews, setRewardPreviews] = useState<Record<number, string>>(
    {},
  );
  const [campaignMedia, setCampaignMedia] = useState<CampaignMediaItem[]>([]);
  const [campaignVideo, setCampaignVideo] = useState<CampaignMediaItem | null>(
    null,
  );
  const [imageSizeError, setImageSizeError] = useState<string | null>(null);
  const sensors = useSensors(useSensor(PointerSensor));

  const isSuspended = !!(editItem?.state === "suspend");
  const isSuccess = !!(editItem?.state === "success");
  const isFailed = !!(editItem?.state === "fail");
  const isExpired = !!(
    editItem?.effective_end_date &&
    new Date(editItem.effective_end_date) < new Date()
  );
  const isLive = isSuccess || !!(editItem?.state === "published");
  const isInactive = isSuspended || isFailed || (isSuccess && isExpired);

  const onDragEnd = (e: any) => {
    if (isInactive) return;
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = campaignMedia.findIndex((x) => x.id === active.id);
    const newIndex = campaignMedia.findIndex((x) => x.id === over.id);
    const next = arrayMove(campaignMedia, oldIndex, newIndex).map((x, i) => ({
      ...x,
      display_order: i + 1,
    }));
    setCampaignMedia(next);
  };

  useEffect(() => {
    return () => {
      campaignMediaPreviews.forEach((u) => URL.revokeObjectURL(u));
      Object.values(informationPreviews).forEach((u) => URL.revokeObjectURL(u));
      Object.values(rewardPreviews).forEach((u) => URL.revokeObjectURL(u));
    };
  }, []);

  const handleCampaignFilesChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newFiles = Array.from(e.target.files || []);
    if (newFiles.length === 0) return;

    setImageSizeError(null);
    const oversized = newFiles.filter((f) => f.size > 5 * 1024 * 1024);
    if (oversized.length > 0) {
      setImageSizeError(
        `Some images exceed the 5MB limit: ${oversized.map((f) => f.name).join(", ")}`,
      );
      return;
    }

    setCampaignMedia((currentMedia) => {
      const newItems = newFiles.map((f, i) => ({
        id: `${f.name}-${i}-${crypto.randomUUID()}`,
        file: f,
        preview: URL.createObjectURL(f),
        display_order: currentMedia.length + i + 1,
      }));

      const combinedMedia = [...currentMedia, ...newItems];
      setValue(
        "campaign_media",
        combinedMedia.map((img) => img.file),
      );
      return combinedMedia;
    });
    e.target.value = "";
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageSizeError(null);
    if (file.size > 50 * 1024 * 1024) {
      setImageSizeError(`Video exceeds the 50MB limit: ${file.name}`);
      return;
    }

    if (campaignVideo?.preview) URL.revokeObjectURL(campaignVideo.preview);
    setCampaignVideo({
      id: `video-${crypto.randomUUID()}`,
      file,
      preview: URL.createObjectURL(file),
      display_order: 0,
    });
    e.target.value = "";
  };

  const handleRemoveVideo = () => {
    if (campaignVideo?.preview) URL.revokeObjectURL(campaignVideo.preview);
    setCampaignVideo(null);
  };

  const handleRemoveCampaignMedia = (idToRemove: string) => {
    setCampaignMedia((currentMedia) => {
      const mediaToRemove = currentMedia.find((img) => img.id === idToRemove);
      if (mediaToRemove) {
        URL.revokeObjectURL(mediaToRemove.preview);
      }

      const remainingMedia = currentMedia.filter(
        (img) => img.id !== idToRemove,
      );

      const updatedMedia = remainingMedia.map((img, index) => ({
        ...img,
        display_order: index + 1,
      }));

      setValue(
        "campaign_media",
        updatedMedia.map((img) => img.file),
      );

      return updatedMedia;
    });
  };

  const handleClearCampaignMedia = () => {
    campaignMediaPreviews.forEach((u) => URL.revokeObjectURL(u));
    setCampaignMediaPreviews([]);
    setCampaignMedia([]);
    setValue("campaign_media", []);
    handleRemoveVideo();
  };

  const handleInformationFileChange = (
    idx: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const f = (e.target.files && e.target.files[0]) || null;
    setImageSizeError(null);
    if (f && f.size > 5 * 1024 * 1024) {
      setImageSizeError(`Information image #${idx + 1} exceeds the 5MB limit.`);
      return;
    }
    setValue(`informations.${idx}.file`, f);
    if (informationPreviews[idx]) URL.revokeObjectURL(informationPreviews[idx]);
    setInformationPreviews((s) => ({
      ...s,
      [idx]: f ? URL.createObjectURL(f) : "",
    }));
    e.target.value = "";
  };

  const handleRemoveInformation = (idx: number) => {
    if (informationPreviews[idx]) URL.revokeObjectURL(informationPreviews[idx]);
    setInformationPreviews((s) => {
      const n = { ...s };
      delete n[idx];
      const maxIdx = Math.max(-1, ...Object.keys(n).map(Number));
      for (let i = idx + 1; i <= maxIdx; i++) {
        if (n[i] !== undefined) {
          n[i - 1] = n[i];
          delete n[i];
        }
      }
      return n;
    });
    removeInformation(idx);
  };

  const handleClearInformationImage = (idx: number) => {
    if (informationPreviews[idx]) URL.revokeObjectURL(informationPreviews[idx]);
    setInformationPreviews((s) => {
      const n = { ...s };
      delete n[idx];
      return n;
    });
    setValue(`informations.${idx}.file`, null);
  };

  const handleRemoveReward = (idx: number) => {
    if (rewardPreviews[idx]) URL.revokeObjectURL(rewardPreviews[idx]);
    setRewardPreviews((s) => {
      const n = { ...s };
      delete n[idx];
      const maxIdx = Math.max(-1, ...Object.keys(n).map(Number));
      for (let i = idx + 1; i <= maxIdx; i++) {
        if (n[i] !== undefined) {
          n[i - 1] = n[i];
          delete n[i];
        }
      }
      return n;
    });
    removeReward(idx);
  };

  const handleRewardFileChange = (
    idx: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const f = (e.target.files && e.target.files[0]) || null;
    setImageSizeError(null);
    if (f && f.size > 5 * 1024 * 1024) {
      setImageSizeError(`Reward image #${idx + 1} exceeds the 5MB limit.`);
      return;
    }
    setValue(`rewards.${idx}.file`, f);
    if (rewardPreviews[idx]) URL.revokeObjectURL(rewardPreviews[idx]);
    setRewardPreviews((s) => ({
      ...s,
      [idx]: f ? URL.createObjectURL(f) : "",
    }));
    e.target.value = "";
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
    console.log("CampaignForm mounted, onPredict =", onPredict);
  }, [onPredict]);

  const {
    fields: informationFields,
    append: appendInformation,
    remove: removeInformation,
    replace: replaceInformation,
  } = useFieldArray({
    control,
    name: "informations",
  });
  const {
    fields: rewardFields,
    append: appendReward,
    remove: removeReward,
    replace: replaceRewards,
  } = useFieldArray({ control, name: "rewards" });

  useEffect(() => {
    if (!editItem) return;

    setValue("campaign_header", editItem.campaign_header);
    setValue("campaign_description", editItem.campaign_description || "");
    setValue("goal_amount", editItem.goal_amount);
    setValue("current_amount", editItem.current_amount ?? 0);
    setValue("supporter", editItem.supporter ?? 0);
    setValue("state", editItem.state);
    setValue("category", editItem.category);
    setValue(
      "effective_start_from",
      toLocalInputValue(editItem?.effective_start_from),
    );
    setValue(
      "effective_end_date",
      toLocalInputValue(editItem?.effective_end_date),
    );

    // ----- Informations: sort by order -----
    const sortedInfos = (editItem.informations || [])
      .slice()
      .sort(
        (a, b) => Number(a.display_order ?? 0) - Number(b.display_order ?? 0),
      );

    const informationMapped = sortedInfos.map((c, idx) => ({
      id: c.id,
      information_header: c.information_header,
      information_description: c.information_description,
      display_order: Number(c.display_order ?? idx + 1),
      file: null as File | null,
    }));

    if (informationMapped.length > 0) {
      replaceInformation(informationMapped);
    } else {
      setValue("informations", []);
    }

    // ----- Rewards: sort by order -----
    const sortedRewards = (editItem.rewards || [])
      .slice()
      .sort(
        (a, b) => Number(a.display_order ?? 0) - Number(b.display_order ?? 0),
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

    // ----- Campaign media: separate video from images -----
    const allMedia = Array.isArray(editItem.media) ? editItem.media : [];
    const videoItem = allMedia.find((m) =>
      (m.media_type || "").startsWith("video/"),
    );
    const imageItems = allMedia.filter(
      (m) => !(m.media_type || "").startsWith("video/"),
    );

    if (videoItem) {
      setCampaignVideo({
        id: videoItem.id ?? `video-${crypto.randomUUID()}`,
        file: null as any,
        preview: toAbsolute(videoItem.path),
        display_order: 0,
      });
    } else {
      setCampaignVideo(null);
    }

    const mappedImages = imageItems.map((img, idx) => ({
      id: img.id ?? `${idx}-${crypto.randomUUID()}`,
      file: null as any,
      preview: toAbsolute(img.path),
      display_order: idx + 1,
    }));

    setCampaignMedia(mappedImages);

    const infoMap: Record<number, string> = {};
    // Use sortedInfos to match the form field order
    sortedInfos.forEach((c, i) => {
      if (Array.isArray(c.media) && c.media.length > 0) {
        infoMap[i] = toAbsolute(c.media[0].path);
      }
    });
    setInformationPreviews(infoMap);

    const rewardMap: Record<number, string> = {};
    // Use sortedRewards to match the form field order
    sortedRewards.forEach((r, i) => {
      if (Array.isArray(r.media) && r.media.length > 0) {
        rewardMap[i] = toAbsolute(r.media[0].path);
      }
    });
    setRewardPreviews(rewardMap);
  }, [editItem, setValue, replaceInformation, replaceRewards]);

  const buildManifestAndFilesForInformation = (items: FormInformation[]) => {
    const informationManifest: InformationManifestItem[] = [];
    const informationFiles: File[] = [];

    for (const c of items) {
      const item: InformationManifestItem = {
        ...(c.id ? { id: c.id } : {}),
        display_order: Number(c.display_order ?? 0),
      };
      if (c.information_header) item.information_header = c.information_header;
      if (c.information_description)
        item.information_description = c.information_description;

      if (c.file) {
        item.isEdited = true;
        informationFiles.push(c.file);
      } else {
        item.isEdited = false;
      }
      informationManifest.push(item);
    }
    return { informationManifest, informationFiles };
  };

  const buildManifestAndFilesForReward = (
    items: FormReward[],
    originalMap?: Map<string, any>,
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
    if (campaignMedia.length === 0) {
      alert("Please upload at least one campaign image.");
      return;
    }

    if (!values.informations || values.informations.length === 0) {
      alert("Please add at least one information item.");
      return;
    }

    if (!values.rewards || values.rewards.length === 0) {
      alert("Please add at least one reward.");
      return;
    }

    const fd = new FormData();
    const isEdit = Boolean(editItem?.id);
    const pickedNewFiles = (watch("campaign_media") ?? []).length > 0;

    // --- campaign_data (normalize optional -> default) ---
    const campaignPayload = {
      campaign_header: values.campaign_header ?? "",
      campaign_description: values.campaign_description ?? "",
      goal_amount: Number(values.goal_amount || 0),
      current_amount: Number(values.current_amount || 0),
      supporter: Number(values.supporter || 0),
      effective_start_from: toIso(values.effective_start_from!),
      effective_end_date: toIso(values.effective_end_date!),
      state: values.state,
      category: values.category,
    };
    fd.append("campaign_data", JSON.stringify(campaignPayload));

    // Prepare Maps for comparison
    const originalRewardsMap = new Map();
    if (editItem?.rewards) {
      editItem.rewards.forEach((r) => originalRewardsMap.set(r.id, r));
    }

    if (!isEdit) {
      const createInformationList = values.informations.map((c, idx) => ({
        information_header: c.information_header ?? "",
        information_description: c.information_description ?? "",
        display_order: Number(c.display_order ?? idx + 1),
      }));

      const infoFiles: File[] = [];
      for (let i = 0; i < values.informations.length; i++) {
        const f = (values.informations[i] as any).file as File | undefined;
        if (!f) {
          alert(`Please upload an image for information #${i + 1}.`);
          return;
        }
        infoFiles.push(f);
      }

      fd.append("informations", JSON.stringify(createInformationList));
      infoFiles.forEach((f) => fd.append("information_media", f));

      const createRewardList = values.rewards.map((c, idx) => ({
        reward_header: c.reward_header ?? "",
        reward_description: c.reward_description ?? "",
        reward_amount: Number(c.reward_amount ?? 0),
        backup_amount: Number(c.backup_amount ?? 0),
        display_order: Number(c.display_order ?? idx + 1),
      }));

      const rewardFiles: File[] = [];
      for (let i = 0; i < values.rewards.length; i++) {
        const f = (values.rewards[i] as any).file as File | undefined;
        if (!f) {
          alert(`Please upload an image for reward #${i + 1}.`);
          return;
        }
        rewardFiles.push(f);
      }

      fd.append("rewards", JSON.stringify(createRewardList));
      rewardFiles.forEach((f) => fd.append("reward_media", f));
    } else {
      const { informationManifest, informationFiles } =
        buildManifestAndFilesForInformation(values.informations);

      const { rewardManifest, rewardFiles } = buildManifestAndFilesForReward(
        values.rewards,
        originalRewardsMap,
      );

      fd.append("informations", JSON.stringify(informationManifest));
      informationFiles.forEach((f) => fd.append("information_media", f));

      fd.append("rewards", JSON.stringify(rewardManifest));
      rewardFiles.forEach((f) => fd.append("reward_media", f));
    }

    // --- Media Handling: merge video + images ---
    const allCampaignMedia: CampaignMediaItem[] = [];
    if (campaignVideo) {
      allCampaignMedia.push({ ...campaignVideo, display_order: 0 });
    }
    allCampaignMedia.push(
      ...campaignMedia.map((it, i) => ({ ...it, display_order: i + 1 })),
    );

    const newMedia = allCampaignMedia.filter((it) => it.file);
    const existingMedia = allCampaignMedia.filter((it) => !it.file);

    // New Media
    if (newMedia.length > 0) {
      newMedia
        .sort((a, b) => a.display_order - b.display_order)
        .forEach((it) => fd.append("media", it.file));

      fd.append(
        "media_manifest",
        JSON.stringify(
          newMedia.map((it) => ({
            filename: it.file.name,
            display_order: it.display_order,
            type: it.file.type.startsWith("video/") ? "video" : "image",
          })),
        ),
      );
    }

    if (isEdit) {
      const reorder = existingMedia.map((it) => ({
        id: it.id,
        display_order: it.display_order,
      }));
      fd.append("media_reorder", JSON.stringify(reorder));
    }

    // Sensitive Fields
    const sensitiveFieldsChanged: Partial<FormValues> = {};
    let hasSensitiveChanges = false;
    let rewardsChanged = false;

    // Only check for sensitive changes if the campaign is already PUBLISHED
    if (isEdit && editItem && isLive) {
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
        })),
      );
      const currStr = JSON.stringify(
        currentRewards.map((r) => ({
          h: r.reward_header,
          d: r.reward_description,
          a: r.reward_amount,
          b: r.backup_amount,
        })),
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
          map,
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
          const mediaState = {
            hasVideo: !!campaignVideo,
            hasImage: campaignMedia.length > 0,
          };
          const result = await onPredict(values, mediaState);
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
      },
    )();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      {isInactive && (
        <Box
          sx={{
            bgcolor: "error.light",
            color: "error.contrastText",
            p: 2,
            borderRadius: 2,
            mb: 3,
            textAlign: "center",
            fontWeight: 700,
          }}
        >
          {isSuspended
            ? "This post is suspended. Editing is disabled."
            : isSuccess
              ? "This campaign is successful. Editing is disabled."
              : "This campaign has failed. Editing is disabled."}
        </Box>
      )}
      <Grid container spacing={2}>
        {/* Campaign Header */}
        <Grid size={{ xs: 12 }}>
          <TextField
            {...register("campaign_header", { required: "Header is required" })}
            label="Campaign Header"
            fullWidth
            error={!!errors.campaign_header}
            helperText={errors.campaign_header?.message}
            disabled={isInactive}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            label="Goal Amount (USD)"
            fullWidth
            type="number"
            disabled={isInactive}
            error={!!errors.goal_amount}
            helperText={
              errors.goal_amount?.message ||
              (editItem && isLive
                ? "Changing this will trigger an Edit Request"
                : "")
            }
            {...register("goal_amount", {
              required: "Goal amount is required",
              valueAsNumber: true,
              validate: (v) =>
                Number(v) > 0 || "Goal amount must be greater than 0",
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
              disabled={
                isInactive ||
                isSuccess ||
                isLive
              }
              value={field.value ?? ""}
              onChange={field.onChange}
              slotProps={{
                select: { MenuProps: { disableScrollLock: true } },
              }}
            >
              <MenuItem value="draft">Draft</MenuItem>
              <MenuItem value="published">Published</MenuItem>
              {editItem?.state === "success" && (
                <MenuItem value="success">Success</MenuItem>
              )}
              {editItem?.state === "fail" && (
                <MenuItem value="fail">Failed</MenuItem>
              )}
              {editItem?.state === "suspend" && (
                <MenuItem value="suspend">Suspended</MenuItem>
              )}
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
              disabled={isInactive}
              value={field.value ?? ""}
              onChange={field.onChange}
              helperText={
                editItem && isLive
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
            label="Start"
            type="datetime-local"
            fullWidth
            disabled={isInactive || isLive}
            defaultValue=""
            {...register("effective_start_from", {
              required: "Start date is required",
            })}
            slotProps={{ inputLabel: { shrink: true } }}
            error={!!errors.effective_start_from}
            helperText={errors.effective_start_from?.message}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            label="End"
            type="datetime-local"
            fullWidth
            disabled={isInactive}
            {...register("effective_end_date", {
              required: "End date is required",
              validate: (value) => {
                const startDate = watch("effective_start_from");
                if (!startDate || !value) return true;
                return (
                  new Date(value) > new Date(startDate) ||
                  "End date must be after start date"
                );
              },
            })}
            slotProps={{ inputLabel: { shrink: true } }}
            error={!!errors.effective_end_date}
            helperText={
              errors.effective_end_date?.message ||
              (editItem && isLive
                ? "Changing this will trigger an Edit Request"
                : "")
            }
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            label="Description"
            multiline
            rows={4}
            fullWidth
            disabled={isInactive}
            {...register("campaign_description", {
              required: "Description is required",
            })}
            error={!!errors.campaign_description}
            helperText={errors.campaign_description?.message}
          />
        </Grid>

        {/* Video Upload (max 1) */}
        <Grid size={{ xs: 12 }}>
          <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
            Video (optional, max 1)
          </Typography>
          {campaignVideo ? (
            <Box sx={{ position: "relative", display: "inline-block" }}>
              <video
                src={campaignVideo.preview}
                style={{
                  width: "100%",
                  height: "auto",
                  objectFit: "cover",
                  borderRadius: 8,
                  backgroundColor: "#000",
                }}
                controls
                muted
              />
              <IconButton
                size="small"
                onClick={handleRemoveVideo}
                sx={{
                  position: "absolute",
                  top: 4,
                  right: 4,
                  bgcolor: "rgba(255,255,255,0.8)",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.95)" },
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          ) : (
            <Button
              variant="outlined"
              component="label"
              fullWidth
              disabled={isInactive}
            >
              Upload Video
              <input
                type="file"
                hidden
                accept="video/*"
                onChange={handleVideoChange}
              />
            </Button>
          )}
        </Grid>

        {/* Image Upload (multiple, reorderable) */}
        <Grid size={{ xs: 12 }}>
          <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
            Images
          </Typography>
          <Button
            variant="outlined"
            component="label"
            fullWidth
            disabled={isInactive}
          >
            Upload Images
            <input
              type="file"
              hidden
              multiple
              accept="image/*"
              onChange={handleCampaignFilesChange}
            />
          </Button>

          {imageSizeError && (
            <Typography
              color="error"
              variant="caption"
              display="block"
              sx={{ mt: 1, fontWeight: 700 }}
            >
              {imageSizeError}
            </Typography>
          )}

          {/* Draggable Image Previews */}
          {campaignMedia.length > 0 && (
            <DndContext sensors={sensors} onDragEnd={onDragEnd}>
              <SortableContext
                items={campaignMedia.map((it) => it.id)}
                strategy={verticalListSortingStrategy}
              >
                <Box
                  sx={{
                    mt: 1,
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: 2,
                  }}
                >
                  {campaignMedia.map((it) => (
                    <SortableThumb
                      key={it.id}
                      item={it}
                      onRemove={handleRemoveCampaignMedia}
                    />
                  ))}
                </Box>
              </SortableContext>
            </DndContext>
          )}

          {campaignMedia.length + (campaignVideo ? 1 : 0) >= 2 && (
            <Box>
              <Button
                size="small"
                variant="text"
                color="error"
                disabled={isInactive}
                onClick={() => handleClearCampaignMedia()}
              >
                Clear all media
              </Button>
            </Box>
          )}
        </Grid>

        {/* Information Section */}
        <Grid size={{ xs: 12 }}>
          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
            Informations
          </Typography>

          {informationFields.map((field, idx) => (
            <Grid
              container
              spacing={1}
              key={field.id}
              sx={{ mb: 2, p: 1, border: "1px solid #ddd", borderRadius: 1 }}
            >
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Information Header"
                  fullWidth
                  {...register(
                    `informations.${idx}.information_header` as const,
                    {
                      required: "Information header is required",
                    },
                  )}
                  error={!!errors.informations?.[idx]?.information_header}
                  helperText={
                    errors.informations?.[idx]?.information_header?.message
                  }
                  disabled={isInactive}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Order"
                  type="number"
                  fullWidth
                  {...register(`informations.${idx}.display_order` as const, {
                    valueAsNumber: true,
                  })}
                  disabled={isInactive}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Information Description"
                  fullWidth
                  multiline
                  rows={3}
                  {...register(
                    `informations.${idx}.information_description` as const,
                  )}
                  disabled={isInactive}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Button variant="outlined" component="label" fullWidth>
                  {watch(`informations.${idx}.file`)
                    ? "Change Image (optional for update)"
                    : "Upload Information Image"}
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => handleInformationFileChange(idx, e)}
                    disabled={isInactive}
                  />
                </Button>

                {informationPreviews[idx] && (
                  <Box sx={{ mt: 1 }}>
                    <img
                      src={toAbsolute(informationPreviews[idx])}
                      alt={`camp-${idx}`}
                      style={{
                        width: "auto",
                        height: "auto",
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
                        onClick={() => handleClearInformationImage(idx)}
                        disabled={isInactive}
                      >
                        Clear image
                      </Button>
                    </Box>
                  </Box>
                )}
              </Grid>

              <Grid size={{ xs: 12 }}>
                {!editItem && (
                  <IconButton
                    color="error"
                    onClick={() => handleRemoveInformation(idx)}
                    disabled={isInactive}
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </Grid>
            </Grid>
          ))}

          <Button
            startIcon={<AddIcon />}
            variant="outlined"
            disabled={isInactive}
            onClick={() =>
              appendInformation({
                display_order: informationFields.length + 1,
                file: null,
              })
            }
          >
            Add Information
          </Button>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Typography variant="h6" sx={{ mt: 4, mb: 1 }}>
            Rewards
          </Typography>
          {rewardFields.map((field, idx) => {
            // Check if this reward has backers (backup_amount > 0) AND post is published
            const isPublishedOrSuccess = isLive;
            const hasBackers = Number(field.backup_amount) > 0;
            const isDisabled = isPublishedOrSuccess && hasBackers;


            return (
              <Grid
                container
                spacing={1}
                key={field.id}
                sx={{ mb: 2, p: 1, border: "1px solid #ddd", borderRadius: 1 }}
              >
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label="Reward Header"
                    fullWidth
                    disabled={isInactive || isDisabled}
                    {...register(`rewards.${idx}.reward_header` as const, {
                      required: "Reward header is required",
                    })}
                    error={!!errors.rewards?.[idx]?.reward_header}
                    helperText={errors.rewards?.[idx]?.reward_header?.message}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label="Order"
                    type="number"
                    fullWidth
                    disabled={isInactive}
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
                    disabled={isInactive || isDisabled}
                    {...register(`rewards.${idx}.reward_description` as const)}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    label="Reward Amount (USD)"
                    fullWidth
                    disabled={isInactive || isDisabled}
                    {...register(`rewards.${idx}.reward_amount` as const, {
                      valueAsNumber: true,
                      min: {
                        value: 0,
                        message: "Reward amount must be positive",
                      },
                    })}
                    error={!!errors.rewards?.[idx]?.reward_amount}
                    helperText={errors.rewards?.[idx]?.reward_amount?.message}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    disabled={isInactive || isDisabled}
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

                  {imageSizeError && (
                    <Typography
                      color="error"
                      variant="caption"
                      display="block"
                      sx={{ mt: 1, fontWeight: 700 }}
                    >
                      {imageSizeError}
                    </Typography>
                  )}

                  {rewardPreviews[idx] && (
                    <Box sx={{ mt: 1 }}>
                      <img
                        src={toAbsolute(rewardPreviews[idx])}
                        alt={`reward-${idx}`}
                        style={{
                          width: "auto",
                          height: "auto",
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
                          disabled={isInactive || isDisabled}
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
                    onClick={() => handleRemoveReward(idx)}
                    disabled={isInactive || isDisabled}
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
            disabled={isInactive}
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
          <Button
            type="submit"
            variant="contained"
            color="success"
            fullWidth
            disabled={isInactive || isSubmitting}
          >
            {editItem ? "Update (with campaigns)" : "Create (with campaigns)"}
          </Button>
          <Button
            variant="outlined"
            color="primary"
            type="button"
            disabled={isInactive}
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
