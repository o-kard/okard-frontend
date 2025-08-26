"use client";

import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { createUser } from "@/modules/user/api/api";
import UserForm from "@/modules/user/components/UserForm";

function sanitize(rt: string | null) {
  // กัน open redirect: ยอมเฉพาะ path ในโดเมนตัวเอง
  if (!rt || !rt.startsWith("/")) return null;
  return rt;
}

export default function UserSetupPage() {
  const { user } = useUser();
  const router = useRouter();
  const sp = useSearchParams();
  const returnTo = sanitize(sp.get("returnTo"));

  const clerk_id = user?.id || null;
  const username = user?.username || null;
  const email =
    user?.primaryEmailAddress?.emailAddress ||
    user?.emailAddresses?.[0]?.emailAddress ||
    null;

  const handleSubmit = async (fd: FormData) => {
    if (!user) return;

    const imageFile = fd.get("image") ?? null;
    try {
      const ok = await createUser(fd);
      if (ok) {
        if (imageFile instanceof File) {
          await user.setProfileImage({ file: imageFile });
          await user.reload();
        }
        router.replace(returnTo ?? "/");
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <SignedIn>
        <div className="max-w-lg mx-auto mt-10">
          <h1 className="text-2xl font-bold mb-4">Setup your profile</h1>
          <UserForm
            onSubmit={handleSubmit}
            clerk_id={clerk_id}
            username={username}
            email={email}
          />
        </div>
      </SignedIn>

      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
