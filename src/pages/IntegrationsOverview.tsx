import { Link } from "react-router-dom";
import { integrations } from "@/data/integrationData";
import { Card, CardContent } from "@/components/ui/card";
import { Plug, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function IntegrationsOverview() {
  return (
    <div className="docs-prose max-w-5xl">
      <h1>Integrations</h1>
      <p className="text-lg text-muted-foreground">
        Connect TransUnion Trusted Call Solutions with your existing contact center and communications platforms.
        Each integration guide walks you through configuration end-to-end.
      </p>

      <div className="not-prose grid gap-4 md:grid-cols-2 mt-8">
        {integrations.map((integration) => (
          <Link
            key={integration.id}
            to={`/integrations/${integration.id}`}
            className="block group"
          >
            <Card className="h-full hover:shadow-md hover:border-primary/40 transition-all">
              <CardContent className="p-5 flex flex-col h-full">
                <div className="flex items-start gap-3 mb-3">
                  <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                    <Plug className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base mb-0.5 group-hover:text-primary transition-colors">
                      {integration.platform}
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {integration.products.map((p) => (
                        <Badge key={p} variant="secondary" className="text-[10px] uppercase">
                          {p}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground flex-1">{integration.description}</p>
                <div className="mt-3 text-xs text-primary inline-flex items-center font-medium">
                  View integration guide
                  <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
