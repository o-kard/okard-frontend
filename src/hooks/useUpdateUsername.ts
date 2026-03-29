import { useState } from "react";
import { useUser, useReverification } from "@clerk/nextjs";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import { validateUsername } from "@/utils/validation";

export function useUpdateUsername() {
    const { user, isLoaded } = useUser();
    const [error, setError] = useState<string | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const updateUsername = useReverification(async (uname: string) => {
        if (!isLoaded || !user) return null;
        setError(null);
        setIsSuccess(false);

        const vErr = validateUsername(uname);
        console.log("Validated username", uname, vErr);
        if (vErr) {
            setError(vErr);
            return null;
        }

        try {
            setIsUpdating(true);
            console.log("Updating username to", uname);
            const result = await user.update({ username: uname });
            await user.reload();
            setIsSuccess(true);
            return result;
        } catch (e: any) {
            // Rethrow verification errors so useReverification can handle them
            if (isClerkAPIResponseError(e) && (
                e.status === 403 ||
                e.errors?.some(err => err.code === 'session_step_up_verification_needed' || err.code === 'verification_needed' || err.code === 'verification_needed' || err.meta?.verification_needed)
            )) {
                throw e;
            }

            if (isClerkAPIResponseError(e)) {
                const msg =
                    e.errors?.map((er: any) => er.longMessage || er.message).join("\n") ||
                    "Username update failed";
                setError(msg);
                return null;
            }
            console.error(e);
            setError("Username update failed");
            return null;
        } finally {
            setIsUpdating(false);
        }
    });

    return { updateUsername, error, isUpdating, isSuccess, setError };
}