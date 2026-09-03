import { createFileRoute } from "@tanstack/react-router";
import { runProgram } from "@/lib/interpreter";

export const Route = createFileRoute("/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const splat = (params as { _splat?: string })._splat ?? "";
        const output = runProgram(splat);
        const text = output.map((line) => line.text).join("\n");
        return new Response(text + (text ? "\n" : ""), {
          status: 200,
          headers: { "content-type": "text/plain; charset=utf-8" },
        });
      },
    },
  },
});
