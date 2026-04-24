import { useEffect, useState } from "react";

/**
 * Tracks which of the given element IDs is currently the "active" section
 * based on scroll position. Active = the last section whose top has crossed
 * the offset threshold from the top of the viewport.
 */
export function useScrollSpy(ids: string[], offset = 120): string | null {
  const [activeId, setActiveId] = useState<string | null>(ids[0] ?? null);

  useEffect(() => {
    if (ids.length === 0) return;

    const compute = () => {
      let current: string | null = null;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top - offset <= 0) {
          current = id;
        } else {
          break;
        }
      }
      setActiveId(current ?? ids[0]);
    };

    compute();
    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
    };
  }, [ids.join("|"), offset]);

  return activeId;
}
