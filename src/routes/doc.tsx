import { createFileRoute } from "@tanstack/react-router";
import { Docs } from "@/components/Docs";

export const Route = createFileRoute("/doc")({
  head: () => ({
    meta: [
      { title: "Doc — URL Code commands and sample programs" },
      {
        name: "description",
        content:
          "URL Code documentation: every command, escaping rules, read piping, and complex sample programs you can open directly.",
      },
      { property: "og:title", content: "Doc — URL Code commands and sample programs" },
      {
        property: "og:description",
        content:
          "Command reference and complex runnable sample URLs for URL Code, where the URL path is the program.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "/docs" }],
  }),
  component: Docs,
});
