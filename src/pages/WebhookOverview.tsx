import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, CheckCircle2, BookOpen, Code2, Bell, Zap, Shield, RefreshCw } from "lucide-react";

export default function WebhookOverview() {
  return (
    <div className="docs-prose">
      <h1>Webhook Notifications</h1>
      <p className="text-lg text-muted-foreground">
        Receive real-time status updates for your accounts, caller profiles, and telephone numbers
        without polling the API.
      </p>

      <p>
        Webhooks allow you to subscribe to event notifications so your systems are automatically
        informed when important status changes occur on the TruContact platform. Instead of
        repeatedly polling API endpoints, TransUnion pushes updates directly to your registered
        HTTPS endpoint as soon as events happen — such as vetting completion, partner enablement,
        or tagging changes.
      </p>

      <h2>Key Benefits</h2>
      <ul className="space-y-2">
        {[
          "Real-time notifications — no polling required",
          "Subscribe to specific event types and services (BCD, SCP, CNO)",
          "Scoped delivery at Account, Caller Profile, or TN level",
          "Configurable retry policy with failure email alerts",
          "Full delivery log history for debugging and monitoring",
          "Lifecycle management — update status to pause or resume at any time",
        ].map((b, i) => (
          <li key={i} className="flex items-start gap-2">
            <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 shrink-0" />
            <span>{b}</span>
          </li>
        ))}
      </ul>

      <h2>How It Works</h2>
      <div className="grid gap-4 md:grid-cols-2 not-prose mb-8">
        {[
          {
            icon: Shield,
            title: "1. Enable Webhook Service",
            desc: "Enable the WB service on your AAM account to unlock webhook registration.",
          },
          {
            icon: Bell,
            title: "2. Register Your Endpoint",
            desc: "Provide your HTTPS callback URL, authentication, and choose which events and scopes to subscribe to.",
          },
          {
            icon: Zap,
            title: "3. Receive Notifications",
            desc: "TransUnion pushes event payloads to your endpoint in real-time as status changes occur.",
          },
          {
            icon: RefreshCw,
            title: "4. Monitor & Manage",
            desc: "Review delivery logs, update the webhook state to pause or resume delivery, and modify your configuration at any time.",
          },
        ].map((item, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <item.icon className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold mb-1">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <h2>Supported Event Types</h2>
      <p>
        Webhooks can be configured to notify you of changes across three event categories,
        scoped to the entity level that matters to your integration. For the full list of
        trigger keys to use in your registration payload, see the{" "}
        <Link to="/resources/webhooks/guide#event-reference" className="text-primary underline">
          Event Reference
        </Link>
        .
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-3 font-semibold">Event Type</th>
              <th className="text-left py-2 px-3 font-semibold">Scope Levels</th>
              <th className="text-left py-2 px-3 font-semibold">Example Trigger Keys</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2 px-3 font-medium"><code>vetting_status</code></td>
              <td className="py-2 px-3">TN</td>
              <td className="py-2 px-3 text-muted-foreground"><code>VETTING_SUCCESSFUL</code>, <code>VETTING_EXCEPTION</code></td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-3 font-medium"><code>partner_status</code></td>
              <td className="py-2 px-3">Account, Caller Profile, TN</td>
              <td className="py-2 px-3 text-muted-foreground"><code>Enable-Completed</code>, <code>Suspend-Completed</code>, <code>Resume-Completed</code></td>
            </tr>
            <tr className="border-b last:border-b-0">
              <td className="py-2 px-3 font-medium"><code>tagging_status</code></td>
              <td className="py-2 px-3">TN</td>
              <td className="py-2 px-3 text-muted-foreground"><code>TG</code>, <code>AG</code>, <code>AD</code>, <code>CIP</code></td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-sm">
        <Link to="/resources/webhooks/guide#event-reference" className="text-primary underline">
          View full Event Reference with all trigger keys →
        </Link>
      </p>

      <h2>Getting Started</h2>
      <div className="grid gap-4 md:grid-cols-2 not-prose">
        <Card className="hover:shadow-md transition-shadow flex flex-col">
          <CardContent className="p-5 flex flex-col flex-1">
            <BookOpen className="h-8 w-8 text-primary mb-3" />
            <h3 className="font-semibold mb-1">Setup Guide</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Step-by-step walkthrough from enabling the service to receiving your first event
            </p>
            <Button asChild size="sm" variant="outline" className="mt-auto">
              <Link to="/resources/webhooks/guide">
                View Guide <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow flex flex-col">
          <CardContent className="p-5 flex flex-col flex-1">
            <Code2 className="h-8 w-8 text-primary mb-3" />
            <h3 className="font-semibold mb-1">API Reference</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Explore all webhook endpoints with request/response examples
            </p>
            <Button asChild size="sm" variant="outline" className="mt-auto">
              <Link to="/resources/webhooks/api/wb-enable-account">
                View APIs <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
