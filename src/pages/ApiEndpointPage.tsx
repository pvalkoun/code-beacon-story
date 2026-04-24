import { useParams } from "react-router-dom";
import { getEndpointById } from "@/data/apiData";
import { endpointFieldDocs } from "@/data/apiFieldDocs";
import { CodeBlock } from "@/components/CodeBlock";
import { MethodBadge } from "@/components/MethodBadge";
import type { FieldDoc } from "@/data/apiFieldDocs";
import { AlertTriangle } from "lucide-react";

// Extract example value for a given dotted path (supports "a.b" and "a[].b") from a parsed JSON example.
function getExampleValue(example: unknown, path: string): unknown {
  if (example == null) return undefined;
  const segments = path.split(".");
  let current: unknown = example;
  for (let seg of segments) {
    const isArray = seg.endsWith("[]");
    if (isArray) seg = seg.slice(0, -2);
    if (current && typeof current === "object" && seg in (current as Record<string, unknown>)) {
      current = (current as Record<string, unknown>)[seg];
    } else {
      return undefined;
    }
    if (isArray) {
      if (Array.isArray(current) && current.length > 0) {
        current = current[0];
      } else {
        return undefined;
      }
    }
  }
  return current;
}

function formatExampleValue(value: unknown): string | null {
  if (value === undefined) return null;
  if (value === null) return "null";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";
    if (value.every((v) => typeof v !== "object" || v === null)) {
      return value.map((v) => (typeof v === "string" ? v : JSON.stringify(v))).join(", ");
    }
    return JSON.stringify(value);
  }
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function FieldTable({
  title,
  fields,
  restrictedMode,
  exampleJson,
}: {
  title: string;
  fields: FieldDoc[];
  restrictedMode?: boolean;
  exampleJson?: unknown;
}) {
  return (
    <>
      <h2>{title}</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-3 font-semibold">Field</th>
              <th className="text-left py-2 px-3 font-semibold">Type</th>
              <th className="text-left py-2 px-3 font-semibold">Required</th>
              <th className="text-left py-2 px-3 font-semibold">Description</th>
              {restrictedMode && (
                <th className="text-left py-2 px-3 font-semibold">Use this value</th>
              )}
              <th className="text-left py-2 px-3 font-semibold">
                {restrictedMode ? "Restricted values" : "Constraints"}
              </th>
            </tr>
          </thead>
          <tbody>
            {fields.map((f, i) => {
              const exampleValue = restrictedMode
                ? formatExampleValue(getExampleValue(exampleJson, f.path))
                : null;
              return (
                <tr key={i} className="border-b last:border-b-0">
                  <td className="py-2 px-3 font-mono text-xs">{f.path}</td>
                  <td className="py-2 px-3">
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground">
                      {f.type}
                    </span>
                  </td>
                  <td className="py-2 px-3">
                    {f.required ? (
                      <span className="text-xs font-semibold text-destructive">Required</span>
                    ) : (
                      <span className="text-xs text-muted-foreground">Optional</span>
                    )}
                  </td>
                  <td className="py-2 px-3 text-muted-foreground">{f.description}</td>
                  {restrictedMode && (
                    <td className="py-2 px-3 text-xs">
                      {exampleValue !== null ? (
                        <code className="px-1.5 py-0.5 rounded bg-primary/10 text-primary font-mono break-all">
                          {exampleValue}
                        </code>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                  )}
                  <td className="py-2 px-3 text-xs text-muted-foreground">
                    {f.constraints ? (
                      restrictedMode ? (
                        <span
                          className="italic line-through decoration-destructive/60"
                          title="Restricted — do not use unless explicitly instructed by your TransUnion representative."
                        >
                          {f.constraints}
                        </span>
                      ) : (
                        f.constraints
                      )
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default function ApiEndpointPage() {
  const { productId, endpointId } = useParams<{ productId: "scp" | "bcd" | "cno"; endpointId: string }>();
  const endpoint = getEndpointById(endpointId || "", productId);
  const fieldDocs = endpointFieldDocs[endpointId || ""];

  if (!endpoint) return <div className="docs-prose"><h1>Endpoint not found</h1></div>;

  return (
    <div className="docs-prose">
      <div className="flex items-center gap-3 mb-2">
        <MethodBadge method={endpoint.method} />
        <h1 className="!mb-0 !mt-0">{endpoint.name}</h1>
      </div>

      <div className="mb-6 p-3 rounded-lg bg-muted font-mono text-sm">
        <span className="font-bold mr-2">{endpoint.method}</span>
        {endpoint.path}
      </div>

      <p>{endpoint.description}</p>

      {endpoint.imageRequirements && endpoint.imageRequirements.length > 0 && (
        <div className="flex items-start gap-3 p-4 mb-6 rounded-lg border border-accent bg-accent/10">
          <AlertTriangle className="h-5 w-5 text-accent-foreground mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold text-sm mb-2 !mt-0">Image Requirements</p>
            <ul className="!mb-0 text-sm space-y-1">
              {endpoint.imageRequirements.map((req, i) => (
                <li key={i}>{req}</li>
              ))}
            </ul>
            <p className="text-xs text-muted-foreground mt-2 !mb-0">
              Images that do not meet these requirements will be rejected with a 400 error.
            </p>
          </div>
        </div>
      )}

      {fieldDocs?.pathParams && fieldDocs.pathParams.length > 0 && (
        <FieldTable title="Path Parameters" fields={fieldDocs.pathParams} />
      )}

      {endpoint.headers && endpoint.headers.length > 0 && (
        <>
          <h2>Headers</h2>
          <table>
            <thead>
              <tr>
                <th>Header</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>Authorization</code></td>
                <td><code>Bearer {'{{accessToken}}'}</code></td>
              </tr>
              {endpoint.headers.map((h, i) => (
                <tr key={i}>
                  <td><code>{h.key}</code></td>
                  <td><code>{h.value}</code></td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {fieldDocs?.requestFields && fieldDocs.requestFields.length > 0 && (
        <FieldTable
          title="Request Fields"
          fields={fieldDocs.requestFields}
          constraintsAdvisory={productId === "cno"}
        />
      )}

      {endpoint.requestBody && (
        <>
          <h2>Request Body Example</h2>
          <CodeBlock code={endpoint.requestBody} title="JSON" language="json" />
        </>
      )}

      {fieldDocs?.responseFields && fieldDocs.responseFields.length > 0 && (
        <FieldTable title="Response Fields" fields={fieldDocs.responseFields} />
      )}

      {endpoint.responseBody && (
        <>
          <h2>Response Example</h2>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-800">
              {endpoint.responseStatus}
            </span>
            <span className="text-sm text-muted-foreground">
              {endpoint.responseStatus === 200 ? "OK" : endpoint.responseStatus === 201 ? "Created" : endpoint.responseStatus === 204 ? "No Content" : "Success"}
            </span>
          </div>
          <CodeBlock code={endpoint.responseBody} title="Response" language="json" />
        </>
      )}

      {endpoint.errorBody && (
        <>
          <h2>Error Response</h2>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-red-100 text-red-800">
              400
            </span>
            <span className="text-sm text-muted-foreground">Bad Request</span>
          </div>
          <CodeBlock code={endpoint.errorBody} title="Error Response" language="json" />
        </>
      )}

      {endpoint.responseStatus === 204 && !endpoint.responseBody && (
        <>
          <h2>Response</h2>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-800">
              204
            </span>
            <span className="text-sm text-muted-foreground">No Content — the resource was successfully deleted.</span>
          </div>
        </>
      )}
    </div>
  );
}
