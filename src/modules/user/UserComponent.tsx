"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { createUser } from "./api/api";
import UserForm from "./components/UserForm";

export default function UserComponent() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    if (!user) return;

    const payload = {
      ...data,
      clerk_id: user.id,
      email:
        user.primaryEmailAddress?.emailAddress ??
        user.emailAddresses?.[0]?.emailAddress ??
        null, // อย่าส่ง "" ให้ EmailStr
      username: user.username || user.id,
    };
    console.log("submit payload:", payload);
    
    const result = await createUser(payload);

    if (result) router.push("/about");
    else console.error("Create user failed");
  };

  if (isLoaded && !user) router.push("/");

  return (
    <div className="max-w-lg mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Setup your profile</h1>
      <UserForm onSubmit={handleSubmit} />
    </div>
  );
}
