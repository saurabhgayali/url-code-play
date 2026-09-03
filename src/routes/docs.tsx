import { createFileRoute } from "@tanstack/react-router";
import { Docs } from "@/components/Docs";

export const Route = createFileRoute("/docs")({
  head: () => ({
    meta: [
      { title: "Docs — URL Code commands and sample programs" },
      {
        name: "description",
        content:
          "Full URL Code reference: print, set, arithmetic, repeat, read and piping — plus a dozen complex ready-to-run sample program URLs.",
      },
      { property: "og:title", content: "Docs — URL Code commands and sample programs" },
      {
        property: "og:description",
        content:
          "Command reference and complex runnable sample URLs for URL Code, where the URL path is the program.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Docs,
});
