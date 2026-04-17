import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { SEO, breadcrumbJsonLd } from "@/components/SEO";

type HelmetCtx = { helmet?: { title: { toString(): string }; meta: { toString(): string }; link: { toString(): string }; script: { toString(): string } } };

function renderSEO(props: Parameters<typeof SEO>[0], path = "/") {
  const helmetCtx: HelmetCtx = {};
  render(
    <HelmetProvider context={helmetCtx as never}>
      <MemoryRouter initialEntries={[path]}>
        <SEO {...props} />
      </MemoryRouter>
    </HelmetProvider>,
  );
  return helmetCtx;
}

describe("SEO component", () => {
  it("sets title, description, and canonical", () => {
    const ctx = renderSEO(
      { title: "Test Page", description: "A test description for SEO." },
      "/products/bcd",
    );
    // @ts-expect-error helmet runtime shape
    const head = ctx.helmet;
    expect(head.title.toString()).toContain("Test Page");
    expect(head.title.toString()).toContain("TruContact");
    expect(head.meta.toString()).toContain("A test description for SEO.");
    expect(head.link.toString()).toContain("https://tcs.mountainaiproject.com/products/bcd");
  });

  it("emits Open Graph and Twitter tags", () => {
    const ctx = renderSEO({ title: "OG Test", description: "OG desc" });
    // @ts-expect-error helmet runtime shape
    const meta = ctx.helmet.meta.toString();
    expect(meta).toContain('property="og:title"');
    expect(meta).toContain('property="og:description"');
    expect(meta).toContain('property="og:url"');
    expect(meta).toContain('name="twitter:card"');
  });

  it("emits JSON-LD when provided", () => {
    const ctx = renderSEO({
      title: "Schema Test",
      description: "d",
      jsonLd: breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "BCD", path: "/products/bcd" },
      ]),
    });
    // @ts-expect-error helmet runtime shape
    const scripts = ctx.helmet.script.toString();
    expect(scripts).toContain("application/ld+json");
    expect(scripts).toContain("BreadcrumbList");
    expect(scripts).toContain("https://tcs.mountainaiproject.com/products/bcd");
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
