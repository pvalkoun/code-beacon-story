import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Fuse from "fuse.js";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { groupOrder, searchIndex, type SearchGroup, type SearchItem } from "@/lib/searchIndex";
import { MethodBadge } from "@/components/MethodBadge";
import { Badge } from "@/components/ui/badge";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const fuseRef = useRef<Fuse<SearchItem> | null>(null);

  if (!fuseRef.current) {
    fuseRef.current = new Fuse(searchIndex, {
      keys: [
        { name: "title", weight: 0.45 },
        { name: "subtitle", weight: 0.2 },
        { name: "description", weight: 0.15 },
        { name: "meta", weight: 0.1 },
        { name: "body", weight: 0.1 },
      ],
      threshold: 0.35,
      ignoreLocation: true,
      includeScore: true,
      minMatchCharLength: 2,
    });
  }

  // Reset query when dialog closes
  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const grouped = useMemo(() => {
    const buckets = new Map<SearchGroup, SearchItem[]>();
    const items =
      query.trim().length === 0
        ? // Default: show a curated short list of common entries from each group
          searchIndex.slice(0, 0)
        : fuseRef.current!.search(query, { limit: 40 }).map((r) => r.item);

    for (const item of items) {
      const arr = buckets.get(item.group) ?? [];
      arr.push(item);
      buckets.set(item.group, arr);
    }
    return groupOrder
      .map((g) => ({ group: g, items: buckets.get(g) ?? [] }))
      .filter((b) => b.items.length > 0);
  }, [query]);

  const handleSelect = (item: SearchItem) => {
    onOpenChange(false);
    navigate(item.to);
  };

  // Suggested links when no query is typed
  const suggestions: SearchItem[] = useMemo(() => {
    const ids = [
      "page-call-auth",
      "product-bcd",
      "product-scp",
      "product-cno",
      "guide-webhooks",
      "page-analytics",
      "page-changelog",
    ];
    return ids
      .map((id) => searchIndex.find((i) => i.id === id))
      .filter((i): i is SearchItem => Boolean(i));
  }, []);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search endpoints, guides, integrations…"
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        {query.trim().length === 0 ? (
          <CommandGroup heading="Suggested">
            {suggestions.map((item) => (
              <CommandItem
                key={item.id}
                value={`${item.title} ${item.subtitle ?? ""}`}
                onSelect={() => handleSelect(item)}
              >
                <ResultRow item={item} />
              </CommandItem>
            ))}
          </CommandGroup>
        ) : (
          <>
            <CommandEmpty>No results found.</CommandEmpty>
            {grouped.map(({ group, items }, idx) => (
              <div key={group}>
                {idx > 0 && <CommandSeparator />}
                <CommandGroup heading={group}>
                  {items.map((item) => (
                    <CommandItem
                      key={item.id}
                      value={`${item.title} ${item.subtitle ?? ""} ${item.id}`}
                      onSelect={() => handleSelect(item)}
                    >
                      <ResultRow item={item} />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </div>
            ))}
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}

function ResultRow({ item }: { item: SearchItem }) {
  const method = item.meta?.match(/^(GET|POST|PUT|DELETE)\b/)?.[1] as
    | "GET"
    | "POST"
    | "PUT"
    | "DELETE"
    | undefined;

  return (
    <div className="flex flex-col gap-0.5 min-w-0 w-full">
      <div className="flex items-center gap-2 min-w-0">
        {method && <MethodBadge method={method} />}
        <span className="font-medium truncate">{item.title}</span>
        {item.group === "Changelog" && item.subtitle && (
          <Badge variant="secondary" className="text-[10px] ml-auto shrink-0">
            {item.subtitle}
          </Badge>
        )}
      </div>
      {item.subtitle && item.group !== "Changelog" && (
        <span className="text-xs text-muted-foreground font-mono truncate">{item.subtitle}</span>
      )}
      {item.description && (
        <span className="text-xs text-muted-foreground truncate">{item.description}</span>
      )}
    </div>
  );
}
