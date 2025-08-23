import { useEffect, useMemo, useRef, useState } from "react";
import { Button, TextField } from "@mui/material";
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
  country: string | null;
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
        country: null,
        birth_date: null,
        user_image: null,
      },
    });

  const [submitting, setSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const { countryOptions, countryLoading, countryError } = useCountryOptions();

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] ?? null);
    setValue("user_image", e.target.files?.[0] ?? null);
  };

  const handleFormSubmit: SubmitHandler<FormValues> = async (values) => {
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
      country: values.country || null,
      birth_date: values.birth_date! || null,
    };
    fd.append("data", JSON.stringify(payload));
    console.log("image file:", values.user_image);
    if (values.user_image) {
      fd.append("image", values.user_image);
    }

    await onSubmit?.(fd);
    onSuccess?.();
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-4 max-w-xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <label className="flex flex-col text-sm">
          <span className="mb-1 font-medium">
            ชื่อ (First name) <span className="text-red-500">*</span>
          </span>
          <TextField
            fullWidth
            {...register("first_name", { required: true })}
          />
        </label>
        <label className="flex flex-col text-sm">
          <span className="mb-1 font-medium">ชื่อกลาง (Middle name)</span>
          <TextField fullWidth {...register("middle_name")} />
        </label>
        <label className="flex flex-col text-sm md:col-span-2">
          <span className="mb-1 font-medium">
            นามสกุล (Surname) <span className="text-red-500">*</span>
          </span>
          <TextField fullWidth {...register("surname", { required: true })} />
        </label>
      </div>

      <label className="flex flex-col text-sm">
        <span className="mb-1 font-medium">
          ที่อยู่ (Address) <span className="text-red-500">*</span>
        </span>
        <TextField fullWidth {...register("address", { required: true })} />
      </label>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <label className="flex flex-col text-sm">
          <span className="mb-1 font-medium">
            เบอร์โทร (Tel) <span className="text-red-500">*</span>
          </span>
          <TextField fullWidth {...register("tel", { required: true })} />
        </label>
        <label className="flex flex-col text-sm">
          <span className="mb-1 font-medium">
            ประเทศ (Country) <span className="text-red-500">*</span>
          </span>

          <select
            {...register("country", { required: "กรุณาเลือกประเทศ" })}
            className="border rounded px-3 py-2"
            disabled={countryLoading}
          >
            <option value="">
              {countryLoading ? "กำลังโหลดประเทศ..." : "— เลือกประเทศ —"}
            </option>
            {countryOptions.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>

          {countryError && (
            <span className="text-red-500 text-sm">{countryError}</span>
          )}
        </label>
      </div>

      <label className="flex flex-col text-sm md:max-w-xs">
        <span className="mb-1 font-medium">
          วันเกิด (Birth date) <span className="text-red-500">*</span>
        </span>
        <TextField
          type="date"
          fullWidth
          defaultValue=""
          {...register("birth_date")}
          slotProps={{ inputLabel: { shrink: true } }}
        />
      </label>

      {/* <label className="flex flex-col text-sm">
        <span className="mb-1 font-medium">รูปโปรไฟล์ (Image)</span>
        <input
          type="file"
          name="image_id"
          accept="image/*"
          onChange={handleFilesChange}
        />
      </label> */}

      {/* {imagePreviewUrl && (
        <img
          src={imagePreviewUrl}
          alt="preview"
          className="w-20 h-20 rounded object-cover border"
        />
      )} */}

      {/* <div className="flex gap-2">
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="border px-4 py-2 rounded">
            Cancel
          </button>
        )}
      </div> */}

      <label className="flex flex-col text-sm">
        <span className="mb-1 font-medium">รูปโปรไฟล์ (Image)</span>

        <Button variant="outlined" component="label" fullWidth>
          Upload Image
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleFilesChange}
          />
        </Button>
      </label>

      <label className="flex flex-col text-sm">
        <span className="mb-1 font-medium">แนะนำตัวเอง (Description)</span>
        <TextField fullWidth {...register("user_description")} />
      </label>

      <button
        type="submit"
        disabled={submitting}
        className="bg-blue-600 disabled:opacity-60 text-white px-4 py-2 rounded"
      >
        {submitting ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
      </button>
    </form>
  );
}
