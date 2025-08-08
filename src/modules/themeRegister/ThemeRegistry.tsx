"use client";

import { CacheProvider } from "@emotion/react";
import createEmotionCache from "@/utils/emotionCache";
import { ReactNode } from "react";

const cache = createEmotionCache();

export default function ThemeRegistry({ children }: { children: ReactNode }) {
  return <CacheProvider value={cache}>{children}</CacheProvider>;
}
