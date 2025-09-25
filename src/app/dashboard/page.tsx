import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import DashboardComponent from "@/modules/dashboard/DashboardComponent";

export default function TestPage() {
  return (
    <>
      <SignedIn>
        <DashboardComponent />
      </SignedIn>

      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
