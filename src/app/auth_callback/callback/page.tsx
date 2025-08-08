// app/(auth-callback)/callback/page.tsx
"use client";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";

export default function CallbackPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      if (!isLoaded || !user) return;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/me?clerk_id=${user.id}`
      );
      if (res.status === 404) {
        router.push("/user");
      } else {
        router.push("/about");
      }
    };

    checkUser();
  }, [user, isLoaded]);

  return <p className="text-center mt-20">กำลังโหลด...</p>;
}
