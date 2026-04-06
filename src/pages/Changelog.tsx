import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Bell } from "lucide-react";

interface ChangelogEntry {
  date: string;
  title: string;
  description: string;
  tags: string[];
  links?: { label: string; to: string }[];
}

const changelog: ChangelogEntry[] = [
  {
    date: "2026-04-06",
    title: "Changelog Email Notifications",
    description:
      "You can now subscribe to receive email notifications whenever we publish updates to the TruContact Solutions API platform. Sign up with your work email to stay informed about new features, API changes, and platform improvements — delivered straight to your inbox.",
    tags: ["New Feature", "Email"],
    links: [
      { label: "Subscribe Now", to: "/changelog/subscribe" },
    ],
  },
  {
    date: "2026-04-06",
    title: "Analytics API Documentation",
    description:
      "Added Analytics API reference under a new Resources section with full authentication flow, corrected endpoint paths (/ccid/analytics/v1/admin/account/{accountId}/tn and /tns), per-TN and account-wide call performance metrics for BCD and SCP services, cursor-based pagination, and detailed response schema references.",
    tags: ["Analytics", "Updated", "API"],
    links: [
      { label: "Analytics API", to: "/resources/analytics" },
    ],
  },
  {
    date: "2026-04-06",
    title: "Image Profile API for Branded Call Display",
    description:
      "Added new Image Profile endpoints (POST, GET, DELETE) to the BCD configuration flow. Image profiles allow you to upload a public image URL and receive an internal TransUnion-hosted image URL. The returned image_profile_id is used when creating Rich BCD caller profiles to display your company logo on recipient devices.",
    tags: ["BCD", "New Feature", "API"],
    links: [
      { label: "Create Image Profile", to: "/products/bcd/api/create-image-profile" },
      { label: "BCD Setup Guide", to: "/products/bcd/guide" },
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

      {/* Subscribe CTA */}
      <div className="not-prose mt-6 mb-10">
        <Card className="bg-accent/5 border-accent/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-start gap-3">
                <Bell className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="text-base font-semibold">Stay up to date</h3>
                  <p className="text-sm text-muted-foreground">
                    Get notified when we publish new API changes, features, and updates.
                  </p>
                </div>
              </div>
              <Link
                to="/changelog/subscribe"
                className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors no-underline"
              >
                Subscribe to Updates
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6 not-prose">
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
