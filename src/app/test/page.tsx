import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import TestComponent from "@/modules/test/TestComponent";

export default function TestPage() {
  return (
    <>
      <SignedIn>
        <TestComponent />
      </SignedIn>

      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
