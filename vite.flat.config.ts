import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { viteSingleFile } from "vite-plugin-singlefile";
import fs from "fs";

/**
 * Separate build config that produces a single self-contained HTML file
 * (flat-site.html) at the repo root. The normal `vite build` is unaffected.
 *
 * Run with: `vite build --config vite.flat.config.ts`
 *
 * Notes:
 * - Sets VITE_FLAT_BUILD=1 so App.tsx switches BrowserRouter -> HashRouter
 *   (required for the file to work when opened directly via file://).
 * - All JS/CSS/assets are inlined into a single HTML document.
 */
export default defineConfig({
  define: {
    "import.meta.env.VITE_FLAT_BUILD": JSON.stringify("1"),
  },
  plugins: [
    react(),
    viteSingleFile({ removeViteModuleLoader: true }),
    {
      name: "copy-flat-site-to-root",
      closeBundle() {
        const src = path.resolve(__dirname, "dist-flat/index.html");
        const dest = path.resolve(__dirname, "flat-site.html");
        if (fs.existsSync(src)) {
          fs.copyFileSync(src, dest);
          // eslint-disable-next-line no-console
          console.log(`\n✓ flat-site.html written to repo root (${(fs.statSync(dest).size / 1024).toFixed(1)} KB)`);
        }
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
  build: {
    outDir: "dist-flat",
    emptyOutDir: true,
    assetsInlineLimit: 100_000_000, // inline everything
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
  },
});
