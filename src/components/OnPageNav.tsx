import { useScrollSpy } from "@/hooks/useScrollSpy";
import { cn } from "@/lib/utils";

type Step = { step: number; title: string };

export function OnPageNav({
  steps,
  title = "On this page",
}: {
  steps: Step[];
  title?: string;
}) {
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
    <nav aria-label={title} className="text-sm">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
        {title}
      </p>
      <ul className="space-y-1 border-l border-border">
        {steps.map((s) => {
          const id = `step-${s.step}`;
          const isActive = activeId === id;
          return (
            <li key={id}>
              <a
                href={`#${id}`}
                onClick={(e) => handleClick(e, id)}
                className={cn(
                  "block -ml-px border-l py-1 pl-3 pr-2 text-[13px] leading-snug transition-colors",
                  isActive
                    ? "border-primary text-primary font-medium"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border",
                )}
              >
                <span className="text-muted-foreground/70 mr-1.5 tabular-nums">
                  {s.step}.
                </span>
                {s.title}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
