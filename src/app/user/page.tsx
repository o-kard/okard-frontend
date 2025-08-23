"use client";

import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { createUser } from "@/modules/user/api/api";
import UserForm from "@/modules/user/components/UserForm";

export default function ProfilePage() {
  const { user } = useUser();
  const router = useRouter();

  const clerk_id = user?.id || null;
  const username = user?.username || null;
  const email =
    user?.primaryEmailAddress?.emailAddress ||
    user?.emailAddresses?.[0]?.emailAddress ||
    null;

  const handleSubmit = async (fd: FormData) => {
    if (!user) return;

    const ok = await createUser(fd);
    if (ok) router.push("/");
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
