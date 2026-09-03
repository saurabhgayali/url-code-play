import { createFileRoute } from "@tanstack/react-router";
import { Playground } from "@/components/Playground";

export const Route = createFileRoute("/$")({
  head: () => ({
    meta: [
      { title: "Running program — URL Code" },
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
  return <Playground program={_splat ?? ""} />;
}
