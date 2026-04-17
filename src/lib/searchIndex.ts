import { apiEndpoints } from "@/data/apiData";
import { products } from "@/data/productData";
import { webhookEndpoints } from "@/data/webhookData";
import { integrations } from "@/data/integrationData";
import { changelog } from "@/data/changelogData";

export type SearchGroup =
  | "Endpoints"
  | "Webhooks"
  | "Setup Guides"
  | "Products"
  | "Integrations"
  | "Changelog"
  | "Pages";

export interface SearchItem {
  id: string;
  group: SearchGroup;
  title: string;
  subtitle?: string;
  description?: string;
  body?: string;
  to: string;
  meta?: string; // e.g. HTTP method, tag list — useful for matching
}

function buildIndex(): SearchItem[] {
  const items: SearchItem[] = [];

  // API endpoints — grouped per product (one entry per product they belong to)
  for (const ep of apiEndpoints) {
    const productIds = ep.product?.length ? ep.product : ["common"];
    for (const productId of productIds) {
      // Skip "common" duplicates — we still want one entry. Use first product or 'common' route via first product page.
      // Pick a sensible product to route to: prefer non-common product id mapping to a real product page.
      const routeProduct =
        productId === "common"
          ? // common endpoints are reachable from any product; pick the first real product the endpoint also lists, else default to scp
            (ep.product?.find((p) => p !== "common") ?? "scp")
          : productId;

      items.push({
        id: `endpoint-${routeProduct}-${ep.id}`,
        group: "Endpoints",
        title: ep.name,
        subtitle: `${ep.method} ${ep.path}`,
        description: ep.description,
        body: `${ep.category} ${ep.requestBody ?? ""} ${ep.responseBody ?? ""}`,
        to: `/products/${routeProduct}/api/${ep.id}`,
        meta: `${ep.method} ${ep.category}`,
      });

      // For "common" endpoints we only emit once, regardless of how many products list them
      if (productId === "common") break;
    }
  }

  // Webhook endpoints
  for (const ep of webhookEndpoints) {
    items.push({
      id: `webhook-${ep.id}`,
      group: "Webhooks",
      title: ep.name,
      subtitle: `${ep.method} ${ep.path}`,
      description: ep.description,
      body: `${ep.category} ${ep.requestBody ?? ""} ${ep.responseBody ?? ""}`,
      to: `/resources/webhooks/api/${ep.id}`,
      meta: `${ep.method} ${ep.category}`,
    });
  }

  // Products + their setup steps
  for (const product of products) {
    items.push({
      id: `product-${product.id}`,
      group: "Products",
      title: product.name,
      subtitle: product.fullName,
      description: product.tagline,
      body: `${product.description} ${product.benefits.join(" ")}`,
      to: product.isExternal && product.externalPath ? product.externalPath : `/products/${product.id}`,
    });

    if (!product.isExternal) {
      for (const step of product.setupSteps) {
        items.push({
          id: `guide-${product.id}-${step.step}`,
          group: "Setup Guides",
          title: `${product.name}: ${step.title}`,
          subtitle: `Step ${step.step} of the setup guide`,
          description: step.description,
          body: step.details,
          to: `/products/${product.id}/guide`,
        });
      }
    }
  }

  // Webhook setup guide page (general)
  items.push({
    id: "guide-webhooks",
    group: "Setup Guides",
    title: "Webhooks Setup Guide",
    subtitle: "End-to-end webhook configuration",
    description: "Configure account, register webhooks, and verify event delivery.",
    to: "/resources/webhooks/guide",
  });

  // Integrations
  for (const ig of integrations) {
    items.push({
      id: `integration-${ig.id}`,
      group: "Integrations",
      title: `${ig.platform} Integration`,
      subtitle: ig.products.map((p) => p.toUpperCase()).join(" • "),
      description: ig.description,
      body: ig.sections.map((s) => `${s.title} ${s.content}`).join(" "),
      to: `/integrations/${ig.id}`,
    });
  }

  // Changelog entries
  for (const entry of changelog) {
    items.push({
      id: `changelog-${entry.date}-${entry.title}`,
      group: "Changelog",
      title: entry.title,
      subtitle: entry.date,
      description: entry.description,
      body: entry.tags.join(" "),
      to: "/changelog",
      meta: entry.tags.join(" "),
    });
  }

  // Static top-level pages
  items.push(
    {
      id: "page-home",
      group: "Pages",
      title: "Home",
      description: "TruContact Trusted Call Solutions documentation overview",
      to: "/",
    },
    {
      id: "page-call-auth",
      group: "Pages",
      title: "Call Authentication (PCA)",
      description: "Required prerequisite for SCP and BCD",
      to: "/call-auth",
    },
    {
      id: "page-analytics",
      group: "Pages",
      title: "Analytics API",
      description: "Per-TN and account-wide call performance metrics",
      to: "/resources/analytics",
    },
    {
      id: "page-webhooks",
      group: "Pages",
      title: "Webhooks Overview",
      description: "Subscribe to events and receive callbacks",
      to: "/resources/webhooks",
    },
    {
      id: "page-changelog",
      group: "Pages",
      title: "Changelog",
      description: "Recent updates and additions to the platform",
      to: "/changelog",
    },
  );

  return items;
}

export const searchIndex: SearchItem[] = buildIndex();

export const groupOrder: SearchGroup[] = [
  "Endpoints",
  "Webhooks",
  "Setup Guides",
  "Products",
  "Integrations",
  "Changelog",
  "Pages",
];
