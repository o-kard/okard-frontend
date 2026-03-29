import { useRef, useState } from "react";
import { useUser, useReverification } from "@clerk/nextjs";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import { validateEmail } from "@/utils/validation";

/**
 * Hook for adding a new email address to a Clerk user.
 * 
 * Flow (Refactored for custom UI):
 * 1. call prepareEmail(email) -> trigger Clerk code send, returns true if okay.
 * 2. UI shows a code-entry dialog.
 * 3. call verifyEmail(code) -> attempts verification and sets primary.
 * 
 * Use `cancelPendingEmail()` to cleanup if the user cancels.
 */
export function useAddEmailAddress() {
    const { user, isLoaded } = useUser();
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // Track the email object created/found during this session
    const pendingEmailRef = useRef<any>(null);

    const _createEmail = useReverification((email: string) =>
        user!.createEmailAddress({ email })
    );

    const _setPrimary = useReverification((id: string) =>
        user!.update({ primaryEmailAddressId: id })
    );

    /**
     * Step 1: Prepare the email for verification. 
     * Creates the email record and triggers the code send.
     */
    const prepareEmail = async (email: string): Promise<boolean> => {
        if (!isLoaded || !user) return false;
        setError(null);

        const trimmed = email.trim();
        if (!trimmed) return true;

        if (!validateEmail(trimmed)) {
            setError("Invalid email format");
            return false;
        }

        if (user.primaryEmailAddress?.emailAddress === trimmed) return true;

        try {
            setSubmitting(true);
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

                emailObj =
                    user.emailAddresses.find((a) => a.id === created?.id) ||
                    user.emailAddresses.find((a) => a.emailAddress === trimmed);

                if (!emailObj) {
                    setError("Email object not found after creation");
                    return false;
                }

                await emailObj.prepareVerification({ strategy: "email_code" });
            }

            pendingEmailRef.current = emailObj;
            return true;
        } catch (e: any) {
            handleError(e);
            return false;
        } finally {
            setSubmitting(false);
        }
    };

    /**
     * Step 2: Verify the email using the code entered by the user.
     */
    const verifyEmail = async (code: string): Promise<boolean> => {
        const emailObj = pendingEmailRef.current;
        if (!emailObj) {
            setError("No pending email verification found");
            return false;
        }

        try {
            setSubmitting(true);
            setError(null);
            
            const res = await emailObj.attemptVerification({ code });
            if (res?.verification?.status !== "verified") {
                setError("Verification failed. Please check the code.");
                return false;
            }

            await _setPrimary(emailObj.id);
            if (user) await user.reload();
            pendingEmailRef.current = null;
            return true;
        } catch (e: any) {
            handleError(e);
            return false;
        } finally {
            setSubmitting(false);
        }
    };

    const cancelPendingEmail = async () => {
        const pending = pendingEmailRef.current;
        if (!pending) return;
        try {
            await pending.destroy();
            pendingEmailRef.current = null;
            if (user) await user.reload();
        } catch (e) {
            console.error("Failed to destroy pending email:", e);
        }
    };

    const handleError = (e: any) => {
        if (isClerkAPIResponseError(e)) {
            const msg = e.errors
                ?.map((er: any) => er.longMessage || er.message)
                .join("\n");
            setError(msg ?? "Failed to add/verify email");
        } else {
            console.error(e);
            setError("Failed to add/verify email");
        }
    };

    /**
     * Legacy helper that uses window.prompt.
     * @deprecated Use prepareEmail/verifyEmail for custom UI.
     */
    const addEmail = async (email: string): Promise<boolean> => {
        const ok = await prepareEmail(email);
        if (!ok) return false;
        const code = window.prompt(`Enter the 6-digit code sent to ${email}`);
        if (!code) return false;
        return verifyEmail(code);
    };

    return { 
        prepareEmail, 
        verifyEmail, 
        addEmail,
        cancelPendingEmail, 
        error, 
        setError,
        submitting
    };
}

