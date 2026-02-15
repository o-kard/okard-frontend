import { useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {
  Box,
  Button,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import { Controller, set, SubmitHandler, useForm } from "react-hook-form";
import { useCountryOptions } from "@/hooks/useCountryOptions";

function sanitize(rt: string | null) {
  if (!rt || !rt.startsWith("/") || rt.startsWith("//")) return null;
  return rt;
}

type FormValues = {
  id: string;
  clerk_id: string;
  email: string | null;
  username: string;
  first_name: string | null;
  middle_name: string | null;
  surname: string | null;
  tel: string | null;
  address: string | null;
  user_description: string | null;
  country_id: string | null;
  birth_date: string | null; // ISO "YYYY-MM-DD"
  user_image: File | null; // สำหรับโชว์รูปเดิม
  new_password?: string;
  confirm_password?: string;
};

type InitialValues = Omit<FormValues, "user_image"> & {
  image_url?: string | null; // เพิ่มช่อง URL ของรูปเดิมจาก backend
};

type Props = {
  initial?: InitialValues; // <— ค่าเดิมตอนแก้ไข
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
      new_password: "",
      confirm_password: "",
    },
  });

  const [submitting, setSubmitting] = useState(false);
  const [imagePreviewUrl, setPreviewUrl] = useState<string | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [removeEmail, setRemoveEmail] = useState(false); // << ธงลบอีเมล

  const { countryOptions, countryLoading, countryError } = useCountryOptions();

  useEffect(() => {
    if (initial) {
      reset({
        clerk_id: initial.clerk_id ?? "",
        email: initial.email ?? null,
        username: initial.username ?? "",
        first_name: initial.first_name ?? "",
        middle_name: initial.middle_name ?? null,
        surname: initial.surname ?? "",
        tel: initial.tel ?? "",
        address: initial.address ?? "",
        user_description: initial.user_description ?? null,
        country_id: initial.country_id ?? "",
        birth_date: initial.birth_date ?? null,
        user_image: null, // เริ่มต้นยังไม่เปลี่ยนรูป
        new_password: "",
        confirm_password: "",
      });
      setPreviewUrl(initial.image_url ?? null); // พรีวิวรูปเดิม ถ้ามี
      setRemoveImage(false);
      setRemoveEmail(false); // << reset ธงลบอีเมล
    }
  }, [initial, reset]);

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setValue("user_image", selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setRemoveImage(false);
    }
  };

  const handleClearImage = () => {
    setPreviewUrl(null);
    setValue("user_image", null);
    setRemoveImage(true); // ต้องการลบรูปเดิม
  };

  const handleFormSubmit: SubmitHandler<FormValues> = async (values) => {
    try {
      setSubmitting(true);
      const fd = new FormData();

      const payload = {
        id: initial?.id ?? null, // ใช้ในการ PATCH/PUT
        clerk_id: initial?.clerk_id,
        email: values.email || null,
        username: values.username,
        first_name: values.first_name,
        middle_name: values.middle_name || null,
        surname: values.surname,
        tel: values.tel,
        address: values.address,
        user_description: values.user_description || null,
        country_id: values.country_id || null,
        birth_date: values.birth_date || null,
        remove_image: removeImage,
        remove_email: removeEmail, // << ส่งธงว่าผู้ใช้กดลบ
      };
      fd.append("data", JSON.stringify(payload));
      if (values.user_image) fd.append("image", values.user_image);

      // << ใส่รหัสผ่านในช่องแยก ไม่ปะปนกับ data >>
      if (values.new_password) fd.append("password_new", values.new_password);
      if (values.confirm_password)
        fd.append("password_confirm", values.confirm_password);

      await onSubmit?.(fd);
      onSuccess?.();
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setSubmitting(false);
    }
  };

  // === UI ส่วน Email ===
  const hasEmail = !!initial?.email;

  return (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Edit Profile
      </Typography>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Grid container spacing={2}>
          {/* Username (Clerk) */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Username (Clerk)"
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
              {...register("username", { required: true })}
            />
          </Grid>

          {/* Tel */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Tel"
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
              {...register("tel", { required: true })}
            />
          </Grid>

          {/* First / Middle / Surname */}
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              label="First name"
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
              {...register("first_name")}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              label="Middle name"
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
              {...register("middle_name")}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              label="Surname"
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
              {...register("surname")}
            />
          </Grid>

          {/* Address */}
          <Grid size={{ xs: 12, md: 12 }}>
            <TextField
              label="Address"
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
              {...register("address")}
            />
          </Grid>

          {/* Country + Birth date */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Controller
              name="country_id"
              control={control}
              rules={{ required: "Please select country" }}
              render={({ field, fieldState }) => {
                const value = field.value ?? ""; // ป้องกัน undefined
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

                    {/* ถ้ามีค่าปัจจุบันแต่ยังไม่อยู่ใน options (เช่น options ยังโหลดไม่เสร็จ) */}
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

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Birth date"
              type="date"
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
              {...register("birth_date")}
            />
          </Grid>

          {/* EMAIL (Clerk) */}
          <Grid size={{ xs: 12, md: 8 }}>
            <TextField
              label="Email (Clerk)"
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
              {...register("email")}
              disabled={hasEmail && !removeEmail} // ถ้ามีอีเมล แสดงเป็น disabled
              helperText={
                hasEmail
                  ? removeEmail
                    ? "This email will be removed"
                    : "Connected"
                  : "No email connected — add one"
              }
            />
            <Box mt={1} display="flex" gap={1}>
              {hasEmail ? (
                !removeEmail ? (
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    onClick={() => {
                      setRemoveEmail(true);
                      setValue("email", ""); // ทำให้ payload เป็น "" เพื่อสื่อว่าไม่มี
                    }}
                  >
                    Remove this email
                  </Button>
                ) : (
                  <Button
                    size="small"
                    variant="text"
                    onClick={() => {
                      setRemoveEmail(false);
                      setValue("email", initial?.email ?? "");
                    }}
                  >
                    Undo remove
                  </Button>
                )
              ) : null}
            </Box>
          </Grid>

          {/* Password section */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="New password"
              type="password"
              fullWidth
              autoComplete="new-password"
              slotProps={{ inputLabel: { shrink: true } }}
              {...register("new_password", {
                minLength: { value: 8, message: "At least 8 characters" },
              })}
              error={!!errors.new_password}
              helperText={errors.new_password?.message || " "}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Confirm password"
              type="password"
              fullWidth
              autoComplete="new-password"
              slotProps={{ inputLabel: { shrink: true } }}
              {...register("confirm_password", {
                validate: (v, f) =>
                  v === f.new_password || "Passwords do not match",
              })}
              error={!!errors.confirm_password}
              helperText={errors.confirm_password?.message || " "}
            />
          </Grid>
        </Grid>

        <Box mt={3} display="flex" gap={1}>
          <Button type="submit" variant="contained" disabled={submitting}>
            {submitting ? "Saving..." : "Save Changes"}
          </Button>
          <Button
            type="button"
            variant="text"
            onClick={onCancel ?? (() => history.back())}
            disabled={submitting}
          >
            Cancel
          </Button>
        </Box>
      </form>
    </Paper>
  );
}
