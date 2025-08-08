import { useState } from "react";
import { User } from "../types/user";

type Props = {
  onSubmit: (user: Omit<User, "id">) => void;
};

export default function UserForm({ onSubmit }: Props) {
  const [form, setForm] = useState<Omit<User, "id">>({
    clerk_id: "",
    email: "",
    username: "",
    first_name: "",
    middle_name: null,
    surname: "",
    tel: "",
    address: "",
    user_description: "",
    country: null,
    birth_date: null,
    image_id: null,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => onSubmit(form);

  return (
    <div className="space-y-2">
      <input name="first_name" placeholder="ชื่อ" onChange={handleChange} />
      <input name="surname" placeholder="นามสกุล" onChange={handleChange} />
      <input name="tel" placeholder="เบอร์โทร" onChange={handleChange} />
      <input name="address" placeholder="ที่อยู่" onChange={handleChange} />
      <input
        name="user_description"
        placeholder="แนะนำตัวเอง"
        onChange={handleChange}
      />
      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        บันทึกข้อมูล
      </button>
    </div>
  );
}
