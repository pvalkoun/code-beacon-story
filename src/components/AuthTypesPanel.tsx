import { useState } from "react";
import { CodeBlock } from "@/components/CodeBlock";
import { KeyRound, Lock, ShieldOff } from "lucide-react";
import { cn } from "@/lib/utils";

type AuthKey = "apiKey" | "oAuth" | "none";

const AUTH_TABS: { key: AuthKey; label: string; icon: typeof KeyRound; blurb: string }[] = [
  {
    key: "apiKey",
    label: "API Key",
    icon: KeyRound,
    blurb:
      "Use a static API key delivered as a header or query parameter on every event request. The api_value must be encrypted with the Encryption Utility before registration.",
  },
  {
    key: "oAuth",
    label: "oAuth",
    icon: Lock,
    blurb:
      "TransUnion will exchange the supplied username/password against your login_url to obtain a bearer token, then attach it to each event request. The password must be encrypted with the Encryption Utility.",
  },
  {
    key: "none",
    label: "None",
    icon: ShieldOff,
    blurb:
      "No authentication is added to outbound event requests. Only use for endpoints protected by network-level controls (e.g. IP allowlisting, mTLS at the gateway).",
  },
];

const SAMPLES: Record<AuthKey, string> = {
  apiKey: `{
  "auth_type": "apiKey",
  "credentials": {
    "api_key": "X-API-KEY",
    "api_value": "X9aP7KqM2R8vZtYcH1fL",
    "location": "Header"
  }
}`,
  oAuth: `{
  "auth_type": "oAuth",
  "credentials": {
    "username": "admin",
    "password": "X9aP7KqM2R8vZtYcH1fL",
    "login_url": "https://demo.myapp.com/login"
  }
}`,
  none: `{
  "auth_type": "none"
}`,
};

export function AuthTypesPanel() {
  const [active, setActive] = useState<AuthKey>("apiKey");
  const current = AUTH_TABS.find((t) => t.key === active)!;

  return (
    <div className="not-prose my-6 rounded-lg border border-border overflow-hidden">
      <div className="flex border-b border-border bg-muted/40">
        {AUTH_TABS.map((t) => {
          const Icon = t.icon;
          const isActive = active === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setActive(t.key)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors",
                isActive
                  ? "border-primary text-primary bg-background"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {t.label}
            </button>
          );
        })}
      </div>
      <div className="p-4 bg-background">
        <p className="text-sm text-muted-foreground mb-3">{current.blurb}</p>
        <CodeBlock code={SAMPLES[active]} language="json" title={`auth_type: ${active}`} />
      </div>
    </div>
  );
}
