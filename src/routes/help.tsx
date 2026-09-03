import { createFileRoute, Link } from "@tanstack/react-router";
import { Playground } from "@/components/Playground";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help — URL Code" },
      {
        name: "description",
        content:
          "How URL Code works: write tiny programs in the URL path and they execute in your browser. Commands, examples, and playground.",
      },
      { property: "og:title", content: "Help — URL Code" },
      {
        property: "og:description",
        content: "How URL Code works: commands, examples, and playground.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: HelpPage,
});

function HelpPage() {
  return (
    <div>
      <div className="mx-auto max-w-3xl px-4 pt-6">
        <Link
          to="/help"
          className="font-mono text-xs text-muted-foreground hover:text-foreground"
        >
          url-code/help
        </Link>
      </div>
      <Playground program={null} />
    </div>
  );
}
