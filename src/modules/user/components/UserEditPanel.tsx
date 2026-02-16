import { useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {
  Box,
  Button,
  MenuItem,
  Paper,
  TextField,
  Typography,
  IconButton,
  Divider,
  Stack
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm, useFieldArray } from "react-hook-form";
import { useCountryOptions } from "@/hooks/useCountryOptions";
import { SectionCard } from "@/components/ui/SectionCard";
import { Trash2, Plus, User as UserIcon, Calendar, Globe, Mail, Phone, MapPin, Link2 } from "lucide-react";
import { SocialLink } from "@/modules/creator/types/creator";
import { socialPlatforms } from "@/utils/constants";

type FormValues = {
  user: {
    id: string;
    clerk_id: string;
    email: string | null;
    username: string;
    first_name: string | null;
    middle_name: string | null;
    surname: string | null;
    tel: string | null;
    address: string | null;
    country_id: string | null;
    birth_date: string | null; // ISO "YYYY-MM-DD"
    image: File | null;
    new_password?: string;
    confirm_password?: string;
  };
  creator: {
    bio?: string | null;
    social_links?: SocialLink[];
  };
};

type InitialValues = any; // Allow flexible initial values including nested creator data

type Props = {
  initial?: InitialValues;
  onSubmit?: (fd: FormData) => Promise<void> | void;
  onSuccess?: () => void;
  onCancel?: () => void;
};

// Edit Profile (updates Clerk + backend)
export default function EditPanel({
  initial,
  onSubmit,
  onSuccess,
  onCancel,
}: Props) {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      user: {
        id: "",
        clerk_id: "",
        email: null,
        username: "",
        first_name: "",
        middle_name: null,
        surname: "",
        tel: "",
        address: "",
        country_id: "",
        birth_date: null,
        image: null,
        new_password: "",
        confirm_password: "",
      },
      creator: {
        bio: "",
        social_links: [],
      },
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "creator.social_links",
  });

  const [submitting, setSubmitting] = useState(false);
  const [imagePreviewUrl, setPreviewUrl] = useState<string | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [removeEmail, setRemoveEmail] = useState(false);

  const { countryOptions, countryLoading, countryError } = useCountryOptions();

  const isCreator = initial?.role === "creator";
  const creatorData = initial?.creator;

  useEffect(() => {
    if (initial) {
      reset({
        user: {
          id: initial.id ?? "",
          clerk_id: initial.clerk_id ?? "",
          email: initial.email ?? null,
          username: initial.username ?? "",
          first_name: initial.first_name ?? "",
          middle_name: initial.middle_name ?? null,
          surname: initial.surname ?? "",
          tel: initial.tel ?? "",
          address: initial.address ?? "",
          country_id: initial.country_id ?? "",
          birth_date: initial.birth_date ? (initial.birth_date instanceof Date ? initial.birth_date.toISOString().split('T')[0] : initial.birth_date) : null,
          image: null,
          new_password: "",
          confirm_password: "",
        },
        creator: {
          bio: creatorData?.bio ?? "",
          social_links: creatorData?.social_links ?? [],
        }
      });
      console.log("social_links: ", creatorData?.social_links);
      setPreviewUrl(initial.image?.url ?? initial.image_url ?? null);
      setRemoveImage(false);
      setRemoveEmail(false);
    }
  }, [initial, reset, creatorData]);

  const handleAddLink = () => {
    const currentLinks = watch("creator.social_links") || [];
    if (currentLinks.length < socialPlatforms.length) {
      const usedPlatforms = currentLinks.map((l) => l.platform);
      const availablePlatform = socialPlatforms.find(
        (p) => !usedPlatforms.includes(p.value)
      );
      if (availablePlatform) {
        append({ platform: availablePlatform.value, url: "" });
      }
    }
  };

  const handleFormSubmit: SubmitHandler<FormValues> = async (values) => {
    try {
      setSubmitting(true);
      const fd = new FormData();

      const payload = {
        user: {
          id: initial?.id ?? null,
          clerk_id: initial?.clerk_id,
          email: values.user.email || null,
          username: values.user.username,
          first_name: values.user.first_name,
          middle_name: values.user.middle_name || null,
          surname: values.user.surname,
          tel: values.user.tel,
          address: values.user.address,
          country_id: values.user.country_id || null,
          birth_date: values.user.birth_date || null,
          remove_image: removeImage,
          remove_email: removeEmail,
        },
        creator: {
          bio: values.creator.bio,
          social_links: values.creator.social_links,
        },
      };

      fd.append("data", JSON.stringify(payload));

      if (values.user.image) fd.append("image", values.user.image);
      if (values.user.new_password) fd.append("password_new", values.user.new_password);
      if (values.user.confirm_password) fd.append("password_confirm", values.user.confirm_password);

      console.log("Submitting with payload:", payload);
      await onSubmit?.(fd);
      onSuccess?.();
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setSubmitting(false);
    }
  };

  const hasEmail = !!initial?.email;

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} gutterBottom mb={3}>
        Edit Profile
      </Typography>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Grid container spacing={3}>
          {/* Personal Info */}
          <Grid size={{ xs: 12, md: 6 }}>
            <SectionCard title="Personal Information" icon={UserIcon}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    label="Username (Clerk)"
                    fullWidth
                    slotProps={{ inputLabel: { shrink: true } }}
                    {...register("user.username", { required: true })}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    label="First name"
                    fullWidth
                    slotProps={{ inputLabel: { shrink: true } }}
                    {...register("user.first_name")}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    label="Middle name"
                    fullWidth
                    slotProps={{ inputLabel: { shrink: true } }}
                    {...register("user.middle_name")}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    label="Surname"
                    fullWidth
                    slotProps={{ inputLabel: { shrink: true } }}
                    {...register("user.surname")}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    label="Birth date"
                    type="date"
                    fullWidth
                    slotProps={{ inputLabel: { shrink: true } }}
                    {...register("user.birth_date")}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Controller
                    name="user.country_id"
                    control={control}
                    rules={{ required: "Please select country" }}
                    render={({ field, fieldState }) => {
                      const value = field.value ?? "";
                      const currentNotInList =
                        value &&
                        !countryLoading &&
                        !countryOptions.some((o) => o.value === value);

                      return (
                        <TextField
                          label="Country"
                          select
                          fullWidth
                          disabled={countryLoading}
                          slotProps={{ inputLabel: { shrink: true } }}
                          value={value}
                          onChange={(e) => field.onChange(e.target.value || "")}
                          error={!!fieldState.error || !!countryError}
                          helperText={
                            fieldState.error?.message ||
                            (countryError ? String(countryError) : " ")
                          }
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
              </Grid>
            </SectionCard>
          </Grid>

          {/* Contact Details */}
          <Grid size={{ xs: 12, md: 6 }}>
            <SectionCard title="Contact Details" icon={Mail}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    label="Email (Clerk)"
                    fullWidth
                    slotProps={{ inputLabel: { shrink: true } }}
                    {...register("user.email")}
                    disabled={hasEmail && !removeEmail}
                    helperText={
                      hasEmail
                        ? removeEmail
                          ? "This email will be removed"
                          : "Connected"
                        : "No email connected — add one"
                    }
                  />
                  <Box mt={1}>
                    {hasEmail && !removeEmail && (
                      <Button size="small" color="error" onClick={() => { setRemoveEmail(true); setValue("user.email", ""); }}>Remove this email</Button>
                    )}
                    {hasEmail && removeEmail && (
                      <Button size="small" onClick={() => { setRemoveEmail(false); setValue("user.email", initial?.email ?? ""); }}>Undo remove</Button>
                    )}
                  </Box>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    label="Tel"
                    fullWidth
                    slotProps={{ inputLabel: { shrink: true } }}
                    {...register("user.tel", { required: true })}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    label="Address"
                    fullWidth
                    slotProps={{ inputLabel: { shrink: true } }}
                    {...register("user.address")}
                    multiline
                    rows={3}
                  />
                </Grid>
              </Grid>
            </SectionCard>
          </Grid>

          {/* Password Section */}
          <Grid size={{ xs: 12 }}>
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, bgcolor: "white" }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>Change Password</Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label="New password"
                    type="password"
                    fullWidth
                    autoComplete="new-password"
                    slotProps={{ inputLabel: { shrink: true } }}
                    {...register("user.new_password", {
                      minLength: { value: 8, message: "At least 8 characters" },
                    })}
                    error={!!errors.user?.new_password}
                    helperText={errors.user?.new_password?.message || " "}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label="Confirm password"
                    type="password"
                    fullWidth
                    autoComplete="new-password"
                    slotProps={{ inputLabel: { shrink: true } }}
                    {...register("user.confirm_password", {
                      validate: (v, f) =>
                        v === f.user.new_password || "Passwords do not match",
                    })}
                    error={!!errors.user?.confirm_password}
                    helperText={errors.user?.confirm_password?.message || " "}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* About / Bio */}
          {isCreator && (<Grid size={{ xs: 12 }}>
            <SectionCard title="Bio">
              <TextField
                label="Bio / Description"
                fullWidth
                multiline
                rows={4}
                {...register("creator.bio")}
                placeholder="Tell us about yourself..."
              />
            </SectionCard>
          </Grid>)}

          {/* Creator Information - ONLY FOR CREATORS */}
          {isCreator && (
            <Grid size={{ xs: 12 }}>
              <SectionCard title="Creator Social Links" icon={Link2}>
                <Stack spacing={2}>
                  {fields.map((field, index) => {
                    const currentPlatform = watch(`creator.social_links.${index}.platform`);
                    const PlatformIcon =
                      socialPlatforms.find((p) => p.value === currentPlatform)?.icon ||
                      Globe;

                    return (
                      <Grid
                        container
                        spacing={2}
                        key={field.id}
                        alignItems="flex-start"
                      >
                        <Grid size={{ xs: 12, sm: 4 }}>
                          <Controller
                            control={control}
                            name={`creator.social_links.${index}.platform`}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                select
                                label="Platform"
                                fullWidth
                                size="small"
                                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
                              >
                                {socialPlatforms.map((p) => (
                                  <MenuItem
                                    key={p.value}
                                    value={p.value}
                                    disabled={fields.some(
                                      (f, i) =>
                                        i !== index &&
                                        watch(`creator.social_links.${i}.platform`) === p.value
                                    )}
                                  >
                                    <Stack
                                      direction="row"
                                      spacing={1}
                                      alignItems="center"
                                    >
                                      <p.icon size={16} />
                                      <Typography>{p.label}</Typography>
                                    </Stack>
                                  </MenuItem>
                                ))}
                              </TextField>
                            )}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 7 }}>
                          <TextField
                            label="URL"
                            fullWidth
                            size="small"
                            {...register(`creator.social_links.${index}.url` as const, {
                              required: true,
                            })}
                            defaultValue={field.url}
                          />
                        </Grid>
                        <Grid
                          size={{ xs: 12, sm: 1 }}
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          sx={{ pt: { xs: 0, sm: 0 } }}
                        >
                          <IconButton
                            color="error"
                            onClick={() => remove(index)}
                            disabled={fields.length <= 1}
                            sx={{
                              opacity: fields.length <= 1 ? 0.3 : 1,
                            }}
                          >
                            <Trash2 size={20} />
                          </IconButton>
                        </Grid>
                      </Grid>
                    );
                  })}
                  {fields.length < socialPlatforms.length && (
                    <Button
                      startIcon={<Plus size={18} />}
                      variant="outlined"
                      onClick={handleAddLink}
                      sx={{ alignSelf: "flex-start", borderRadius: 1.5 }}
                    >
                      Add Link
                    </Button>
                  )}
                </Stack>
              </SectionCard>
            </Grid>
          )}

        </Grid>

        <Box mt={4} display="flex" gap={2} justifyContent="flex-end">
          <Button
            type="button"
            variant="text"
            onClick={onCancel ?? (() => history.back())}
            disabled={submitting}
            size="large"
          >
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={submitting} size="large" sx={{ px: 4 }}>
            {submitting ? "Saving..." : "Save Changes"}
          </Button>
        </Box>
      </form>
    </Box>
  );
}
