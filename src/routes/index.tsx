import { createFileRoute } from "@tanstack/react-router";
import { Playground } from "@/components/Playground";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "URL Code — the URL is the program" },
      {
        name: "description",
        content:
          "Write tiny programs in the URL path. /set/x/10/add/x/20/print/x runs in your browser and prints 30. Share the link, share the program.",
      },
      { property: "og:title", content: "URL Code — the URL is the program" },
      {
        property: "og:description",
        content:
          "Write tiny programs in the URL path. Share the link and it executes in the browser. No servers, no storage.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

function Index() {
  return <Playground program={null} />;
}
