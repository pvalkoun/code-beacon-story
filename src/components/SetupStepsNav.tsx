import { useScrollSpy } from "@/hooks/useScrollSpy";
import { cn } from "@/lib/utils";

type Step = { step: number; title: string };

export function SetupStepsNav({ steps }: { steps: Step[] }) {
  const ids = steps.map((s) => `step-${s.step}`);
  const activeId = useScrollSpy(ids, 140);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", `#${id}`);
    }
  };

  return (
    <div className="ml-4 border-l border-sidebar-border pl-2 mt-1 space-y-0.5">
      {steps.map((s) => {
        const id = `step-${s.step}`;
        const isActive = activeId === id;
        return (
          <a
            key={id}
            href={`#${id}`}
            onClick={(e) => handleClick(e, id)}
            className={cn(
              "flex items-start gap-2 py-1 pl-2 pr-1 rounded text-xs transition-colors",
              "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/40",
              isActive && "bg-sidebar-accent text-sidebar-primary font-medium",
            )}
          >
            <span
              className={cn(
                "inline-flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-semibold shrink-0 mt-0.5",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "bg-sidebar-accent text-sidebar-foreground/70",
              )}
            >
              {s.step}
            </span>
            <span className="leading-tight">{s.title}</span>
          </a>
        );
      })}
    </div>
  );
}
