import { Link } from "react-router-dom";
import { CodeBlock } from "@/components/CodeBlock";
import { MethodBadge } from "@/components/MethodBadge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mail, Lock } from "lucide-react";
import { sampleEventPayloads, getWebhookEndpoint, coolOffEmailSample } from "@/data/webhookData";

const setupSteps = [
  {
    step: 1,
    title: "Enable Webhook Service on Your Account",
    details: "Before registering a webhook, your AAM enterprise account must include the Webhook (WB) microservice in its service array. Use the AAM Update Company endpoint with the full enterprise payload — the WB entry in `service[]` enables the Webhook microservice for the account.",
    endpointId: "wb-enable-account",
  },
];

export default function WebhookSetupGuide() {
  const userEndpoint = getWebhookEndpoint("wb-create-user");
  const encryptEndpoint = getWebhookEndpoint("wb-encrypt");
  const registerEndpoint = getWebhookEndpoint("wb-register");
  const testEndpoint = getWebhookEndpoint("wb-test");

  return (
    <div className="docs-prose">
      <h1>Webhook Notifications — Setup Guide</h1>
      <p className="text-lg text-muted-foreground">
        Follow these steps to configure webhook notifications from start to finish.
      </p>

      <div className="p-4 rounded-lg bg-accent/10 border border-accent/20 mb-6">
        <p className="text-sm mb-0">
          <strong>Prerequisites:</strong> You need an active AAM enterprise account and valid API
          credentials. All API calls require a valid access token in the <code>Authorization</code>{" "}
          header.
        </p>
      </div>

      {/* ── Section 1 ── */}
      {setupSteps.map((step) => {
        const endpoint = getWebhookEndpoint(step.endpointId);
        return (
          <div key={step.step} className="mb-10 pb-8 border-b">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center justify-center h-9 w-9 rounded-full bg-primary text-primary-foreground font-bold text-sm shrink-0">
                {step.step}
              </div>
              <h2 className="!mt-0 !mb-0">{step.title}</h2>
            </div>

            <p>{step.details}</p>

            {endpoint && (
              <div className="mt-4 p-4 rounded-lg border bg-card">
                <div className="flex items-center gap-3 mb-3">
                  <MethodBadge method={endpoint.method} />
                  <code className="text-sm font-mono">{endpoint.path}</code>
                </div>

                {endpoint.requestBody && (
                  <CodeBlock code={endpoint.requestBody} title="Request Body" language="json" />
                )}

                {endpoint.responseBody && (
                  <CodeBlock code={endpoint.responseBody} title={`Response — ${endpoint.responseStatus}`} language="json" />
                )}

                <Button asChild variant="link" size="sm" className="mt-2 px-0">
                  <Link to={`/resources/webhooks/api/${endpoint.id}`}>
                    View full API reference <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        );
      })}

      {/* ── Section 2 — User Role Creation ── */}
      <div className="mb-10 pb-8 border-b">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center justify-center h-9 w-9 rounded-full bg-primary text-primary-foreground font-bold text-sm shrink-0">
            2
          </div>
          <h2 className="!mt-0 !mb-0">User Role Creation</h2>
        </div>

        <p>
          Webhook management APIs are protected by service-specific authorization. Only users with
          the appropriate Webhook role can register, update, or pause webhook configurations.
        </p>

        <div className="p-4 rounded-lg bg-muted/40 border my-4">
          <p className="text-sm mb-0">
            <strong>Key Principle:</strong> Even existing company administrators must be explicitly
            granted the Webhook role to manage webhook endpoints.
          </p>
        </div>

        <h3>Webhook Roles</h3>
        <ul>
          <li>
            <code>WB_COMPANY_ADMIN</code> — Allows registering, updating, testing, and managing
            webhooks for a company account.
          </li>
        </ul>

        <h3>Prerequisites</h3>
        <p>Before assigning a Webhook role:</p>
        <ul>
          <li>The company must already be subscribed to the Webhook service.</li>
          <li>The user must exist in Account Management (AAM).</li>
          <li>If the Webhook service is not enabled for the company, role assignment will fail.</li>
        </ul>

        {userEndpoint && (
          <div className="mt-4 p-4 rounded-lg border bg-card">
            <div className="flex items-center gap-3 mb-3">
              <MethodBadge method={userEndpoint.method} />
              <code className="text-sm font-mono">{userEndpoint.path}</code>
            </div>
            {userEndpoint.requestBody && (
              <CodeBlock code={userEndpoint.requestBody} title="Request Body" language="json" />
            )}
            {userEndpoint.responseBody && (
              <CodeBlock code={userEndpoint.responseBody} title={`Response — ${userEndpoint.responseStatus}`} language="json" />
            )}
            <Button asChild variant="link" size="sm" className="mt-2 px-0">
              <Link to={`/resources/webhooks/api/${userEndpoint.id}`}>
                View full API reference <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </div>
        )}
      </div>

      {/* ── Section 3 — Authentication ── */}
      <div className="mb-10 pb-8 border-b">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center justify-center h-9 w-9 rounded-full bg-primary text-primary-foreground font-bold text-sm shrink-0">
            3
          </div>
          <h2 className="!mt-0 !mb-0">Authentication</h2>
        </div>

        <p>
          Webhook delivery can be secured with credentials that the platform attaches to every
          outbound notification request to your endpoint. For security and compliance reasons,
          plain-text passwords or API keys are <strong>never accepted</strong> by webhook APIs.
          Any sensitive value must be encrypted via the Encryption Utility API before being
          submitted in the webhook registration payload.
        </p>

        <h3>Supported Authentication Types</h3>
        <p>When registering a webhook, you may choose one of the following authentication types:</p>
        <ul>
          <li><strong>none</strong> — No credentials required</li>
          <li><strong>oAuth</strong> — Username + encrypted password</li>
          <li><strong>apiKey</strong> — Encrypted API key</li>
        </ul>

        <div className="p-4 rounded-lg bg-accent/10 border border-accent/20 my-4 flex items-start gap-3">
          <Lock className="h-5 w-5 text-accent mt-0.5 shrink-0" />
          <p className="text-sm mb-0">
            <strong>Important:</strong> Any password or API key must be encrypted before being
            included in the webhook registration payload. Use the Encryption Utility API below to
            convert plain-text secrets into the approved encrypted format. When using{" "}
            <code>oAuth</code>, include the encrypted value as the <code>password</code>. When
            using <code>apiKey</code>, include the encrypted value as <code>api_value</code>.
          </p>
        </div>

        <h3 className="mt-8">Encryption Utility</h3>
        {encryptEndpoint && (
          <div className="mt-4 p-4 rounded-lg border bg-card">
            <div className="flex items-center gap-3 mb-3">
              <MethodBadge method={encryptEndpoint.method} />
              <code className="text-sm font-mono">{encryptEndpoint.path}</code>
            </div>
            {encryptEndpoint.requestBody && (
              <CodeBlock code={encryptEndpoint.requestBody} title="Request Body" language="json" />
            )}
            {encryptEndpoint.responseBody && (
              <CodeBlock code={encryptEndpoint.responseBody} title={`Response — ${encryptEndpoint.responseStatus}`} language="json" />
            )}
            <Button asChild variant="link" size="sm" className="mt-2 px-0">
              <Link to={`/resources/webhooks/api/${encryptEndpoint.id}`}>
                View full API reference <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </div>
        )}
      </div>

      {/* ── Section 4 — Register Your Webhook Endpoint ── */}
      <div className="mb-10 pb-8 border-b">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center justify-center h-9 w-9 rounded-full bg-primary text-primary-foreground font-bold text-sm shrink-0">
            4
          </div>
          <h2 className="!mt-0 !mb-0">Register Your Webhook Endpoint</h2>
        </div>

        <p>
          Register your HTTPS callback URL along with authentication credentials, retry
          configuration, notification emails, and the services and event scopes you want to
          subscribe to. You can define separate webhook URLs for different entity scopes (Account,
          Caller Profile, TN) within a single registration. When using <code>oAuth</code>, include
          the encrypted value as the <code>password</code>. When using <code>apiKey</code>, include
          the encrypted value as <code>api_value</code>.
        </p>

        {registerEndpoint && (
          <div className="mt-4 p-4 rounded-lg border bg-card">
            <div className="flex items-center gap-3 mb-3">
              <MethodBadge method={registerEndpoint.method} />
              <code className="text-sm font-mono">{registerEndpoint.path}</code>
            </div>
            {registerEndpoint.requestBody && (
              <CodeBlock code={registerEndpoint.requestBody} title="Request Body" language="json" />
            )}
            {registerEndpoint.responseBody && (
              <CodeBlock code={registerEndpoint.responseBody} title={`Response — ${registerEndpoint.responseStatus}`} language="json" />
            )}
            <Button asChild variant="link" size="sm" className="mt-2 px-0">
              <Link to={`/resources/webhooks/api/${registerEndpoint.id}`}>
                View full API reference <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </div>
        )}
      </div>

      {/* ── Section 5 — Test ── */}
      <div className="mb-10 pb-8 border-b">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center justify-center h-9 w-9 rounded-full bg-primary text-primary-foreground font-bold text-sm shrink-0">
            5
          </div>
          <h2 className="!mt-0 !mb-0">Test</h2>
        </div>

        <p>
          Customers can test the connectivity of their API endpoint(s) prior to (or after) webhook
          registration. This validation confirms that the configured endpoint is reachable and
          operational, reducing the risk of delivery issues after activation. The response returns
          the HTTP status code returned by each endpoint.
        </p>

        {testEndpoint && (
          <div className="mt-4 p-4 rounded-lg border bg-card">
            <div className="flex items-center gap-3 mb-3">
              <MethodBadge method={testEndpoint.method} />
              <code className="text-sm font-mono">{testEndpoint.path}</code>
            </div>
            {testEndpoint.requestBody && (
              <CodeBlock code={testEndpoint.requestBody} title="Request Body" language="json" />
            )}
            {testEndpoint.responseBody && (
              <CodeBlock code={testEndpoint.responseBody} title={`Response — ${testEndpoint.responseStatus}`} language="json" />
            )}
            <Button asChild variant="link" size="sm" className="mt-2 px-0">
              <Link to={`/resources/webhooks/api/${testEndpoint.id}`}>
                View full API reference <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </div>
        )}

        <h3 className="mt-8">Example Responses from Setup Endpoints</h3>
        <p>
          For reference, here are example responses returned by the endpoints used earlier in the
          setup flow. Use these to verify your integration is producing the expected output.
        </p>

        {setupSteps.map((step) => {
          const ep = getWebhookEndpoint(step.endpointId);
          if (!ep?.responseBody) return null;
          return (
            <div key={`test-${ep.id}`} className="mt-4">
              <h4 className="!mb-2">{ep.name}</h4>
              <div className="flex items-center gap-3 mb-2">
                <MethodBadge method={ep.method} />
                <code className="text-sm font-mono">{ep.path}</code>
              </div>
              <CodeBlock code={ep.responseBody} title={`Response — ${ep.responseStatus}`} language="json" />
            </div>
          );
        })}

        {userEndpoint?.responseBody && (
          <div className="mt-4">
            <h4 className="!mb-2">{userEndpoint.name}</h4>
            <div className="flex items-center gap-3 mb-2">
              <MethodBadge method={userEndpoint.method} />
              <code className="text-sm font-mono">{userEndpoint.path}</code>
            </div>
            <CodeBlock code={userEndpoint.responseBody} title={`Response — ${userEndpoint.responseStatus}`} language="json" />
          </div>
        )}

        {encryptEndpoint?.responseBody && (
          <div className="mt-4">
            <h4 className="!mb-2">{encryptEndpoint.name}</h4>
            <div className="flex items-center gap-3 mb-2">
              <MethodBadge method={encryptEndpoint.method} />
              <code className="text-sm font-mono">{encryptEndpoint.path}</code>
            </div>
            <CodeBlock code={encryptEndpoint.responseBody} title={`Response — ${encryptEndpoint.responseStatus}`} language="json" />
          </div>
        )}

        {registerEndpoint?.responseBody && (
          <div className="mt-4">
            <h4 className="!mb-2">{registerEndpoint.name}</h4>
            <div className="flex items-center gap-3 mb-2">
              <MethodBadge method={registerEndpoint.method} />
              <code className="text-sm font-mono">{registerEndpoint.path}</code>
            </div>
            <CodeBlock code={registerEndpoint.responseBody} title={`Response — ${registerEndpoint.responseStatus}`} language="json" />
          </div>
        )}
      </div>

      {/* ── Section 6 — Event Payloads ── */}
      <div className="mb-10 pb-8 border-b">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center justify-center h-9 w-9 rounded-full bg-primary text-primary-foreground font-bold text-sm shrink-0">
            6
          </div>
          <h2 className="!mt-0 !mb-0">Event Payloads</h2>
        </div>

        <p>
          When status changes occur, TransUnion delivers event payloads to your registered endpoint.
          Each payload includes the event type, entity details, and the status transition.
          Below are examples for each scope level:
        </p>

        <h3>Account-Level Event</h3>
        <CodeBlock code={sampleEventPayloads.account} title="Account Status Change" language="json" />

        <h3>Caller Profile-Level Event</h3>
        <CodeBlock code={sampleEventPayloads.callerProfile} title="Caller Profile Status Change" language="json" />

        <h3>TN-Level Event</h3>
        <CodeBlock code={sampleEventPayloads.tn} title="TN Status Change" language="json" />
      </div>

      {/* ── Section 7 — Cool-Off Email Notifications ── */}
      <div className="mb-10 pb-8 border-b">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center justify-center h-9 w-9 rounded-full bg-primary text-primary-foreground font-bold text-sm shrink-0">
            7
          </div>
          <h2 className="!mt-0 !mb-0">Cool-Off Email Notifications</h2>
        </div>

        <p>
          When your webhook endpoint repeatedly fails to acknowledge deliveries (non-2xx responses
          after the maximum retry attempts), the platform enters a temporary <strong>cool-off</strong>{" "}
          period and sends a notification email to the addresses you registered in the{" "}
          <code>email</code> field. The notification includes the account ID, failure reason,
          cool-off duration, delivery resume time, and guidance to ensure your endpoint returns
          HTTP 2xx.
        </p>

        <div className="mt-4 rounded-lg border bg-card overflow-hidden not-prose">
          <div className="bg-muted/40 px-4 py-3 border-b flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Sample Email — Webhook Cool-Off Notification</span>
          </div>
          <div className="p-4 space-y-2 text-sm">
            <div>
              <span className="text-muted-foreground font-medium">Subject: </span>
              <span className="font-mono">{coolOffEmailSample.subject}</span>
            </div>
            <div>
              <span className="text-muted-foreground font-medium">To: </span>
              <span>Subscriber / customer contact email</span>
            </div>
          </div>
          <div className="border-t bg-background p-4">
            <pre className="text-sm whitespace-pre-wrap font-sans leading-relaxed text-foreground">
              {coolOffEmailSample.body}
            </pre>
          </div>
        </div>
      </div>

      {/* ── Event Reference ── */}
      <h2 id="event-reference">Event Reference</h2>
      <p>
        When subscribing to events in the <code>event_types[]</code> array of your webhook
        registration, use the <strong>Event Type</strong> as <code>event_type</code> and the{" "}
        <strong>Trigger Key</strong>(s) as values in <code>trigger_on</code>. Trigger Keys are
        case-sensitive and must match exactly as shown below.
      </p>

      <div className="p-4 rounded-lg bg-muted/40 border mb-6 not-prose">
        <p className="text-sm font-medium mb-2">Example: subscribing to vetting and tagging events</p>
        <CodeBlock
          language="json"
          code={`"event_types": [
  { "event_type": "vetting_status", "trigger_on": ["VETTING_SUCCESSFUL", "VETTING_EXCEPTION"] },
  { "event_type": "tagging_status", "trigger_on": ["TG", "AG"] },
  { "event_type": "partner_status", "trigger_on": ["Enable-Completed"] }
]`}
        />
      </div>

      <h3 id="event-triggers">Allowed Event Types and Trigger Values</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-3 font-semibold">Event Type</th>
              <th className="text-left py-2 px-3 font-semibold">Trigger Key</th>
              <th className="text-left py-2 px-3 font-semibold">Display Label</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b"><td className="py-2 px-3 font-medium align-top" rowSpan={2}><code>vetting_status</code></td><td className="py-2 px-3"><code>VETTING_SUCCESSFUL</code></td><td className="py-2 px-3 text-muted-foreground">Vetting Successful</td></tr>
            <tr className="border-b"><td className="py-2 px-3"><code>VETTING_EXCEPTION</code></td><td className="py-2 px-3 text-muted-foreground">Vetting Exception</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-medium align-top" rowSpan={5}><code>tagging_status</code></td><td className="py-2 px-3"><code>TG</code></td><td className="py-2 px-3 text-muted-foreground">Tagged</td></tr>
            <tr className="border-b"><td className="py-2 px-3"><code>AP</code></td><td className="py-2 px-3 text-muted-foreground">Appeal Pending</td></tr>
            <tr className="border-b"><td className="py-2 px-3"><code>AG</code></td><td className="py-2 px-3 text-muted-foreground">Appeal Granted</td></tr>
            <tr className="border-b"><td className="py-2 px-3"><code>AD</code></td><td className="py-2 px-3 text-muted-foreground">Appeal Declined</td></tr>
            <tr className="border-b"><td className="py-2 px-3"><code>CIP</code></td><td className="py-2 px-3 text-muted-foreground">Customer Input Pending</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-medium align-top" rowSpan={8}><code>partner_status</code></td><td className="py-2 px-3"><code>Enable-Completed</code></td><td className="py-2 px-3 text-muted-foreground">Enable Completed</td></tr>
            <tr className="border-b"><td className="py-2 px-3"><code>Enable-Failed</code></td><td className="py-2 px-3 text-muted-foreground">Enable Failed</td></tr>
            <tr className="border-b"><td className="py-2 px-3"><code>Disable-Completed</code></td><td className="py-2 px-3 text-muted-foreground">Disable Completed</td></tr>
            <tr className="border-b"><td className="py-2 px-3"><code>Disable-Failed</code></td><td className="py-2 px-3 text-muted-foreground">Disable Failed</td></tr>
            <tr className="border-b"><td className="py-2 px-3"><code>Suspend-Completed</code></td><td className="py-2 px-3 text-muted-foreground">Suspend Completed</td></tr>
            <tr className="border-b"><td className="py-2 px-3"><code>Suspend-Failed</code></td><td className="py-2 px-3 text-muted-foreground">Suspend Failed</td></tr>
            <tr className="border-b"><td className="py-2 px-3"><code>Resume-Completed</code></td><td className="py-2 px-3 text-muted-foreground">Resume Completed</td></tr>
            <tr className="border-b last:border-b-0"><td className="py-2 px-3"><code>Resume-Failed</code></td><td className="py-2 px-3 text-muted-foreground">Resume Failed</td></tr>
          </tbody>
        </table>
      </div>

      <h3>Scope Applicability</h3>
      <p>The following table shows which event types apply at each entity scope level:</p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-3 font-semibold">Event Type</th>
              <th className="text-left py-2 px-3 font-semibold">Account</th>
              <th className="text-left py-2 px-3 font-semibold">Caller Profile</th>
              <th className="text-left py-2 px-3 font-semibold">TN</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b"><td className="py-2 px-3"><code>vetting_status</code></td><td className="py-2 px-3 text-muted-foreground">—</td><td className="py-2 px-3 text-muted-foreground">—</td><td className="py-2 px-3">✓</td></tr>
            <tr className="border-b"><td className="py-2 px-3"><code>tagging_status</code></td><td className="py-2 px-3 text-muted-foreground">—</td><td className="py-2 px-3 text-muted-foreground">—</td><td className="py-2 px-3">✓</td></tr>
            <tr className="border-b last:border-b-0"><td className="py-2 px-3"><code>partner_status</code></td><td className="py-2 px-3">✓</td><td className="py-2 px-3">✓</td><td className="py-2 px-3">✓</td></tr>
          </tbody>
        </table>
      </div>

      <h2>Customer Requirements</h2>
      <ul>
        <li>Provide a reachable HTTPS endpoint URL to receive notifications</li>
        <li>Choose an authentication method and keep credentials secure (encrypt secrets via the Encryption Utility before submission)</li>
        <li>Select relevant events and services; optionally specify scopes (Account, Caller Profile, TN)</li>
        <li>Your endpoint must accept POST requests and respond with HTTP 2xx promptly (to avoid triggering retries and cool-off)</li>
        <li>Share allow-listing details if your network restricts inbound traffic</li>
        <li>Designate a technical contact for setup, testing, and incident communication</li>
      </ul>
    </div>
  );
}
