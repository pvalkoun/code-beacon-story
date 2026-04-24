import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, FileJson, CheckCircle2 } from "lucide-react";
import { CodeBlock } from "@/components/CodeBlock";
import { generateWebhookOpenApiSpec, downloadWebhookOpenApiSpec } from "@/lib/openApiExport";
import { webhookEndpoints } from "@/data/webhookData";

export default function WebhookOpenApiExport() {
  const spec = useMemo(() => generateWebhookOpenApiSpec(), []);
  const json = useMemo(() => JSON.stringify(spec, null, 2), [spec]);
  const preview = useMemo(() => {
    const lines = json.split("\n");
    return lines.slice(0, 60).join("\n") + (lines.length > 60 ? "\n…" : "");
  }, [json]);

  return (
    <div className="docs-prose">
      <h1>Webhooks — OpenAPI Specification</h1>
      <p className="text-lg text-muted-foreground">
        Download a complete OpenAPI 3.0.3 specification for the TransUnion TCS Webhook APIs,
        including the latest request/response examples and the inbound event delivery contract.
      </p>

      <div className="not-prose my-6">
        <Card>
          <CardContent className="p-6 flex flex-col md:flex-row md:items-center gap-4 justify-between">
            <div className="flex items-start gap-3">
              <FileJson className="h-8 w-8 text-primary mt-0.5 shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">tcs-webhooks-openapi-spec.json</h3>
                <p className="text-sm text-muted-foreground">
                  OpenAPI 3.0.3 · {webhookEndpoints.length} endpoints · includes inbound event payload examples
                </p>
              </div>
            </div>
            <Button onClick={downloadWebhookOpenApiSpec} size="lg">
              <Download className="h-4 w-4 mr-2" />
              Download Spec
            </Button>
          </CardContent>
        </Card>
      </div>

      <h2>What's Included</h2>
      <ul className="space-y-2">
        {[
          "All webhook management endpoints (Enable Service, Create User, Register, Get, Update, Delete, Test)",
          "Encryption Utility endpoint for password and API key encryption",
          "Delivery Logs endpoint with response schema",
          "Inbound event delivery contract (Account, Caller Profile, TN scopes) under x-webhooks",
          "Updated request and response examples matching the live setup guide",
          "Security scheme (Bearer JWT) and standard error responses (401, 404)",
        ].map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <h2>How to Use</h2>
      <ol>
        <li>Click <strong>Download Spec</strong> above to save the JSON file locally.</li>
        <li>
          Import into your tool of choice — Swagger UI, Redocly, Postman (File → Import), Insomnia,
          or your code generator (e.g. <code>openapi-generator</code>).
        </li>
        <li>
          Set your <code>servers</code> entry to either Production or UAT, then provide a Bearer
          token obtained from <code>/ccid/aam/v1/login</code>.
        </li>
      </ol>

      <h2>Preview</h2>
      <p className="text-sm text-muted-foreground">
        First 60 lines of the generated specification:
      </p>
      <CodeBlock code={preview} title="tcs-webhooks-openapi-spec.json" language="json" />
    </div>
  );
}
