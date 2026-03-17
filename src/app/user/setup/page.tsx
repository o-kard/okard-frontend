"use client";

import { SignedIn, SignedOut, RedirectToSignIn, useAuth } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { createUser } from "@/modules/user/api/api";
import UserForm from "@/modules/user/components/UserForm";

function sanitize(rt: string | null) {
  // กัน open redirect: ยอมเฉพาะ path ในโดเมนตัวเอง
  if (!rt || !rt.startsWith("/")) return null;
  return rt;
}

import { Suspense } from "react";
// ... (imports)

function UserSetupContent() {
  const { user } = useUser();
  const router = useRouter();
  const sp = useSearchParams();
  const returnTo = sanitize(sp.get("returnTo"));
  const { getToken } = useAuth();

  const clerk_id = user?.id || null;
  const username = user?.username || null;
  const email =
    user?.primaryEmailAddress?.emailAddress ||
    user?.emailAddresses?.[0]?.emailAddress ||
    null;

  const handleSubmit = async (fd: FormData) => {
    if (!user) return;

    const imageFile = fd.get("media") ?? null;
    const removeImage = fd.get("remove_image") === "true";

    try {
      const token = await getToken();
      const ok = await createUser(fd, token);
      if (ok) {
        if (imageFile instanceof File) {
          await user.setProfileImage({ file: imageFile });
        } else if (removeImage) {
          await user.setProfileImage({ file: null });
        }
        await user.reload();
        router.replace("/");
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <SignedIn>
        <UserForm
          onSubmit={handleSubmit}
          clerk_id={clerk_id}
          username={username}
          email={email}
          isUserHavePassword={user?.passwordEnabled}
          imageUrl={user?.hasImage ? user?.imageUrl : null}
        />
      </SignedIn>

      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}

export default function UserSetupPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserSetupContent />
    </Suspense>
  );
}
