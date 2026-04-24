import { useParams, Link } from "react-router-dom";
import { getProduct } from "@/data/productData";
import { getEndpointById } from "@/data/apiData";
import { CodeBlock } from "@/components/CodeBlock";
import { MethodBadge } from "@/components/MethodBadge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { BaseUrlPanel } from "@/components/BaseUrlPanel";

export default function SetupGuide() {
  const { productId } = useParams<{ productId: string }>();
  const product = getProduct(productId || "");

  if (!product) return <div>Product not found</div>;

  return (
    <div className="docs-prose">
      <h1>{product.name} — Setup Guide</h1>
      <p className="text-lg text-muted-foreground">
        Follow these steps to configure {product.name} from start to finish.
      </p>

      {productId !== "pca" && (
        <BaseUrlPanel note="Applies to all endpoints documented in this guide." />
      )}

      <div className="p-4 rounded-lg bg-accent/10 border border-accent/20 mb-6">
        <p className="text-sm mb-0">
          <strong>Prerequisites:</strong> You'll need API credentials (userId and password) provided by TransUnion during onboarding.
          All API calls require a valid access token in the <code>Authorization</code> header.
        </p>
      </div>

      <div className="not-prose mb-8 p-4 rounded-lg border bg-card">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold !mt-0 !mb-0">Jump to a step</h2>
          <span className="text-xs text-muted-foreground">{product.setupSteps.length} steps</span>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {product.setupSteps.map((step) => (
            <a
              key={step.step}
              href={`#step-${step.step}`}
              className="group flex items-center gap-3 p-2.5 rounded-md border bg-background hover:border-primary hover:shadow-sm transition-all"
            >
              <div className="flex items-center justify-center h-7 w-7 rounded-full bg-primary text-primary-foreground font-bold text-xs shrink-0">
                {step.step}
              </div>
              <span className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                {step.title}
              </span>
            </a>
          ))}
        </div>
      </div>

      {product.setupSteps.map((step) => {
        const endpoint = step.apiEndpointId
          ? getEndpointById(step.apiEndpointId, product.id === "pca" ? undefined : product.id)
          : undefined;
        return (
          <div key={step.step} id={`step-${step.step}`} className="mb-10 pb-8 border-b last:border-b-0 scroll-mt-24">
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
                  <Link to={`/products/${productId}/api/${endpoint.id}`}>
                    View full API reference <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </div>
            )}

            {step.externalLink && (
              <div className="mt-4 p-4 rounded-lg border bg-card">
                <Button asChild size="sm" variant="outline">
                  <Link to={step.externalLink.to}>
                    {step.externalLink.label} <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        );
      })}

      <div className="p-6 rounded-lg bg-muted text-center">
        <h3 className="font-semibold mb-2">🎉 Setup Complete!</h3>
        <p className="text-sm text-muted-foreground mb-3">
          Your telephone numbers are now configured for {product.name}. Outbound calls will
          {productId === "scp" ? " be digitally signed to prevent spoofing." : " display your branded content to recipients."}
        </p>
        <div className="flex gap-3 justify-center">
          <Button asChild variant="outline" size="sm">
            <Link to={`/products/${productId}/api/auth-token`}>Explore API Reference</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link to={`/integrations/twilio`}>View Integrations</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
