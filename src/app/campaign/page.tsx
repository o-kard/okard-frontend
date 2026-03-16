import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import CampaignComponent from "@/modules/campaign/CampaignComponent";

export default function CampaignPage() {
  return (
    <>
      <SignedIn>
        <CampaignComponent />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
