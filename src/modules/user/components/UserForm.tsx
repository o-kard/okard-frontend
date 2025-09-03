import { useEffect, useMemo, useRef, useState } from "react";
import { Grid, Box, Button, TextField, Typography } from "@mui/material";
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
};

type Props = {
  onSubmit?: (fd: FormData) => Promise<void> | void;
  onSuccess?: () => void;
  onCancel?: () => void;
  clerk_id: string | null;
  username: string | null;
  email: string | null;
};

export type CountryOption = { id: string; name: string };

export default function UserForm({
  onSubmit,
  onSuccess,
  onCancel,
  clerk_id,
  username,
  email,
}: Props) {
  const { control, register, handleSubmit, setValue, watch } =
    useForm<FormValues>({
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
      },
    });

  const [submitting, setSubmitting] = useState(false);
  const [imagePreviewUrl, setPreviewUrl] = useState<string | null>(null);

  const { countryOptions, countryLoading, countryError } = useCountryOptions();

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setValue("user_image", selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleFormSubmit: SubmitHandler<FormValues> = async (values) => {
    try {
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
      if (values.user_image) {
        fd.append("image", values.user_image);
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
      component="form"
      onSubmit={handleSubmit(handleFormSubmit)}
      sx={{
        maxWidth: 600,
        mx: "auto",
        p: 4,
        borderRadius: 3,
        boxShadow: 2,
        bgcolor: "background.paper",
      }}
    >
      <Typography variant="h4" fontWeight={700} mb={3} textAlign="center">
        Set Up Your Profile
      </Typography>

      {/* Name Fields */}
      <Box display="flex" gap={2} flexWrap="wrap" mb={2}>
        <TextField
          label="First Name"
          fullWidth
          {...register("first_name", { required: true })}
        />
        <TextField label="Middle Name" fullWidth {...register("middle_name")} />
        <TextField
          label="Surname"
          fullWidth
          {...register("surname", { required: true })}
        />
      </Box>

      {/* Address and Tel */}
      <Box display="flex" gap={2} flexWrap="wrap" mb={2}>
        <TextField
          label="Address"
          fullWidth
          {...register("address", { required: true })}
        />
        <TextField
          label="Tel"
          fullWidth
          {...register("tel", { required: true })}
        />
      </Box>

      {/* Country and Birth Date */}
      <Box display="flex" gap={2} flexWrap="wrap" mb={2}>
        <Box flex={1}>
          <Typography mb={1}>Country</Typography>
          <select
            {...register("country_id", { required: "Please select country" })}
            className="border rounded px-3 py-2 w-full"
            disabled={countryLoading}
          >
            <option value="">
              {countryLoading ? "Loading..." : "— Select Country —"}
            </option>
            {countryOptions.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
          {countryError && (
            <Typography color="error" variant="caption">
              {countryError}
            </Typography>
          )}
        </Box>
        <TextField
          label="Birth Date"
          type="date"
          fullWidth
          InputLabelProps={{ shrink: true }}
          {...register("birth_date")}
        />
      </Box>

      {/* Profile Image */}
      <Box mb={2}>
        <Typography mb={1}>Profile Image</Typography>
        {imagePreviewUrl && (
          <Box mb={1}>
            <img
              src={imagePreviewUrl}
              alt="preview"
              style={{
                width: 200,
                height: 200,
                objectFit: "cover",
                borderRadius: 8,
                border: "1px solid #ccc",
              }}
            />
          </Box>
        )}
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            onClick={() => {
              setPreviewUrl(null);
              setValue("user_image", null);
            }}
          >
            Clear Image
          </Button>
          <Button variant="outlined" component="label">
            Upload Image
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleFilesChange}
            />
          </Button>
        </Box>
      </Box>

      {/* Description */}
      <TextField
        label="Description"
        fullWidth
        multiline
        rows={3}
        {...register("user_description")}
      />

      {/* Buttons */}
      <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
        {onCancel && (
          <Button variant="outlined" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="contained" disabled={submitting}>
          {submitting ? "Saving..." : "Save"}
        </Button>
      </Box>
    </Box>
  );
}
