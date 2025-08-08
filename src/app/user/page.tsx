import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import UserComponent from "@/modules/user/UserComponent";

export default function ProfilePage() {
  return (
    <>
      <SignedIn>
        <UserComponent />
      </SignedIn>

      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
