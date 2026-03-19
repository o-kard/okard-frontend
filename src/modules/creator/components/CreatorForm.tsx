"use client";

import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import {
  Box,
  Grid,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  IconButton,
  InputLabel,
  FormControl,
  InputAdornment,
  Divider,
  Alert,
  AlertTitle,
  CircularProgress,
  FormHelperText,
  Stack,
  Avatar,
} from "@mui/material";

import {
  User as UserIcon,
  FileText,
  Link2,
  Instagram,
  Youtube,
  Twitter,
  Globe,
  Plus,
  X,
  ShieldCheck,
  Briefcase,
  ChevronDown,
  Upload,
  Camera,
} from "lucide-react";

import type {
  SocialLink,
  CreatorFormFiles,
} from "@/modules/creator/types/creator";
import { User } from "@/modules/user/types/user";
import { useCountryOptions } from "@/hooks/useCountryOptions";
import { useUser } from "@clerk/nextjs";
import { socialPlatforms } from "@/utils/constants";

// --- Types ---
type FormValues = {
  user: {
    email: string | null;
    username: string;
    first_name: string;
    middle_name: string | null;
    surname: string;
    tel: string;
    address: string;
    country_id: string | null;
    birth_date: Date | null;
    user_image: File | null;
  };
  creator: {
    bio: string;
    social_links: SocialLink[];
  };
};

type InitialUser = User & {
  image_url?: string | null;
};

type Props = {
  initial?: InitialUser | null;
  onSubmit?: (fd: FormData) => Promise<void> | void;
  onSuccess?: (pendingAvatar?: { file?: File; clear?: boolean } | null) => void;
  onCancel?: () => void;
  imageUrl?: string | null;
};

