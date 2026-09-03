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
  const text = output.length === 0
    ? ""
    : output.map((line) => line.text).join("\n");

  return (
    <pre className="whitespace-pre-wrap break-words p-4 font-mono text-sm">
      {text}
    </pre>
  );
}
