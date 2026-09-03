import { createFileRoute } from "@tanstack/react-router";
import { runProgram } from "@/lib/interpreter";

const MAX_BYTES = 512 * 1024; // 512 KB cap

function decodeSafe(s: string): string {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

function textResponse(text: string, status = 200): Response {
  return new Response(text, {
    status,
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}

async function fetchText(rawTarget: string): Promise<{ text: string; status: number }> {
  const target = decodeSafe(rawTarget);
  let url: URL;
  try {
    url = new URL(/^https?:\/\//i.test(target) ? target : `https://${target}`);
  } catch {
    return { text: `read: invalid url "${target}"\n`, status: 400 };
  }

  try {
    const res = await fetch(url.toString(), {
      headers: { "user-agent": "url-code/1.0" },
      redirect: "follow",
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) {
      return { text: `read: ${url} responded with ${res.status}\n`, status: 502 };
    }
    const reader = res.body?.getReader();
    if (!reader) return { text: "", status: 200 };
    const chunks: Uint8Array[] = [];
    let total = 0;
    let truncated = false;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > MAX_BYTES) {
        truncated = true;
        chunks.push(value.slice(0, value.byteLength - (total - MAX_BYTES)));
        await reader.cancel();
        break;
      }
      chunks.push(value);
    }
    const text = new TextDecoder().decode(
      chunks.length === 1
        ? chunks[0]
        : (() => {
            const merged = new Uint8Array(chunks.reduce((n, c) => n + c.byteLength, 0));
            let off = 0;
            for (const c of chunks) {
              merged.set(c, off);
              off += c.byteLength;
            }
            return merged;
          })(),
    );
    return { text: truncated ? text + "\n[truncated at 512 KB]\n" : text, status: 200 };
  } catch (e) {
    return { text: `read: failed to fetch ${url} (${(e as Error).message})\n`, status: 502 };
  }
}

export const Route = createFileRoute("/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const splat = (params as { _splat?: string })._splat ?? "";
        const segments = splat.split("/");

        // /read/<url>//<commands...> — fetch a URL server-side and return its raw
        // text. A double slash // ends the URL; anything after it runs as
        // further commands, so reads can be piped into the program.
        if (segments[0] === "read") {
          const urlSegs: string[] = [];
          let i = 1;
          for (; i < segments.length; i++) {
            const seg = segments[i];
            if (seg === "") {
              const prev = urlSegs[urlSegs.length - 1];
              // Keep the // of a scheme like https: — only a // after a
              // non-scheme segment terminates the URL.
              if (prev !== undefined && prev.endsWith(":")) {
                urlSegs.push(seg);
                continue;
              }
              i++;
              break;
            }
            urlSegs.push(seg);
          }
          const rawTarget = urlSegs.join("/");
          if (!rawTarget) {
            return textResponse("read: expected a url, e.g. /read/example.com\n", 400);
          }
          const { text: readText, status } = await fetchText(rawTarget);
          const rest = segments.slice(i).filter(Boolean);
          if (rest.length === 0) return textResponse(readText, status);
          const output = runProgram(rest.map(decodeSafe).join("/"));
          const outText = output.map((line) => line.text).join("\n");
          return textResponse(readText + (outText ? outText + "\n" : ""));
        }

        const output = runProgram(splat);
        const text = output.map((line) => line.text).join("\n");
        return textResponse(text + (text ? "\n" : ""));
      },
    },
  },
});
