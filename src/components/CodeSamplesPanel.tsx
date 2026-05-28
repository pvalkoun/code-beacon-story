import { useMemo, useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Lang = "curl" | "javascript" | "nodejs" | "php" | "python";

const TABS: { key: Lang; label: string }[] = [
  { key: "curl", label: "cURL" },
  { key: "javascript", label: "JavaScript" },
  { key: "nodejs", label: "Node.js" },
  { key: "php", label: "PHP" },
  { key: "python", label: "Python" },
];

interface CodeSamplesPanelProps {
  method: string;
  path: string;
  headers?: { key: string; value: string }[];
  body?: string;
  baseUrl?: string;
}

const DEFAULT_BASE_URL = "https://api-rst.ccid.neustar.biz";

function buildHeaders(headers: { key: string; value: string }[]) {
  // Always include Authorization unless explicitly overridden
  const hasAuth = headers.some((h) => h.key.toLowerCase() === "authorization");
  const out = [...headers];
  if (!hasAuth) out.unshift({ key: "Authorization", value: "Bearer {{accessToken}}" });
  return out;
}

function genCurl(method: string, url: string, headers: { key: string; value: string }[], body?: string) {
  const lines = [`curl --request ${method} \\`, `  --url '${url}'`];
  headers.forEach((h) => {
    lines[lines.length - 1] += " \\";
    lines.push(`  --header '${h.key}: ${h.value}'`);
  });
  if (body) {
    lines[lines.length - 1] += " \\";
    lines.push(`  --data '${body}'`);
  }
  return lines.join("\n");
}

function genJavaScript(method: string, url: string, headers: { key: string; value: string }[], body?: string) {
  const headerObj = headers.map((h) => `    '${h.key}': '${h.value}'`).join(",\n");
  const opts = [`  method: '${method}'`, `  headers: {\n${headerObj}\n  }`];
  if (body) opts.push(`  body: JSON.stringify(${body})`);
  return `const options = {
${opts.join(",\n")}
};

fetch('${url}', options)
  .then(response => response.json())
  .then(response => console.log(response))
  .catch(err => console.error(err));`;
}

function genNodeJs(method: string, url: string, headers: { key: string; value: string }[], body?: string) {
  const headerObj = headers.map((h) => `    '${h.key}': '${h.value}'`).join(",\n");
  const opts = [`  method: '${method}'`, `  headers: {\n${headerObj}\n  }`];
  if (body) opts.push(`  body: JSON.stringify(${body})`);
  return `import fetch from 'node-fetch';

const options = {
${opts.join(",\n")}
};

try {
  const response = await fetch('${url}', options);
  const data = await response.json();
  console.log(data);
} catch (error) {
  console.error(error);
}`;
}

function genPhp(method: string, url: string, headers: { key: string; value: string }[], body?: string) {
  const headerArr = headers.map((h) => `    "${h.key}: ${h.value}"`).join(",\n");
  const bodyLine = body ? `\nCURLOPT_POSTFIELDS => ${JSON.stringify(body)},` : "";
  return `<?php

$curl = curl_init();

curl_setopt_array($curl, [
  CURLOPT_URL => "${url}",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_CUSTOMREQUEST => "${method}",${bodyLine}
  CURLOPT_HTTPHEADER => [
${headerArr}
  ],
]);

$response = curl_exec($curl);
$err = curl_error($curl);

curl_close($curl);

if ($err) {
  echo "cURL Error #:" . $err;
} else {
  echo $response;
}`;
}

function genPython(method: string, url: string, headers: { key: string; value: string }[], body?: string) {
  const headerObj = headers.map((h) => `    "${h.key}": "${h.value}"`).join(",\n");
  const payload = body ? `\npayload = ${body}\n` : "";
  const dataArg = body ? ", json=payload" : "";
  return `import requests

url = "${url}"
${payload}
headers = {
${headerObj}
}

response = requests.request("${method}", url, headers=headers${dataArg})

print(response.text)`;
}

export function CodeSamplesPanel({ method, path, headers = [], body, baseUrl = DEFAULT_BASE_URL }: CodeSamplesPanelProps) {
  const [active, setActive] = useState<Lang>("curl");
  const [copied, setCopied] = useState(false);

  const url = `${baseUrl}${path}`;
  const fullHeaders = useMemo(() => buildHeaders(headers), [headers]);

  const samples = useMemo<Record<Lang, string>>(() => ({
    curl: genCurl(method, url, fullHeaders, body),
    javascript: genJavaScript(method, url, fullHeaders, body),
    nodejs: genNodeJs(method, url, fullHeaders, body),
    php: genPhp(method, url, fullHeaders, body),
    python: genPython(method, url, fullHeaders, body),
  }), [method, url, fullHeaders, body]);

  const current = samples[active];

  const handleCopy = async () => {
    await navigator.clipboard.writeText(current);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="not-prose my-6 rounded-lg border border-border overflow-hidden">
      <div className="flex items-center justify-between border-b border-border bg-muted/40">
        <div className="flex flex-wrap">
          {TABS.map((t) => {
            const isActive = active === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setActive(t.key)}
                className={cn(
                  "px-4 py-2.5 text-sm font-medium border-b-2 transition-colors",
                  isActive
                    ? "border-primary text-primary bg-background"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                {t.label}
              </button>
            );
          })}
        </div>
        <Button variant="ghost" size="sm" onClick={handleCopy} className="h-7 px-2 mr-2 text-xs">
          {copied ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
      <div className="code-block">
        <pre className="p-4 overflow-x-auto text-sm leading-relaxed whitespace-pre" style={{ userSelect: "text" }}>
          <code>{current}</code>
        </pre>
      </div>
    </div>
  );
}