export default function CreatorRegisterForm({
  onSubmit,
  onSuccess,
  onCancel,
  initial,
  imageUrl,
}: Props) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      user: {
        email: initial?.email ?? null,
        username: initial?.username ?? "",
        first_name: initial?.first_name ?? "",
        middle_name: initial?.middle_name ?? null,
        surname: initial?.surname ?? "",
        tel: initial?.tel ?? "",
        address: initial?.address ?? "",
        country_id: initial?.country_id ?? null,
        birth_date: initial?.birth_date ?? null,
      },
      creator: {
        bio: "",
        social_links: [],
      },
    },
  });

  const [submitting, setSubmitting] = useState(false);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([
    { platform: "instagram", url: "" },
  ]);
  const [fileUploads, setFileUploads] = useState<CreatorFormFiles>({});
  const [socialLinkError, setSocialLinkError] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [removeEmail, setRemoveEmail] = useState(false);
  const [pendingAvatar, setPendingAvatar] = useState<{
    file?: File;
    clear?: boolean;
  } | null>(null);

  const bioValue = watch("creator.bio") || "";
  const maxBioLength = 500;
  const { user } = useUser();

  const { countryOptions, countryLoading, countryError } = useCountryOptions();

  // Update form values when initial data is loaded
  useEffect(() => {
    if (initial) {
      reset({
        user: {
          email: initial.email ?? null,
          username: initial.username ?? "",
          first_name: initial.first_name ?? "",
          middle_name: initial.middle_name ?? null,
          surname: initial.surname ?? "",
          tel: initial.tel ?? "",
          address: initial.address ?? "",
          country_id: initial.country_id ?? null,
          birth_date: initial.birth_date ?? null,
          user_image: null,
        },
        creator: {
          bio: "",
          social_links: [],
        },
      });
      setImagePreviewUrl(imageUrl ?? null);
      setRemoveImage(false);
      setRemoveEmail(false);
      setPendingAvatar(null);
    }
  }, [initial, reset]);

  // --- Handlers ---
  const addSocialLink = () => {
    if (socialLinks.length < 5) {
      const usedPlatforms = socialLinks.map((l) => l.platform);
      const availablePlatform = socialPlatforms.find(
        (p) => !usedPlatforms.includes(p.value),
      );
      if (availablePlatform) {
        setSocialLinks([
          ...socialLinks,
          { platform: availablePlatform.value, url: "" },
        ]);
      }
    }
  };

  const removeSocialLink = (index: number) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== index));
  };

  const updateSocialLink = (
    index: number,
    field: "platform" | "url",
    value: string,
  ) => {
    const updated = [...socialLinks];
    updated[index][field] = value;
    setSocialLinks(updated);
    // Clear error when user starts typing
    if (field === "url" && socialLinkError) {
      setSocialLinkError(false);
    }
  };

  const handleFileChange = (field: keyof CreatorFormFiles, file: File | null) => {
    setFileUploads((prev) => ({ ...prev, [field]: file }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setPendingAvatar({ file: selectedFile, clear: false });
      setImagePreviewUrl(URL.createObjectURL(selectedFile));
      setRemoveImage(false);
    }
  };

  const handleClearImage = () => {
    setImagePreviewUrl(null);
    setPendingAvatar({ clear: true });
    setRemoveImage(true);
  };

  const handleFormSubmit: SubmitHandler<FormValues> = async (values) => {
    setSubmitting(true);
    try {
      const filteredLinks = socialLinks.filter(
        (link) => link.url.trim() !== "",
      );

      // Validate at least one social link
      if (filteredLinks.length === 0) {
        setSocialLinkError(true);
        setSubmitting(false);
        return;
      }

      // Create FormData
      const fd = new FormData();

      // Build payload
      const payload = {
        user: {
          ...values.user,
          remove_image: pendingAvatar?.clear ? true : removeImage,
          remove_email: removeEmail,
        },
        creator: {
          bio: values.creator.bio,
          social_links: filteredLinks,
        },
      };

      // Append payload as JSON
      fd.append("data", JSON.stringify(payload));

      // Append user image from pendingAvatar
      if (pendingAvatar?.file) {
        fd.append("image", pendingAvatar.file);
      }

      // Append files
      if (fileUploads.id_card) {
        fd.append("id_card", fileUploads.id_card);
      }
      if (fileUploads.house_registration) {
        fd.append("house_registration", fileUploads.house_registration);
      }
      if (fileUploads.bank_statement) {
        fd.append("bank_statement", fileUploads.bank_statement);
      }

      await onSubmit?.(fd);
      onSuccess?.(pendingAvatar);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const getPlatformIcon = (platform: string) => {
    const found = socialPlatforms.find((p) => p.value === platform);
    return found?.icon || Globe;
  };

  const getPlatformPlaceholder = (platform: string) => {
    const found = socialPlatforms.find((p) => p.value === platform);
    return found?.placeholder || "https://...";
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f8fafc",
        py: 4,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="md">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
            <Briefcase size={28} color="#334155" />
            <Typography
              variant="h5"
              component="h1"
              fontWeight="700"
              color="text.primary"
            >
              Creator Registration
            </Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary">
            Please complete your profile details to proceed with the
            verification process.
          </Typography>
        </Box>

        {/* Form Paper */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <Grid container spacing={4}>
              {/* --- Profile Image Section --- */}
              <Grid size={{ xs: 12 }}>
                <Grid container spacing={2}>
                  {/* Left Column: Description */}
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Stack
                      direction="row"
                      spacing={1.5}
                      alignItems="center"
                      sx={{ mb: 1 }}
                    >
                      <Box
                        sx={{
                          p: 0.5,
                          bgcolor: "#f1f5f9",
                          borderRadius: 1,
                          display: "flex",
                        }}
                      >
                        <Camera size={18} color="#475569" />
                      </Box>
                      <Typography variant="subtitle1" fontWeight="600">
                        Profile Image
                      </Typography>
                    </Stack>
                    <Typography variant="caption" color="text.secondary">
                      Upload your profile picture for verification.
                    </Typography>
                  </Grid>

                  {/* Right Column: Image Upload */}
                  <Grid size={{ xs: 12, md: 8 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar
                        src={imagePreviewUrl || undefined}
                        sx={{
                          width: 100,
                          height: 100,
                          bgcolor: "#e2e8f0",
                          color: "#64748b",
                          fontSize: "2.5rem",
                        }}
                      >
                        {!imagePreviewUrl && <UserIcon size={48} />}
                      </Avatar>
                      <Stack spacing={1}>
                        <Button
                          variant="outlined"
                          component="label"
                          size="small"
                          startIcon={<Upload size={16} />}
                          sx={{
                            textTransform: "none",
                            borderRadius: 1.5,
                            borderColor: "divider",
                            color: "text.secondary",
                          }}
                        >
                          Upload Image
                          <input
                            type="file"
                            hidden
                            accept="image/jpeg,image/jpg"
                            onChange={handleImageChange}
                          />
                        </Button>
                        {imagePreviewUrl && (
                          <Button
                            variant="text"
                            size="small"
                            onClick={handleClearImage}
                            sx={{
                              textTransform: "none",
                              color: "error.main",
                            }}
                          >
                            Clear Image
                          </Button>
                        )}
                      </Stack>
                    </Stack>
                  </Grid>
                </Grid>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Divider />
              </Grid>

              {/* --- Personal Information Section --- */}
              <Grid size={{ xs: 12 }}>
                <Grid container spacing={2}>
                  {/* Left Column: Description */}
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Stack
                      direction="row"
                      spacing={1.5}
                      alignItems="center"
                      sx={{ mb: 1 }}
                    >
                      <Box
                        sx={{
                          p: 0.5,
                          bgcolor: "#f1f5f9",
                          borderRadius: 1,
                          display: "flex",
                        }}
                      >
                        <UserIcon size={18} color="#475569" />
                      </Box>
                      <Typography variant="subtitle1" fontWeight="600">
                        Personal Information
                      </Typography>
                    </Stack>
                    <Typography variant="caption" color="text.secondary">
                      Your personal details and contact information.
                    </Typography>
                  </Grid>

                  {/* Right Column: Inputs */}
                  <Grid size={{ xs: 12, md: 8 }}>
                    <Stack spacing={2}>
                      {/* Username */}
                      <Box>
                        <InputLabel
                          shrink
                          htmlFor="username"
                          sx={{ mb: 0.5, fontSize: "0.875rem", fontWeight: 500 }}
                        >
                          Username <span style={{ color: "#d32f2f" }}>*</span>
                        </InputLabel>
                        <TextField
                          id="username"
                          fullWidth
                          placeholder="username"
                          variant="outlined"
                          size="small"
                          {...register("user.username", { required: "Username is required" })}
                          error={!!errors.user?.username}
                          helperText={errors.user?.username?.message}
                          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
                        />
                      </Box>

                      {/* Email */}
                      <Box>
                        <InputLabel
                          shrink
                          htmlFor="email"
                          sx={{ mb: 0.5, fontSize: "0.875rem", fontWeight: 500 }}
                        >
                          Email <span style={{ color: "#d32f2f" }}>*</span>
                        </InputLabel>
                        <TextField
                          id="email"
                          fullWidth
                          placeholder="email@example.com"
                          variant="outlined"
                          size="small"
                          type="email"
                          disabled={!!initial?.email}
                          {...register("user.email", { required: "Email is required" })}
                          error={!!errors.user?.email}
                          helperText={errors.user?.email?.message}
                          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
                        />
                      </Box>

                      {/* Name Fields */}
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 4 }}>
                          <InputLabel
                            shrink
                            htmlFor="first_name"
                            sx={{ mb: 0.5, fontSize: "0.875rem", fontWeight: 500 }}
                          >
                            First Name <span style={{ color: "#d32f2f" }}>*</span>
                          </InputLabel>
                          <TextField
                            id="first_name"
                            fullWidth
                            placeholder="First Name"
                            variant="outlined"
                            size="small"
                            {...register("user.first_name", { required: "First name is required" })}
                            error={!!errors.user?.first_name}
                            helperText={errors.user?.first_name?.message}
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                          <InputLabel
                            shrink
                            htmlFor="middle_name"
                            sx={{ mb: 0.5, fontSize: "0.875rem", fontWeight: 500 }}
                          >
                            Middle Name
                          </InputLabel>
                          <TextField
                            id="middle_name"
                            fullWidth
                            placeholder="Middle Name"
                            variant="outlined"
                            size="small"
                            {...register("user.middle_name")}
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                          <InputLabel
                            shrink
                            htmlFor="surname"
                            sx={{ mb: 0.5, fontSize: "0.875rem", fontWeight: 500 }}
                          >
                            Surname <span style={{ color: "#d32f2f" }}>*</span>
                          </InputLabel>
                          <TextField
                            id="surname"
                            fullWidth
                            placeholder="Surname"
                            variant="outlined"
                            size="small"
                            {...register("user.surname", { required: "Surname is required" })}
                            error={!!errors.user?.surname}
                            helperText={errors.user?.surname?.message}
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
                          />
                        </Grid>
                      </Grid>

                      {/* Phone */}
                      <Box>
                        <InputLabel
                          shrink
                          htmlFor="tel"
                          sx={{ mb: 0.5, fontSize: "0.875rem", fontWeight: 500 }}
                        >
                          Phone Number <span style={{ color: "#d32f2f" }}>*</span>
                        </InputLabel>
                        <TextField
                          id="tel"
                          fullWidth
                          placeholder="+66 XX XXX XXXX"
                          variant="outlined"
                          size="small"
                          {...register("user.tel", { required: "Phone number is required" })}
                          error={!!errors.user?.tel}
                          helperText={errors.user?.tel?.message}
                          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
                        />
                      </Box>

                      {/* Address */}
                      <Box>
                        <InputLabel
                          shrink
                          htmlFor="address"
                          sx={{ mb: 0.5, fontSize: "0.875rem", fontWeight: 500 }}
                        >
                          Address <span style={{ color: "#d32f2f" }}>*</span>
                        </InputLabel>
                        <TextField
                          id="address"
                          fullWidth
                          placeholder="Your full address"
                          variant="outlined"
                          size="small"
                          multiline
                          minRows={2}
                          {...register("user.address", { required: "Address is required" })}
                          error={!!errors.user?.address}
                          helperText={errors.user?.address?.message}
                          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
                        />
                      </Box>

                      {/* Country & Birth Date */}
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <InputLabel
                            shrink
                            htmlFor="country_id"
                            sx={{ mb: 0.5, fontSize: "0.875rem", fontWeight: 500 }}
                          >
                            Country
                          </InputLabel>
                          <Controller
                            name="user.country_id"
                            control={control}
                            render={({ field, fieldState }) => {
                              const value = field.value ?? "";
                              const currentNotInList =
                                value &&
                                !countryLoading &&
                                !countryOptions.some((o) => o.value === value);

                              return (
                                <TextField
                                  id="country_id"
                                  select
                                  fullWidth
                                  disabled={countryLoading}
                                  value={value}
                                  onChange={(e) => field.onChange(e.target.value || "")}
                                  error={!!fieldState.error || !!countryError}
                                  helperText={
                                    fieldState.error?.message ||
                                    (countryError ? String(countryError) : "")
                                  }
                                  size="small"
                                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
                                  slotProps={{ inputLabel: { shrink: true } }}
                                >
                                  <MenuItem value="">
                                    {countryLoading ? "Loading..." : "— Select Country —"}
                                  </MenuItem>

                                  {currentNotInList && (
                                    <MenuItem value={value}>Current (unlisted)</MenuItem>
                                  )}

                                  {countryOptions.map((c) => (
                                    <MenuItem key={c.value} value={c.value}>
                                      {c.label}
                                    </MenuItem>
                                  ))}
                                </TextField>
                              );
                            }}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <InputLabel
                            shrink
                            htmlFor="birth_date"
                            sx={{ mb: 0.5, fontSize: "0.875rem", fontWeight: 500 }}
                          >
                            Birth Date
                          </InputLabel>
                          <TextField
                            id="birth_date"
                            fullWidth
                            variant="outlined"
                            size="small"
                            type="date"
                            {...register("user.birth_date")}
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
                          />
                        </Grid>
                      </Grid>
                    </Stack>
                  </Grid>
                </Grid>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Divider />
              </Grid>

              {/* --- Bio Section --- */}
              <Grid size={{ xs: 12 }}>
                <Grid container spacing={2}>
                  {/* Left Column */}
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Stack
                      direction="row"
                      spacing={1.5}
                      alignItems="center"
                      sx={{ mb: 1 }}
                    >
                      <Box
                        sx={{
                          p: 0.5,
                          bgcolor: "#f1f5f9",
                          borderRadius: 1,
                          display: "flex",
                        }}
                      >
                        <FileText size={18} color="#475569" />
                      </Box>
                      <Typography variant="subtitle1" fontWeight="600">
                        Professional Bio
                      </Typography>
                    </Stack>
                    <Typography variant="caption" color="text.secondary">
                      A brief description of your content and expertise.
                    </Typography>
                  </Grid>

                  {/* Right Column */}
                  <Grid size={{ xs: 12, md: 8 }}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      sx={{ mb: 0.5 }}
                    >
                      <InputLabel
                        shrink
                        htmlFor="bio"
                        sx={{ fontSize: "0.875rem", fontWeight: 500 }}
                      >
                        Description <span style={{ color: "#d32f2f" }}>*</span>
                      </InputLabel>
                      <Typography
                        variant="caption"
                        color={
                          bioValue.length > maxBioLength
                            ? "error"
                            : "text.secondary"
                        }
                      >
                        {bioValue.length}/{maxBioLength}
                      </Typography>
                    </Stack>
                    <TextField
                      id="bio"
                      fullWidth
                      multiline
                      minRows={4}
                      placeholder="Describe your professional background..."
                      variant="outlined"
                      error={!!errors.creator?.bio}
                      helperText={errors.creator?.bio?.message}
                      {...register("creator.bio", {
                        required: "Bio is required",
                        maxLength: {
                          value: maxBioLength,
                          message: `Bio must be less than ${maxBioLength} characters`,
                        },
                      })}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Divider />
              </Grid>

              {/* --- Social Links Section --- */}
              <Grid size={{ xs: 12 }}>
                <Grid container spacing={2}>
                  {/* Left Column */}
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Stack
                      direction="row"
                      spacing={1.5}
                      alignItems="center"
                      sx={{ mb: 1 }}
                    >
                      <Box
                        sx={{
                          p: 0.5,
                          bgcolor: "#f1f5f9",
                          borderRadius: 1,
                          display: "flex",
                        }}
                      >
                        <Link2 size={18} color="#475569" />
                      </Box>
                      <Typography variant="subtitle1" fontWeight="600">
                        Portfolio & Social
                      </Typography>
                    </Stack>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      External links to verify your identity.
                    </Typography>
                    <Typography variant="caption" color="error" display="block" sx={{ mb: 2 }}>
                      At least one link is required.
                    </Typography>

                    {socialLinks.length < 5 && (
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Plus size={16} />}
                        onClick={addSocialLink}
                        sx={{
                          textTransform: "none",
                          color: "text.secondary",
                          borderColor: "divider",
                          borderRadius: 1.5,
                        }}
                      >
                        Add Link
                      </Button>
                    )}
                  </Grid>

                  {/* Right Column */}
                  <Grid size={{ xs: 12, md: 8 }}>
                    <Stack spacing={2}>
                      {socialLinks.length === 0 && (
                        <Box
                          sx={{
                            p: 3,
                            border: "1px dashed",
                            borderColor: "divider",
                            borderRadius: 1.5,
                            textAlign: "center",
                          }}
                        >
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            fontStyle="italic"
                          >
                            No links added. Click "Add Link" on the left to
                            connect your portfolio.
                          </Typography>
                        </Box>
                      )}

                      {socialLinks.map((link, index) => {
                        const Icon = getPlatformIcon(link.platform);
                        return (
                          <Grid
                            container
                            spacing={1}
                            key={index}
                            alignItems="flex-start"
                          >
                            <Grid size={{ xs: 4, sm: 4 }}>
                              <FormControl fullWidth size="small">
                                <Select
                                  value={link.platform}
                                  onChange={(e) =>
                                    updateSocialLink(
                                      index,
                                      "platform",
                                      e.target.value,
                                    )
                                  }
                                  displayEmpty
                                  IconComponent={ChevronDown}
                                  sx={{ borderRadius: 1.5 }}
                                >
                                  {socialPlatforms.map((p) => (
                                    <MenuItem
                                      key={p.value}
                                      value={p.value}
                                      disabled={socialLinks.some(
                                        (l, i) =>
                                          i !== index && l.platform === p.value,
                                      )}
                                    >
                                      {p.label}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </Grid>
                            <Grid size={{ xs: "grow" }}>
                              <TextField
                                fullWidth
                                placeholder={getPlatformPlaceholder(
                                  link.platform,
                                )}
                                value={link.url}
                                onChange={(e) =>
                                  updateSocialLink(index, "url", e.target.value)
                                }
                                size="small"
                                error={socialLinkError && link.url.trim() === ""}
                                helperText={
                                  socialLinkError && link.url.trim() === ""
                                    ? "Please add at least one social link"
                                    : ""
                                }
                                sx={{
                                  "& .MuiOutlinedInput-root": {
                                    borderRadius: 1.5,
                                  },
                                }}
                                slotProps={{
                                  input: {
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <Icon size={16} color="#94a3b8" />
                                      </InputAdornment>
                                    ),
                                  },
                                }}
                              />
                            </Grid>
                            {socialLinks.length > 1 && (
                              <Grid size="auto">
                                <IconButton
                                  onClick={() => removeSocialLink(index)}
                                  size="large"
                                  sx={{
                                    color: "text.disabled",
                                    "&:hover": {
                                      color: "error.main",
                                      bgcolor: "error.lighter",
                                    },
                                  }}
                                >
                                  <X size={20} />
                                </IconButton>
                              </Grid>
                            )}
                          </Grid>
                        );
                      })}
                    </Stack>
                  </Grid>
                </Grid>
              </Grid>

              {/* --- File Upload Section --- */}
              <Grid size={{ xs: 12 }}>
                <Grid container spacing={2} alignItems="flex-start">
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                      <Box sx={{ p: 0.5, bgcolor: "#f1f5f9", borderRadius: 1, display: 'flex' }}>
                        <Briefcase size={18} color="#475569" />
                      </Box>
                      <Typography variant="subtitle1" fontWeight="600">
                        File Attachments
                      </Typography>
                    </Stack>
                    <Typography variant="caption" color="text.secondary">
                      Please upload the following documents for verification.
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 8 }}>
                    <Stack spacing={2}>
                      <Button
                        variant={fileUploads.id_card ? "contained" : "outlined"}
                        component="label"
                        size="small"
                        sx={{
                          justifyContent: 'flex-start',
                          borderRadius: 1.5,
                          ...(fileUploads.id_card && {
                            bgcolor: '#4caf50',
                            color: 'white',
                            '&:hover': {
                              bgcolor: '#45a049',
                            },
                          }),
                        }}
                      >
                        {fileUploads.id_card ? `ID Card: ${fileUploads.id_card.name}` : 'Upload ID Card'}
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          hidden
                          onChange={e => handleFileChange('id_card', e.target.files?.[0] || null)}
                        />
                      </Button>
                      <Button
                        variant={fileUploads.house_registration ? "contained" : "outlined"}
                        component="label"
                        size="small"
                        sx={{
                          justifyContent: 'flex-start',
                          borderRadius: 1.5,
                          ...(fileUploads.house_registration && {
                            bgcolor: '#4caf50',
                            color: 'white',
                            '&:hover': {
                              bgcolor: '#45a049',
                            },
                          }),
                        }}
                      >
                        {fileUploads.house_registration ? `House Registration: ${fileUploads.house_registration.name}` : 'Upload House Registration'}
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          hidden
                          onChange={e => handleFileChange('house_registration', e.target.files?.[0] || null)}
                        />
                      </Button>
                      <Button
                        variant={fileUploads.bank_statement ? "contained" : "outlined"}
                        component="label"
                        size="small"
                        sx={{
                          justifyContent: 'flex-start',
                          borderRadius: 1.5,
                          ...(fileUploads.bank_statement && {
                            bgcolor: '#4caf50',
                            color: 'white',
                            '&:hover': {
                              bgcolor: '#45a049',
                            },
                          }),
                        }}
                      >
                        {fileUploads.bank_statement ? `Bank Statement: ${fileUploads.bank_statement.name}` : 'Upload Bank Statement'}
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          hidden
                          onChange={e => handleFileChange('bank_statement', e.target.files?.[0] || null)}
                        />
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>
              </Grid>

              {/* --- Review Notice --- */}
              <Grid size={{ xs: 12 }}>
                <Alert
                  severity="info"
                  icon={<ShieldCheck size={20} />}
                  sx={{
                    bgcolor: "#f8fafc",
                    color: "text.primary",
                    border: "1px solid",
                    borderColor: "divider",
                    "& .MuiAlert-icon": { color: "#475569" },
                  }}
                >
                  <AlertTitle sx={{ fontSize: "0.875rem", fontWeight: 600 }}>
                    Review Process
                  </AlertTitle>
                  <Typography variant="caption" color="text.secondary">
                    Your application will undergo a standard review process. You
                    will be notified of the status via your registered email.
                  </Typography>
                </Alert>
              </Grid>

              {/* --- Actions --- */}
              <Grid size={{ xs: 12 }}>
                <Stack
                  direction={{ xs: "column-reverse", sm: "row" }}
                  justifyContent="flex-end"
                  spacing={2}
                  sx={{ pt: 2 }}
                >
                  {onCancel && (
                    <Button
                      variant="text"
                      onClick={onCancel}
                      sx={{
                        color: "text.secondary",
                        textTransform: "none",
                        fontWeight: 500,
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={submitting}
                    disableElevation
                    sx={{
                      bgcolor: "#0f172a",
                      color: "white",
                      textTransform: "none",
                      fontWeight: 600,
                      px: 4,
                      py: 1.2,
                      borderRadius: 1.5,
                      "&:hover": { bgcolor: "#1e293b" },
                    }}
                  >
                    {submitting ? (
                      <Stack direction="row" spacing={1} alignItems="center">
                        <CircularProgress size={16} color="inherit" />
                        <span>Processing...</span>
                      </Stack>
                    ) : (
                      "Submit Application"
                    )}
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </form>
        </Paper>

        <Typography
          variant="caption"
          align="center"
          display="block"
          color="text.disabled"
          sx={{ mt: 3 }}
        >
          © 2024 Platform Name. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}
