import { Globe } from "lucide-react";

interface Env {
  label: string;
  url: string;
  description?: string;
}

export interface Region {
  label: string;
  code: string;
  description?: string;
  environments: Env[];
}

const DEFAULT_REGIONS: Region[] = [
  {
    label: "United States",
    code: "US",
    description: "Default region for US traffic.",
    environments: [
      { label: "Production", url: "https://api-rst.ccid.neustar.biz", description: "Live traffic" },
      { label: "UAT / Sandbox", url: "https://api-uat-rst.ccid.neustar.biz", description: "Testing & integration" },
    ],
  },
  {
    label: "Canada",
    code: "CA",
    description: "For Canadian traffic.",
    environments: [
      { label: "Production", url: "https://api-rst-ca.ccid.neustar.biz", description: "Live traffic" },
      { label: "UAT / Sandbox", url: "https://api-uat-rst-ca.ccid.neustar.biz", description: "Testing & integration" },
    ],
  },
];

interface BaseUrlPanelProps {
  regions?: Region[];
  note?: string;
}

export function BaseUrlPanel({ regions = DEFAULT_REGIONS, note }: BaseUrlPanelProps) {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-muted/40 p-5">
      <div className="flex items-center gap-2 mb-3">
        <Globe className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold m-0">Base URLs by Region</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Choose the base URL for your region and environment, then prepend it to every endpoint path shown in this documentation. The path suffix is identical across all regions.
      </p>

      <div className="space-y-4">
        {regions.map((region) => (
          <div key={region.code} className="rounded-md border border-border bg-background p-4">
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-primary">{region.code}</span>
              <span className="text-sm font-semibold">{region.label}</span>
              {region.description && (
                <span className="text-xs text-muted-foreground">— {region.description}</span>
              )}
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {region.environments.map((env) => (
                <div key={env.label} className="rounded-md border border-border bg-muted/30 p-3">
                  <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                    {env.label}
                  </div>
                  <code className="block text-sm font-mono break-all">{env.url}</code>
                  {env.description && (
                    <div className="text-xs text-muted-foreground mt-1">{env.description}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {note && <p className="text-xs text-muted-foreground mt-3 mb-0">{note}</p>}
    </div>
  );
}
