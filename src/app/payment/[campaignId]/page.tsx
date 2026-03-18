// app/payment/[campaignId]/page.tsx
"use client";

import { SignedIn, SignedOut, RedirectToSignIn, useUser } from "@clerk/nextjs";
import PaymentComponent from "@/modules/payment/PaymentComponent";
import { useParams } from "next/navigation";

export default function PaymentPage() {
  const { campaignId } = useParams<{ campaignId: string }>();
  const { user } = useUser();

  return (
    <>
      <SignedIn>
        <PaymentComponent campaignId={campaignId} userId={user?.id ?? ""} />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
