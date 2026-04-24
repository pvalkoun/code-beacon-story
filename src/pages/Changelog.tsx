import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

interface ChangelogEntry {
  date: string;
  title: string;
  description: string;
  tags: string[];
  links?: { label: string; to: string }[];
}

const today = new Date().toISOString().slice(0, 10);

const changelog: ChangelogEntry[] = [
  {
    date: today,
    title: "Image Upload Handling for Branded Call Display",
    description:
      "Release date: July 1, 2026. Introduced new Image Profile endpoints (POST, GET, DELETE) to streamline logo and image management for BCD. Upload a publicly accessible image URL to the new Image endpoint and receive a TransUnion-hosted image URL along with an image_profile_id, which can then be referenced when creating Rich BCD caller profiles to display your company logo on recipient devices.",
    tags: ["BCD", "New", "API"],
    links: [
      { label: "Create Image", to: "/products/bcd/api/create-image" },
    ],
  },
  {
    date: today,
    title: "Analytics API for BCD and SCP",
    description:
      "Release date: June 1, 2026. Launched the Analytics API under the Resources section, providing per-TN and account-wide call performance metrics for both Branded Call Display (BCD) and Spoofed Call Protection (SCP). Includes full authentication flow, cursor-based pagination, and detailed response schemas to help you measure delivery, engagement, and authentication outcomes.",
    tags: ["Analytics", "New", "API"],
    links: [
      { label: "Analytics API", to: "/resources/analytics" },
    ],
  },
  {
    date: today,
    title: "Webhook Notifications",
    description:
      "Release date: June 1, 2026. Released the Webhooks module, enabling real-time push notifications for account, caller profile, and TN-level events (vetting and tagging). Includes endpoints to configure callback URLs, manage encryption, send test events, and review delivery logs, plus a documented inbound event delivery contract with retry and cool-off behavior.",
    tags: ["Webhooks", "New", "API"],
    links: [
      { label: "Webhooks Introduction", to: "/resources/webhooks" },
    ],
  },
];

export default function Changelog() {
  return (
    <div className="docs-prose">
      <h1>Changelog</h1>
      <p className="text-lg text-muted-foreground">
        Recent updates and additions to the TruContact Solutions API platform.
      </p>

      <div className="space-y-6 not-prose mt-6">
        {changelog.map((entry, i) => (
          <Card key={i} className="border-l-4 border-l-primary">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-sm font-mono text-muted-foreground">{entry.date}</span>
                {entry.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <h3 className="text-lg font-semibold mb-2">{entry.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{entry.description}</p>
              {entry.links && (
                <div className="flex gap-3 flex-wrap">
                  {entry.links.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className="text-sm text-primary hover:underline font-medium"
                    >
                      {link.label} →
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}