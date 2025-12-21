// hooks/useResponsiveBounds.ts
import { useEffect, useRef, useState } from "react";

// hooks/useResponsiveBounds.ts
export function useResponsiveBounds() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [bounds, setBounds] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!ref.current) return;

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setBounds({ width, height });
    });

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, bounds };
}

