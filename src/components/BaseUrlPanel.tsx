import { Globe } from "lucide-react";

interface Env {
  label: string;
  url: string;
  description?: string;
}

const DEFAULT_ENVS: Env[] = [
  { label: "Production", url: "https://sdpr.ccid.neustar.biz", description: "Live traffic" },
  { label: "UAT / Sandbox", url: "https://sdpr-uat.ccid.neustar.biz", description: "Testing & integration" },
];

interface BaseUrlPanelProps {
  environments?: Env[];
  note?: string;
}

export function BaseUrlPanel({ environments = DEFAULT_ENVS, note }: BaseUrlPanelProps) {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-muted/40 p-5">
      <div className="flex items-center gap-2 mb-3">
        <Globe className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold m-0">Base URL</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-3">
        Prepend the base URL for your target environment to every endpoint path shown in this documentation.
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        {environments.map((env) => (
          <div key={env.label} className="rounded-md border border-border bg-background p-3">
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
      {note && <p className="text-xs text-muted-foreground mt-3 mb-0">{note}</p>}
    </div>
  );
}
