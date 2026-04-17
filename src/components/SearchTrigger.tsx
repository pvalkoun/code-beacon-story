import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { SearchDialog } from "@/components/SearchDialog";
import { cn } from "@/lib/utils";

export function SearchTrigger() {
  const [open, setOpen] = useState(false);
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(/Mac|iPhone|iPad|iPod/.test(navigator.platform));

    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const shortcut = isMac ? "⌘K" : "Ctrl+K";

  return (
    <>
      {/* Desktop / wider: search-bar styled trigger */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "hidden sm:inline-flex items-center gap-2 h-9 w-full max-w-xs rounded-md border bg-muted/40 hover:bg-muted transition-colors px-3 text-sm text-muted-foreground",
        )}
        aria-label="Search documentation"
      >
        <Search className="h-4 w-4 shrink-0" />
        <span className="flex-1 text-left">Search docs…</span>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          {shortcut}
        </kbd>
      </button>

      {/* Mobile: icon-only */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="sm:hidden inline-flex items-center justify-center h-9 w-9 rounded-md hover:bg-muted text-muted-foreground"
        aria-label="Search documentation"
      >
        <Search className="h-4 w-4" />
      </button>

      <SearchDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
