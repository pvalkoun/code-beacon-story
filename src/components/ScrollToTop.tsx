import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Scrolls to the top on route change, OR — when the URL has a `#hash` —
 * scrolls to the element with that id. Because target pages may render
 * tables/sections asynchronously after route change, we retry briefly until
 * the element appears.
 */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0 });
      return;
    }

    const id = decodeURIComponent(hash.slice(1));
    let attempts = 0;
    const maxAttempts = 25; // ~1s at 40ms

    const tick = () => {
      const el = document.getElementById(id);
      if (el) {
        // Compensate for the 56px sticky header
        const top = el.getBoundingClientRect().top + window.scrollY - 72;
        window.scrollTo({ top, left: 0, behavior: "smooth" });
        // Trigger a brief highlight via a CSS class
        el.classList.add("search-target-highlight");
        window.setTimeout(() => el.classList.remove("search-target-highlight"), 2200);
        return;
      }
      if (++attempts < maxAttempts) {
        window.setTimeout(tick, 40);
      } else {
        window.scrollTo({ top: 0, left: 0 });
      }
    };

    // Wait one frame so the new route has had a chance to render
    window.requestAnimationFrame(tick);
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
