export interface ChangelogEntry {
  date: string;
  title: string;
  description: string;
  tags: string[];
  links?: { label: string; to: string }[];
}

export const changelog: ChangelogEntry[] = [
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
