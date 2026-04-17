import { describe, it, expect, beforeEach } from "vitest";
import { render, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { SEO, breadcrumbJsonLd } from "@/components/SEO";

function renderSEO(props: Parameters<typeof SEO>[0], path = "/") {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[path]}>
        <SEO {...props} />
      </MemoryRouter>
    </HelmetProvider>,
  );
}

describe("SEO component", () => {
  beforeEach(() => {
    document.head.innerHTML = "";
    document.title = "";
  });

  it("sets the document title with TruContact suffix", async () => {
    renderSEO({ title: "Test Page", description: "A test description for SEO." });
    await waitFor(() => {
      expect(document.title).toContain("Test Page");
      expect(document.title).toContain("TruContact");
    });
  });

  it("sets canonical URL based on current path", async () => {
    renderSEO({ title: "T", description: "D" }, "/products/bcd");
    await waitFor(() => {
      const canonical = document.head.querySelector('link[rel="canonical"]');
      expect(canonical?.getAttribute("href")).toBe(
        "https://tcs.mountainaiproject.com/products/bcd",
      );
    });
  });

  it("emits Open Graph and Twitter meta tags", async () => {
    renderSEO({ title: "OG Test", description: "OG desc" });
    await waitFor(() => {
      expect(document.head.querySelector('meta[property="og:title"]')).toBeTruthy();
      expect(document.head.querySelector('meta[property="og:description"]')).toBeTruthy();
      expect(document.head.querySelector('meta[property="og:url"]')).toBeTruthy();
      expect(document.head.querySelector('meta[name="twitter:card"]')).toBeTruthy();
    });
  });

  it("emits JSON-LD script when provided", async () => {
    renderSEO({
      title: "Schema Test",
      description: "d",
      jsonLd: breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "BCD", path: "/products/bcd" },
      ]),
    });
    await waitFor(() => {
      const script = document.head.querySelector('script[type="application/ld+json"]');
      expect(script).toBeTruthy();
      const payload = script?.textContent || "";
      expect(payload).toContain("BreadcrumbList");
      expect(payload).toContain("https://tcs.mountainaiproject.com/products/bcd");
    });
  });

  it("breadcrumbJsonLd builds correct positions", () => {
    const ld = breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Webhooks", path: "/resources/webhooks" },
    ]);
    expect(ld.itemListElement).toHaveLength(2);
    expect(ld.itemListElement[0].position).toBe(1);
    expect(ld.itemListElement[1].name).toBe("Webhooks");
  });
});
