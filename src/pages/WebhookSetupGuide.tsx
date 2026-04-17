import { Link } from "react-router-dom";
import { CodeBlock } from "@/components/CodeBlock";
import { MethodBadge } from "@/components/MethodBadge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { sampleEventPayloads, getWebhookEndpoint } from "@/data/webhookData";

const setupSteps = [
  {
    step: 1,
    title: "Enable Webhook Service on Your Account",
    details: "Before registering a webhook, your AAM account must be enabled for the Webhook (WB) microservice. Use the AAM Update endpoint to set enableWB to true. The accountId returned is required for all subsequent webhook operations.",
    endpointId: "wb-enable-account",
  },
  {
    step: 2,
    title: "Register Your Webhook Endpoint",
    details: "Register your HTTPS callback URL along with authentication credentials, retry configuration, notification emails, and the services and event scopes you want to subscribe to. You can define separate webhook URLs for different entity scopes (Account, Caller Profile, TN) within a single registration.",
    endpointId: "wb-register",
  },
  {
    step: 3,
    title: "Verify Your Configuration",
    details: "After registration, your webhook enters the ACTIVE state. TransUnion will begin delivering event notifications to your endpoint as status changes occur. We recommend triggering a test event or reviewing the delivery logs to confirm your endpoint is reachable and processing payloads correctly.",
    endpointId: "wb-logs",
  },
];

export default function WebhookSetupGuide() {
  return (
    <div className="docs-prose">
      <h1>Webhook Notifications — Setup Guide</h1>
      <p className="text-lg text-muted-foreground">
        Follow these steps to configure webhook notifications from start to finish.
      </p>

      <div className="p-4 rounded-lg bg-accent/10 border border-accent/20 mb-6">
        <p className="text-sm mb-0">
          <strong>Prerequisites:</strong> You need an active AAM account and valid API credentials.
          All API calls require a valid access token in the <code>Authorization</code> header.
        </p>
      </div>

      {setupSteps.map((step) => {
        const endpoint = getWebhookEndpoint(step.endpointId);
        return (
          <div key={step.step} className="mb-10 pb-8 border-b last:border-b-0">
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

      <h2>Sample Event Payloads</h2>
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

      <h2 id="event-reference">Event Reference</h2>
      <p>
        When subscribing to events in the <code>events[]</code> array of your webhook registration,
        use the <strong>Event Type</strong> as the key and the <strong>Trigger Key</strong> as the value.
        Trigger Keys are case-sensitive and must match exactly as shown below.
      </p>

      <div className="p-4 rounded-lg bg-muted/40 border mb-6 not-prose">
        <p className="text-sm font-medium mb-2">Example: subscribing to vetting and tagging events</p>
        <CodeBlock
          language="json"
          code={`"events": [
  { "vetting_status": "VETTING_SUCCESSFUL" },
  { "vetting_status": "VETTING_EXCEPTION" },
  { "tagging_status": "TG" },
  { "tagging_status": "AG" },
  { "partner_status": "Enable-Completed" }
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

      <h3>Caller Profile-Level Events</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-3 font-semibold">Status</th>
              <th className="text-left py-2 px-3 font-semibold">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b"><td className="py-2 px-3"><code>Enable-Completed</code></td><td className="py-2 px-3 text-muted-foreground">Caller Profile successfully enabled after TU/Partner review</td></tr>
            <tr className="border-b"><td className="py-2 px-3"><code>Enable-Failed</code></td><td className="py-2 px-3 text-muted-foreground">Caller Profile enablement was not successful</td></tr>
            <tr className="border-b"><td className="py-2 px-3"><code>Suspend-Completed</code></td><td className="py-2 px-3 text-muted-foreground">All TNs under the Caller Profile were deactivated</td></tr>
            <tr className="border-b"><td className="py-2 px-3"><code>Suspend-Failed</code></td><td className="py-2 px-3 text-muted-foreground">Suspension of Caller Profile TNs failed</td></tr>
            <tr className="border-b"><td className="py-2 px-3"><code>Resume-Completed</code></td><td className="py-2 px-3 text-muted-foreground">Caller Profile and TNs successfully reactivated</td></tr>
            <tr className="border-b last:border-b-0"><td className="py-2 px-3"><code>Resume-Failed</code></td><td className="py-2 px-3 text-muted-foreground">Resume request could not be completed</td></tr>
          </tbody>
        </table>
      </div>

      <h3>Account-Level Events</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-3 font-semibold">Status</th>
              <th className="text-left py-2 px-3 font-semibold">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b"><td className="py-2 px-3"><code>Enable-Completed</code></td><td className="py-2 px-3 text-muted-foreground">Account feature provisioning completed by the partner</td></tr>
            <tr className="border-b"><td className="py-2 px-3"><code>Enable-Failed</code></td><td className="py-2 px-3 text-muted-foreground">Account enablement failed, may require reprocessing</td></tr>
            <tr className="border-b"><td className="py-2 px-3"><code>Suspend-Completed</code></td><td className="py-2 px-3 text-muted-foreground">All TNs under the account deactivated during suspension</td></tr>
            <tr className="border-b"><td className="py-2 px-3"><code>Suspend-Failed</code></td><td className="py-2 px-3 text-muted-foreground">Account-level suspension failed</td></tr>
            <tr className="border-b"><td className="py-2 px-3"><code>Resume-Completed</code></td><td className="py-2 px-3 text-muted-foreground">All TNs under the account reactivated after suspension</td></tr>
            <tr className="border-b last:border-b-0"><td className="py-2 px-3"><code>Resume-Failed</code></td><td className="py-2 px-3 text-muted-foreground">Partner failed to resume services for the account</td></tr>
          </tbody>
        </table>
      </div>

      <h2>Customer Requirements</h2>
      <ul>
        <li>Provide a reachable HTTPS endpoint URL to receive notifications</li>
        <li>Choose an authentication method and keep credentials secure</li>
        <li>Select relevant events and services; optionally specify scopes (Account, Caller Profile, TN)</li>
        <li>Your endpoint must accept POST requests and respond promptly (to avoid triggering retries)</li>
        <li>Share allow-listing details if your network restricts inbound traffic</li>
        <li>Designate a technical contact for setup, testing, and incident communication</li>
      </ul>
    </div>
  );
}
