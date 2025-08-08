import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import PostComponent from "@/modules/post/PostComponent";

export default function PostPage() {
  return (
    <>
      <SignedIn>
        <PostComponent />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
