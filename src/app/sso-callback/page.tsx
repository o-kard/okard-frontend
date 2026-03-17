"use client";

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function SSO_Callback() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <AuthenticateWithRedirectCallback
        signInForceRedirectUrl="/user/setup"
        signUpForceRedirectUrl="/user/setup"
        continueSignUpUrl="/sign-up/continue"
      />
    </div>
  );
}
