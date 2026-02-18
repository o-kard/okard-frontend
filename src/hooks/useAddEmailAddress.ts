import { useRef } from "react";
import { useUser, useReverification } from "@clerk/nextjs";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import { validateEmail } from "@/utils/validation";

/**
 * Hook for adding a new email address to a Clerk user.
 *
 * Flow:
 * 1. If the email already exists (unverified), call prepareVerification.
 * 2. Otherwise, create a new email address.
 * 3. Prompt the user for the 6-digit code and attempt verification.
 * 4. Set the verified email as primary.
 *
 * On cancel (e.g. user leaves edit mode), call `cancelPendingEmail()` to
 * destroy any unverified email that was created during the session.
 */
export function useAddEmailAddress() {
    const { user, isLoaded } = useUser();

    // Track the email object created/found during this session so we can
    // destroy it if the user cancels without completing verification.
    const pendingEmailRef = useRef<any>(null);

    const _createEmail = useReverification((email: string) =>
        user!.createEmailAddress({ email })
    );

    const _setPrimary = useReverification((id: string) =>
        user!.update({ primaryEmailAddressId: id })
    );

    /**
     * Add and verify a new email address.
     * Returns true on success, false on failure/cancellation.
     */
    const addEmail = async (email: string): Promise<boolean> => {
        if (!isLoaded || !user) return false;

        const trimmed = email.trim();
        if (!trimmed) return true; // nothing to do

        if (!validateEmail(trimmed)) {
            alert("Invalid email format");
            return false;
        }

        // If already the primary email, nothing to do
        if (user.primaryEmailAddress?.emailAddress === trimmed) return true;

        try {
            // Check if this email already exists in the user's list
            const existing = user.emailAddresses.find(
                (e) => e.emailAddress === trimmed
            );

            let emailObj: any;

            if (existing) {
                emailObj = existing;
                await existing.prepareVerification({ strategy: "email_code" });
            } else {
                const created = await _createEmail(trimmed);
                await user.reload();

                // Find the newly created email object
                emailObj =
                    user.emailAddresses.find((a) => a.id === created?.id) ||
                    user.emailAddresses.find((a) => a.emailAddress === trimmed);

                if (!emailObj) {
                    alert("Email object not found after creation");
                    return false;
                }

                await emailObj.prepareVerification({ strategy: "email_code" });
            }

            // Store reference so we can destroy it on cancel
            pendingEmailRef.current = emailObj;

            // Prompt for verification code
            const code = window.prompt(
                `Enter the 6-digit code sent to ${trimmed}`
            );
            if (!code) {
                alert("Verification cancelled");
                return false;
            }

            const res = await emailObj.attemptVerification({ code });
            if (res?.verification?.status !== "verified") {
                alert("Verification failed");
                return false;
            }

            // Set as primary
            await _setPrimary(emailObj.id);
            await user.reload();

            // Clear pending ref — successfully verified
            pendingEmailRef.current = null;
            return true;
        } catch (e: any) {
            if (isClerkAPIResponseError(e)) {
                const msg = e.errors
                    ?.map((er: any) => er.longMessage || er.message)
                    .join("\n");
                alert(msg ?? "Failed to add/verify email");
                return false;
            }
            console.error(e);
            alert("Failed to add/verify email");
            return false;
        }
    };

    /**
     * Destroy any unverified email that was created during this session.
     * Call this when the user cancels out of the edit panel.
     */
    const cancelPendingEmail = async () => {
        const pending = pendingEmailRef.current;
        if (!pending) return;
        try {
            await pending.destroy();
            pendingEmailRef.current = null;
            await user?.reload();
        } catch (e) {
            console.error("Failed to destroy pending email:", e);
        }
    };

    return { addEmail, cancelPendingEmail };
}
