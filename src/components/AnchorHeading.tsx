import { Link as LinkIcon } from "lucide-react";
import type { ReactNode } from "react";

interface Props {
  id: string;
  level?: 2 | 3;
  children: ReactNode;
  className?: string;
}

/**
 * A heading with an `id` and a copy-link affordance revealed on hover.
 * Lives inside `.docs-prose` so existing typography styles still apply.
 */
export function AnchorHeading({ id, level = 2, children, className }: Props) {
  const Tag = (level === 3 ? "h3" : "h2") as "h2" | "h3";
  return (
    <Tag id={id} className={`group flex items-center ${className ?? ""}`}>
      <span>{children}</span>
      <a href={`#${id}`} aria-label="Link to this section" className="anchor-link">
        <LinkIcon className="h-4 w-4 inline-block" />
      </a>
    </Tag>
  );
}
