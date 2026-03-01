import { useState, useEffect } from "react";
import {
  Grid,
  Box,
  Button,
  TextField,
  Typography,
  Avatar,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Camera, User, Phone, MapPin, X, Lock } from "lucide-react";
import { useCountryOptions } from "@/hooks/useCountryOptions";
import { SubmitHandler, useForm } from "react-hook-form";

type FormValues = {
  clerk_id: string;
  email: string | null;
  username: string;
  first_name: string;
  middle_name: string | null;
  surname: string;
  tel: string;
  address: string;
  user_description: string | null;
  country_id: string | null;
  birth_date: string | null;
  user_image: File | null;
  password?: string | null;
  remove_image?: boolean;
};

type Props = {
  onSubmit?: (fd: FormData) => Promise<void> | void;
  onSuccess?: () => void;
  onCancel?: () => void;
  clerk_id: string | null;
  username: string | null;
  email: string | null;
  isUserHavePassword?: boolean;
  imageUrl?: string | null;
};

export type CountryOption = { id: string; name: string };

export default function UserForm({
  onSubmit,
  onSuccess,
  onCancel,
  clerk_id,
  username,
  email,
  isUserHavePassword,
  imageUrl,
}: Props) {
  const { register, handleSubmit, setValue } = useForm<FormValues>({
    defaultValues: {
      clerk_id: "",
      email: null,
      username: "",
      first_name: "",
      middle_name: null,
      surname: "",
      tel: "",
      address: "",
      user_description: null,
      country_id: "",
      birth_date: null,
      user_image: null,
      password: null,
      remove_image: false,
    },
  });

  const [submitting, setSubmitting] = useState(false);
  const [imagePreviewUrl, setPreviewUrl] = useState<string | null>(imageUrl || null);

  useEffect(() => {
    const initImage = async () => {
      if (imageUrl) {
        try {
          const response = await fetch(imageUrl);
          const blob = await response.blob();
          const file = new File([blob], "profile.jpg", { type: blob.type });
          setValue("user_image", file);
        } catch (e) {
          console.error("Failed to load Clerk image", e);
        }
      }
    };
    initImage();
  }, [imageUrl, setValue]);

  const { countryOptions, countryLoading, countryError } = useCountryOptions();

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setValue("user_image", selectedFile);
      setValue("remove_image", false);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleFormSubmit: SubmitHandler<FormValues> = async (values) => {
    try {
      setSubmitting(true);
      const fd = new FormData();

      const payload = {
        clerk_id: clerk_id,
        email: email || null,
        username: username,
        first_name: values.first_name,
        middle_name: values.middle_name || null,
        surname: values.surname,
        tel: values.tel,
        address: values.address,
        user_description: values.user_description || null,
        country_id: values.country_id || null,
        birth_date: values.birth_date! || null,
      };
      fd.append("data", JSON.stringify(payload));
      fd.append("remove_image", values.remove_image ? "true" : "false");

      if (values.user_image) {
        fd.append("media", values.user_image);
      }
      if (values.password) {
        fd.append("password", values.password);
      }

      await onSubmit?.(fd);
      onSuccess?.();
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 900,
        mx: "auto",
        py: 6,
      }}
    >
      {/* Header */}
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
          Set Up Your Profile
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Tell us a bit about yourself to get started
        </Typography>
      </Box>

      {/* Profile Image Upload */}


      {/* Form */}
      <Box
        component="form"
        onSubmit={handleSubmit(handleFormSubmit)}
        sx={{
          bgcolor: "white",
          borderRadius: 4,
          p: 4,
          boxShadow: "0 2px 24px rgba(0, 0, 0, 0.08)",
          border: "1px solid",
          borderColor: "grey.300",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
          <Box sx={{ position: "relative" }}>
            <Box
              component="label"
              sx={{
                cursor: "pointer",
                display: "inline-block",
                position: "relative",
                "&:hover": { opacity: 0.9 },
              }}
            >
              <Avatar
                src={imagePreviewUrl || undefined}
                sx={{
                  width: 120,
                  height: 120,
                  border: "3px dashed",
                  borderColor: imagePreviewUrl ? "primary.main" : "grey.300",
                  bgcolor: imagePreviewUrl ? "transparent" : "grey.100",
                }}
              >
                {!imagePreviewUrl && <Camera size={40} color="#9e9e9e" />}
              </Avatar>
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFilesChange}
              />
            </Box>

            <IconButton
              component="label"
              sx={{
                position: "absolute",
                bottom: 0,
                right: 0,
                bgcolor: "primary.main",
                color: "white",
                width: 36,
                height: 36,
                "&:hover": {
                  bgcolor: "primary.dark",
                },
              }}
            >
              <Camera size={18} />
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFilesChange}
              />
            </IconButton>

            {imagePreviewUrl && (
              <IconButton
                onClick={() => {
                  setPreviewUrl(null);
                  setValue("user_image", null);
                  setValue("remove_image", true);
                }}
                sx={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  bgcolor: "error.main",
                  color: "white",
                  width: 28,
                  height: 28,
                  "&:hover": {
                    bgcolor: "error.dark",
                  },
                }}
              >
                <X size={16} />
              </IconButton>
            )}
          </Box>
        </Box>

        {/* Personal Information Section */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                bgcolor: "#ffe0f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <User size={20} color="#e91e63" />
            </Box>
            <Typography variant="h6" fontWeight={600}>
              Personal Information
            </Typography>
          </Box>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="First Name"
                fullWidth
                required
                size="small"
                {...register("first_name", { required: true })}
                sx={{ bgcolor: "white" }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="Middle Name"
                fullWidth
                size="small"
                {...register("middle_name")}
                sx={{ bgcolor: "white" }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="Surname"
                fullWidth
                required
                size="small"
                {...register("surname", { required: true })}
                sx={{ bgcolor: "white" }}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Contact Details Section */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                bgcolor: "#fff9e0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Phone size={20} color="#ffa000" />
            </Box>
            <Typography variant="h6" fontWeight={600}>
              Contact Details
            </Typography>
          </Box>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Phone Number"
                fullWidth
                required
                size="small"
                {...register("tel", { required: true })}
                sx={{ bgcolor: "white" }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Birth Date"
                type="date"
                fullWidth
                size="small"
                InputLabelProps={{ shrink: true }}
                {...register("birth_date")}
                sx={{ bgcolor: "white" }}
              />
            </Grid>

          </Grid>
        </Box>

        {/* Location Section */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                bgcolor: "#e0f5e9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MapPin size={20} color="#4caf50" />
            </Box>
            <Typography variant="h6" fontWeight={600}>
              Location
            </Typography>
          </Box>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth size="small" required>
                <InputLabel>Country</InputLabel>
                <Select
                  label="Country"
                  defaultValue=""
                  {...register("country_id", {
                    required: "Please select country",
                  })}
                  disabled={countryLoading}
                  sx={{ bgcolor: "white" }}
                >
                  <MenuItem value="">
                    {countryLoading ? "Loading..." : "— Select Country —"}
                  </MenuItem>
                  {countryOptions.map((c) => (
                    <MenuItem key={c.value} value={c.value}>
                      {c.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {countryError && (
                <Typography color="error" variant="caption" sx={{ mt: 0.5 }}>
                  {countryError}
                </Typography>
              )}
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Address"
                fullWidth
                required
                size="small"
                {...register("address", { required: true })}
                sx={{ bgcolor: "white" }}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Account Security Section */}
        {!isUserHavePassword && (
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  bgcolor: "#e3f2fd",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Lock size={20} color="#2196f3" />
              </Box>
              <Typography variant="h6" fontWeight={600}>
                Account Security
              </Typography>
            </Box>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Set Password"
                  type="password"
                  fullWidth
                  size="small"
                  placeholder="Create a password for your account"
                  {...register("password", {
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  })}
                  sx={{ bgcolor: "white" }}
                  helperText="You currently use social login. Set a password to enable email/password login."
                />
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={submitting}
          sx={{
            py: 1.5,
            textTransform: "uppercase",
            fontWeight: 600,
            fontSize: "0.9rem",
            bgcolor: "#1976d2",
            "&:hover": {
              bgcolor: "#1565c0",
            },
          }}
        >
          {submitting ? "Saving..." : "Complete Setup"}
        </Button>
      </Box>
    </Box>
  );
}
