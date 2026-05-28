import { useMemo, useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Lang = "curl" | "javascript" | "nodejs" | "php" | "python" | "json";

const TABS: { key: Lang; label: string }[] = [
  { key: "curl", label: "cURL" },
  { key: "javascript", label: "JavaScript" },
  { key: "nodejs", label: "Node.js" },
  { key: "php", label: "PHP" },
  { key: "python", label: "Python" },
  { key: "json", label: "JSON" },
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
  const bodyLine = body ? `\n  CURLOPT_POSTFIELDS => ${JSON.stringify(body)},` : "";
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

function genJson(body?: string) {
  if (!body) return "// No request body";
  try {
    return JSON.stringify(JSON.parse(body), null, 2);
  } catch {
    return body;
  }
}

/* ---------- Syntax highlighting ---------- */

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function highlightJsonStr(code: string): string {
  return escapeHtml(code)
    .replace(/(&quot;[^&]*?&quot;)(\s*:)/g, '<span class="code-key">$1</span>$2')
    .replace(/:\s*(&quot;[^&]*?&quot;)/g, ': <span class="code-string">$1</span>')
    .replace(/\b(true|false|null)\b/g, '<span class="code-boolean">$1</span>')
    .replace(/(-?\b\d+\.?\d*\b)/g, '<span class="code-number">$1</span>');
}

function highlightGeneric(code: string, opts: {
  keywords?: string[];
  comment?: RegExp; // single-line
  blockComment?: RegExp;
}): string {
  let html = escapeHtml(code);

  // strings (double and single)
  html = html.replace(/(&quot;[^&\n]*?&quot;|&#39;[^&\n]*?&#39;|'[^'\n]*'|"[^"\n]*")/g,
    (m) => `<span class="code-string">${m}</span>`);

  // numbers
  html = html.replace(/\b(-?\d+\.?\d*)\b/g, '<span class="code-number">$1</span>');

  // booleans / null / None
  html = html.replace(/\b(true|false|null|None|True|False)\b/g, '<span class="code-boolean">$1</span>');

  // keywords
  if (opts.keywords && opts.keywords.length) {
    const re = new RegExp(`\\b(${opts.keywords.join("|")})\\b`, "g");
    html = html.replace(re, '<span class="code-keyword">$1</span>');
  }

  // comments (apply after, may overlap but ok for our snippets)
  if (opts.comment) {
    html = html.replace(opts.comment, (m) => `<span class="code-comment">${m}</span>`);
  }
  return html;
}

function highlightCurl(code: string): string {
  let html = escapeHtml(code);
  html = html.replace(/('[^']*')/g, '<span class="code-string">$1</span>');
  html = html.replace(/(^|\s)(curl)\b/g, '$1<span class="code-keyword">$2</span>');
  html = html.replace(/(--[a-z-]+)/g, '<span class="code-key">$1</span>');
  return html;
}

function highlight(lang: Lang, code: string): string {
  switch (lang) {
    case "json":
      return highlightJsonStr(code);
    case "curl":
      return highlightCurl(code);
    case "javascript":
    case "nodejs":
      return highlightGeneric(code, {
        keywords: ["const", "let", "var", "import", "from", "try", "catch", "await", "async", "return", "new", "function"],
        comment: /\/\/[^\n]*/g,
      });
    case "php":
      return highlightGeneric(code, {
        keywords: ["echo", "if", "else", "function", "return", "true", "false"],
        comment: /\/\/[^\n]*/g,
      }).replace(/(\$[a-zA-Z_]\w*)/g, '<span class="code-key">$1</span>');
    case "python":
      return highlightGeneric(code, {
        keywords: ["import", "from", "as", "def", "return", "print", "if", "else", "for", "in"],
        comment: /#[^\n]*/g,
      });
    default:
      return escapeHtml(code);
  }
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
    json: genJson(body),
  }), [method, url, fullHeaders, body]);

  const current = samples[active];
  const highlighted = useMemo(() => highlight(active, current), [active, current]);

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
          <code dangerouslySetInnerHTML={{ __html: highlighted }} />
        </pre>
      </div>
    </div>
  );
}
