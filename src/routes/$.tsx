import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { runProgram } from "@/lib/interpreter";

export const Route = createFileRoute("/$")({
  head: () => ({
    meta: [
      { title: "URL Code" },
      {
        name: "description",
        content: "A URL Code program executing in the browser. The URL is the program.",
      },
      { property: "og:title", content: "URL Code — the URL is the program" },
      {
        property: "og:description",
        content: "A tiny program encoded in a URL path, executed entirely in the browser.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ProgramPage,
});

function ProgramPage() {
  const { _splat } = Route.useParams();
  const output = useMemo(() => runProgram(_splat ?? ""), [_splat]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10 text-foreground">
      <main className="w-full max-w-2xl overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
          <span className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-destructive/70" />
            <span className="size-2.5 rounded-full bg-chart-4/70" />
            <span className="size-2.5 rounded-full bg-chart-2/70" />
          </span>
          <span className="ml-2 truncate font-mono text-xs text-muted-foreground">
            /{_splat}
          </span>
        </div>
        <div className="min-h-32 bg-[oklch(0.12_0.01_260)] p-4 font-mono text-sm leading-relaxed">
          <p className="mb-1 text-muted-foreground/60">$ url-code run</p>
          {output.length === 0 ? (
            <p className="text-muted-foreground/60">(no output)</p>
          ) : (
            output.map((line, i) => (
              <p
                key={i}
                className={
                  line.type === "err"
                    ? "text-destructive"
                    : line.type === "info"
                      ? "text-muted-foreground"
                      : "text-chart-2"
                }
              >
                {line.type === "info" ? "· " : ""}
                {line.text}
              </p>
            ))
          )}
        </div>
        <div className="border-t border-border px-4 py-2.5">
          <a
            href="/help"
            className="font-mono text-xs text-muted-foreground hover:text-foreground"
          >
            open playground →
          </a>
        </div>
      </main>
    </div>
  );
}
