import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Flat-build deep-link bootstrap.
// In the flat HashRouter build, the URL hash IS the route (e.g. `#/resources/webhooks/guide`).
// External tools that translate Lovable URLs to the flat HTML often drop the path and keep
// only the in-page anchor (e.g. `#webhook-step-7`), which HashRouter would interpret as a
// missing route and 404. Map known anchor IDs back to their owning route + scroll target.
if (import.meta.env.VITE_FLAT_BUILD === "1") {
  const rawHash = window.location.hash.replace(/^#/, "");
  // Only act when the hash is a bare anchor, not an actual hash-route ("/...")
  if (rawHash && !rawHash.startsWith("/")) {
    const anchorToRoute: Array<[RegExp, string]> = [
      [/^webhook-step-\d+$/, "/resources/webhooks/guide"],
      [/^partner-status-lifecycles$/, "/resources/webhooks/guide"],
      [/^lifecycle-(account|caller-profile|tn)$/, "/resources/webhooks/guide"],
      [/^(scp|bcd|cno|pca)-step-\d+$/, ""], // resolved below using prefix
    ];
    let route: string | null = null;
    for (const [re, r] of anchorToRoute) {
      if (re.test(rawHash)) {
        if (r) {
          route = r;
        } else {
          const productId = rawHash.split("-")[0];
          route = `/products/${productId}/guide`;
        }
        break;
      }
    }
    if (route) {
      // Stash anchor for post-mount scroll, then rewrite to the proper hash-route.
      sessionStorage.setItem("flat-deeplink-anchor", rawHash);
      window.location.replace(`${window.location.pathname}${window.location.search}#${route}`);
    }
  }

  // After mount, scroll to the stashed anchor (if any).
  window.addEventListener("load", () => {
    const anchor = sessionStorage.getItem("flat-deeplink-anchor");
    if (anchor) {
      sessionStorage.removeItem("flat-deeplink-anchor");
      // Wait one tick for routed page to render.
      setTimeout(() => {
        const el = document.getElementById(anchor);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 200);
    }
  });
}

createRoot(document.getElementById("root")!).render(<App />);
