"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { checkUserExists } from "@/modules/user/api/api";

type Status = "idle" | "checking" | "missing" | "ok" | "error";

export function useRequireUserInDb(
  opts: {
    redirectTo?: string;
    enabled?: boolean;
  } = {}
) {
  const { redirectTo = "/user", enabled = true } = opts;
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    if (!enabled) return;
    if (!isLoaded) return;
    if (!user)    return;

    let cancelled = false;
    (async () => {
      try {
        setStatus("checking");
        const exists = await checkUserExists(user.id);
        if (cancelled) return;

        if (!exists) {
          setStatus("missing");
          router.replace(redirectTo);
        } else {
          setStatus("ok");
        }
      } catch {
        if (!cancelled) setStatus("error");
      }
    })();

    return () => { cancelled = true; };
  }, [enabled, isLoaded, user?.id, redirectTo, router]);

  return status;
}
