import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

const CANONICAL_ORIGIN = "https://tcs-apis.github.io";
const CANONICAL_BASE_PATH = "/developers.html";
const DEFAULT_OG_IMAGE =
  "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/abd2cd2c-937f-4eb9-a5d9-f03d8d567601/id-preview-d7b7ad9b--a3c75454-2898-4c89-b77d-b53b74d5e170.lovable.app-1775272923445.png";

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  noindex?: boolean;
}

export function SEO({ title, description, keywords, jsonLd, noindex }: SEOProps) {
  const { pathname } = useLocation();
  // GitHub Pages hosts the SPA at /developers.html with hash routing (#/route).
  // Root path becomes the bare developers.html URL; deep paths get a # prefix.
  const hashPath = pathname === "/" ? "" : `#${pathname}`;
  const canonical = `${CANONICAL_ORIGIN}${CANONICAL_BASE_PATH}${hashPath}`;
  const fullTitle = title.includes("TruContact") ? title : `${title} | TruContact Developer Docs`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonical} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={DEFAULT_OG_IMAGE} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={DEFAULT_OG_IMAGE} />

      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(Array.isArray(jsonLd) ? jsonLd : [jsonLd])}
        </script>
      )}
    </Helmet>
  );
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
      itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${CANONICAL_ORIGIN}${CANONICAL_BASE_PATH}${item.path === "/" ? "" : `#${item.path}`}`,
    })),
  };
}

export { CANONICAL_ORIGIN, CANONICAL_BASE_PATH };
export const CANONICAL_SITE_URL = `${CANONICAL_ORIGIN}${CANONICAL_BASE_PATH}`;
