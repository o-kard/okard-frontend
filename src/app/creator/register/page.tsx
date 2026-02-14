"use client";

import { createCreator } from "@/modules/creator/api/api";
import CreatorForm from "@/modules/creator/components/CreatorForm";
import { RedirectToSignIn, SignedIn, SignedOut, useAuth } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRequireUserInDb } from "@/hooks/useRequireUserDb";
import { getUser } from "@/modules/user/api/api";
import { User } from "@/modules/user/types/user";

export default function CreatorRegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { getToken } = useAuth();
  const { user, isLoaded } = useUser();
  const haveUserDb = useRequireUserInDb();

  const [profile, setProfile] = useState<User | null | undefined>(undefined);

  const handleSubmit = async (fd: FormData) => {
    // Log the FormData for debugging
    console.log("Form submitted with FormData:");
    console.log("Data:", fd.get("data"));
    console.log("ID Card:", fd.get("id_card"));
    console.log("House Registration:", fd.get("house_registration"));
    console.log("Bank Statement:", fd.get("bank_statement"));

    try {
      const token = await getToken();
      if (!token) throw new Error("No token available");
      const response = await createCreator(fd, token);
      console.log("✅ Creator registration successful:", response);
    } catch (error: any) {
      console.error("❌ Creator registration failed:");
      if (error?.body?.detail) {
        console.error("Backend error:", error.body.detail);
      }
      throw error; // Re-throw to prevent onSuccess from being called
    }
  };

  const handleSuccess = async (pendingAvatar?: { file?: File; clear?: boolean } | null) => {
    if (!user) return;

    try {
      // Sync profile image to Clerk
      if (pendingAvatar?.file) {
        console.log("Setting Clerk profile image...");
        await user.setProfileImage({ file: pendingAvatar.file });
      }
      if (pendingAvatar?.clear) {
        console.log("Clearing Clerk profile image...");
        await user.setProfileImage({ file: null });
      }

      // Reload user data
      await user.reload();

      // Refresh profile from database
      const token = await getToken();
      if (token) {
        const refreshed = await getUser(token);
        setProfile(refreshed);
      }

      console.log("✅ Profile synced successfully");

      // Navigate to home or creator dashboard
      router.push("/");
    } catch (error) {
      console.error("Failed to sync profile image:", error);
    }
  };

  useEffect(() => {
    if (!isLoaded || !user || haveUserDb !== "ok") return;
    let abort = false;
    (async () => {
      try {
        const token = await getToken();
        if (!token) throw new Error("No token available");
        const r = await getUser(token);
        if (r) {
          console.log("User profile:", r);
          if (!abort) setProfile(r);
        }
      } catch (err) {
        console.error("Failed to fetch user with token:", err);
      }
    })();
    return () => {
      abort = true;
    };
  }, [isLoaded, user, haveUserDb]);

  return (
    <>
      <SignedIn>
        <CreatorForm
          onSubmit={handleSubmit}
          onSuccess={handleSuccess}
          initial={profile}
          // isUserHaveImage={user?.hasImage}
          imageUrl={user?.hasImage ? user?.imageUrl : null}
        />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}