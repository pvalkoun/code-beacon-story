import { apiEndpoints } from "@/data/apiData";
import { endpointFieldDocs } from "@/data/apiFieldDocs";
import { products } from "@/data/productData";
import { webhookEndpoints, webhookFieldDocs } from "@/data/webhookData";
import { integrations } from "@/data/integrationData";
import { changelog } from "@/data/changelogData";
import { fieldAnchorId, slugify } from "@/lib/slug";

export type SearchGroup =
  | "Endpoints"
  | "Endpoint Fields"
  | "Webhooks"
  | "Webhook Fields"
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
  to: string; // includes optional #hash
  meta?: string;
}

/** Resolve which product page to route an endpoint to. */
function endpointRouteProduct(ep: { product?: ("scp" | "bcd" | "cno" | "common")[] }): string {
  const products = ep.product ?? ["common"];
  if (products.length === 0 || (products.length === 1 && products[0] === "common")) {
    return "scp"; // common endpoints — pick scp as a sensible default
  }
  return products.find((p) => p !== "common") ?? "scp";
}

function buildIndex(): SearchItem[] {
  const items: SearchItem[] = [];

  // ─── API endpoints ───────────────────────────────────────────────
  for (const ep of apiEndpoints) {
    const routeProduct = endpointRouteProduct(ep);
    const base = `/products/${routeProduct}/api/${ep.id}`;

    items.push({
      id: `endpoint-${routeProduct}-${ep.id}`,
      group: "Endpoints",
      title: ep.name,
      subtitle: `${ep.method} ${ep.path}`,
      description: ep.description,
      body: `${ep.category}`,
      to: `${base}#overview`,
      meta: `${ep.method} ${ep.category}`,
    });

    // Per-field entries from apiFieldDocs
    const docs = endpointFieldDocs[ep.id];
    if (docs) {
      const sections: { key: "pathParams" | "requestFields" | "responseFields"; section: string; label: string }[] = [
        { key: "pathParams", section: "path-params", label: "Path param" },
        { key: "requestFields", section: "request-fields", label: "Request field" },
        { key: "responseFields", section: "response-fields", label: "Response field" },
      ];
      for (const { key, section, label } of sections) {
        const fields = docs[key];
        if (!fields) continue;
        for (const f of fields) {
          items.push({
            id: `endpoint-${routeProduct}-${ep.id}-${section}-${f.path}`,
            group: "Endpoint Fields",
            title: f.path,
            subtitle: `${label} • ${ep.name}`,
            description: f.description,
            body: `${f.type} ${f.constraints ?? ""}`,
            to: `${base}#${section}-${fieldAnchorId(f.path)}`,
            meta: `${ep.method}`,
          });
        }
      }
    }
  }

  // ─── Webhook endpoints ───────────────────────────────────────────
  for (const ep of webhookEndpoints) {
    const base = `/resources/webhooks/api/${ep.id}`;
    items.push({
      id: `webhook-${ep.id}`,
      group: "Webhooks",
      title: ep.name,
      subtitle: `${ep.method} ${ep.path}`,
      description: ep.description,
      body: ep.category,
      to: `${base}#overview`,
      meta: `${ep.method} ${ep.category}`,
    });

    const docs = webhookFieldDocs?.[ep.id];
    if (docs) {
      const sections: { key: "pathParams" | "requestFields" | "responseFields"; section: string; label: string }[] = [
        { key: "pathParams", section: "path-params", label: "Path param" },
        { key: "requestFields", section: "request-fields", label: "Request field" },
        { key: "responseFields", section: "response-fields", label: "Response field" },
      ];
      for (const { key, section, label } of sections) {
        const fields = docs[key];
        if (!fields) continue;
        for (const f of fields) {
          items.push({
            id: `webhook-${ep.id}-${section}-${f.path}`,
            group: "Webhook Fields",
            title: f.path,
            subtitle: `${label} • ${ep.name}`,
            description: f.description,
            body: `${f.type} ${f.constraints ?? ""}`,
            to: `${base}#${section}-${fieldAnchorId(f.path)}`,
            meta: ep.method,
          });
        }
      }
    }
  }

  // ─── Products + setup steps ──────────────────────────────────────
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
          subtitle: `Step ${step.step}`,
          description: step.description,
          body: step.details,
          to: `/products/${product.id}/guide#step-${step.step}`,
        });
      }
    }
  }

  items.push({
    id: "guide-webhooks",
    group: "Setup Guides",
    title: "Webhooks Setup Guide",
    subtitle: "End-to-end webhook configuration",
    description: "Configure account, register webhooks, and verify event delivery.",
    to: "/resources/webhooks/guide",
  });

  // ─── Integrations + their sections ───────────────────────────────
  for (const ig of integrations) {
    items.push({
      id: `integration-${ig.id}`,
      group: "Integrations",
      title: `${ig.platform} Integration`,
      subtitle: ig.products.map((p) => p.toUpperCase()).join(" • "),
      description: ig.description,
      body: ig.sections.map((s) => s.title).join(" "),
      to: `/integrations/${ig.id}`,
    });
    for (const section of ig.sections) {
      items.push({
        id: `integration-${ig.id}-${slugify(section.title)}`,
        group: "Integrations",
        title: `${ig.platform}: ${section.title}`,
        subtitle: "Section",
        description: section.content.slice(0, 160),
        body: section.content,
        to: `/integrations/${ig.id}#section-${slugify(section.title)}`,
      });
    }
  }

  // ─── Changelog ───────────────────────────────────────────────────
  for (const entry of changelog) {
    items.push({
      id: `changelog-${entry.date}-${entry.title}`,
      group: "Changelog",
      title: entry.title,
      subtitle: entry.date,
      description: entry.description,
      body: entry.tags.join(" "),
      to: `/changelog#entry-${entry.date}-${slugify(entry.title)}`,
      meta: entry.tags.join(" "),
    });
  }

  // ─── Static pages ────────────────────────────────────────────────
  items.push(
    { id: "page-home", group: "Pages", title: "Home", description: "TruContact Trusted Call Solutions documentation overview", to: "/" },
    { id: "page-call-auth", group: "Pages", title: "Call Authentication (PCA)", description: "Required prerequisite for SCP and BCD", to: "/call-auth" },
    { id: "page-analytics", group: "Pages", title: "Analytics API", description: "Per-TN and account-wide call performance metrics", to: "/resources/analytics" },
    { id: "page-webhooks", group: "Pages", title: "Webhooks Overview", description: "Subscribe to events and receive callbacks", to: "/resources/webhooks" },
    { id: "page-changelog", group: "Pages", title: "Changelog", description: "Recent updates and additions to the platform", to: "/changelog" },
  );

  return items;
}

export const searchIndex: SearchItem[] = buildIndex();

export const groupOrder: SearchGroup[] = [
  "Endpoints",
  "Endpoint Fields",
  "Webhooks",
  "Webhook Fields",
  "Setup Guides",
  "Products",
  "Integrations",
  "Changelog",
  "Pages",
];
