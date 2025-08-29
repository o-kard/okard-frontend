// app/payment/[postId]/page.tsx
"use client";

import { SignedIn, SignedOut, RedirectToSignIn, useUser } from "@clerk/nextjs";
import PaymentComponent from "@/modules/payment/PaymentComponent";
import { useParams } from "next/navigation";

export default function PaymentPage() {
  const { postId } = useParams<{ postId: string }>();
  const { user } = useUser();

  return (
    <>
      <SignedIn>
        <PaymentComponent postId={postId} userId={user?.id ?? ""} />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
