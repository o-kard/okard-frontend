import { RefObject, useEffect, useState } from "react";

export function useActiveSection(
  sectionRefs: RefObject<Array<HTMLDivElement | null>>,
  data: any
) {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute("data-idx") || "0");
            setActiveIdx(idx);
          }
        });
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: [0, 0.2, 0.5, 1] }
    );

    sectionRefs.current.forEach((node, i) => {
      if (node) {
        node.setAttribute("data-idx", String(i));
        observer.observe(node);
      }
    });

    return () => observer.disconnect();
  }, [data]);

  return activeIdx;
}
