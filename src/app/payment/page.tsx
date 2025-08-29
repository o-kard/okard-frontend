import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import PaymentComponent from "@/modules/payment/PaymentComponent";

export default function PostPage() {
  return (
    <>
      <SignedIn>
        <PaymentComponent />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
