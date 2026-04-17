import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { changelog } from "@/data/changelogData";

export default function Changelog() {
  return (
    <div className="docs-prose">
      <h1>Changelog</h1>
      <p className="text-lg text-muted-foreground">
        Recent updates and additions to the TruContact Solutions API platform.
      </p>

      <div className="space-y-6 not-prose mt-6">
        {changelog.map((entry, i) => (
          <Card
            key={i}
            id={`entry-${entry.date}-${slugify(entry.title)}`}
            className="border-l-4 border-l-primary"
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-sm font-mono text-muted-foreground">{entry.date}</span>
                {entry.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <h3 className="text-lg font-semibold mb-2">{entry.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{entry.description}</p>
              {entry.links && (
                <div className="flex gap-3 flex-wrap">
                  {entry.links.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className="text-sm text-primary hover:underline font-medium"
                    >
                      {link.label} →
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
