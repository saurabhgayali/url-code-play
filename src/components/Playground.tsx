import { useEffect, useRef, useState } from "react";
import { Copy, Play, Check, Terminal, Braces } from "lucide-react";
import { runProgram, EXAMPLES, type OutputLine } from "@/lib/interpreter";

function encodeProgram(input: string): string {
  const cleaned = input.trim().replace(/^https?:\/\/[^/]+/i, "");
  // Keep empty segments: // is meaningful (URL schemes and the read terminator).
  const encoded = cleaned
    .split("/")
    .map((s) => encodeURIComponent(decodeURIComponentSafe(s)))
    .join("/");
  return encoded.startsWith("/") ? encoded : "/" + encoded;
}

function decodeURIComponentSafe(s: string): string {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

export function Playground({ program }: { program: string | null }) {
  const [input, setInput] = useState(program ?? "");
  const [output, setOutput] = useState<OutputLine[]>([]);
  const [copied, setCopied] = useState(false);
  const [ran, setRan] = useState(false);
  const termRef = useRef<HTMLDivElement>(null);

  const executableUrl =
    typeof window !== "undefined" && program
      ? window.location.origin + encodeProgram(program)
      : null;

  useEffect(() => {
    if (program) {
      setInput(program.startsWith("/") ? program : "/" + program);
      setOutput(runProgram(program));
      setRan(true);
    }
  }, [program]);

  useEffect(() => {
    termRef.current?.scrollTo({ top: termRef.current.scrollHeight });
  }, [output]);

  const run = () => {
    const path = encodeProgram(input);
    if (path === "/") {
      setOutput([{ type: "err", text: "type a program first, e.g. /print/Hello" }]);
      setRan(true);
      return;
    }
    // Full navigation keeps pre-encoded segments (%20 etc.) verbatim —
    // the URL is the source of truth.
    window.location.assign(path);
  };

  const copyUrl = async () => {
    if (!executableUrl) return;
    try {
      await navigator.clipboard.writeText(executableUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-6 px-4 py-8 sm:py-12">
        {/* Header */}
        <header className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg border border-border bg-card">
            <Braces className="size-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">URL Code</h1>
            <p className="text-sm text-muted-foreground">
              The URL is the program. Write commands in the path, share the link, it runs.
            </p>
          </div>
        </header>

        {/* Input */}
        <section className="rounded-xl border border-border bg-card p-4">
          <label htmlFor="program" className="mb-2 block font-mono text-xs text-muted-foreground">
            program
          </label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              id="program"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && run()}
              placeholder="/set/x/10/add/x/20/print/x"
              spellCheck={false}
              className="h-11 flex-1 rounded-md border border-input bg-background px-3 font-mono text-sm outline-none placeholder:text-muted-foreground/50 focus:border-ring"
            />
            <button
              onClick={run}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 font-mono text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Play className="size-4" />
              Run
            </button>
          </div>

          {/* Generated URL */}
          <div className="mt-4">
            <div className="mb-2 font-mono text-xs text-muted-foreground">executable url</div>
            <div className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2">
              <span className="min-w-0 flex-1 truncate font-mono text-xs text-accent-foreground/90">
                {executableUrl ?? "run a program to generate its URL"}
              </span>
              <button
                onClick={copyUrl}
                disabled={!executableUrl}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-border bg-secondary px-2.5 py-1.5 font-mono text-xs text-secondary-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
              >
                {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                {copied ? "Copied" : "Copy URL"}
              </button>
            </div>
          </div>
        </section>

        {/* Terminal output */}
        <section className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
            <Terminal className="size-4 text-muted-foreground" />
            <span className="font-mono text-xs text-muted-foreground">output</span>
            <span className="ml-auto flex gap-1.5">
              <span className="size-2.5 rounded-full bg-destructive/70" />
              <span className="size-2.5 rounded-full bg-chart-4/70" />
              <span className="size-2.5 rounded-full bg-chart-2/70" />
            </span>
          </div>
          <div
            ref={termRef}
            className="min-h-44 max-h-72 overflow-y-auto bg-[oklch(0.12_0.01_260)] p-4 font-mono text-sm leading-relaxed"
          >
            {!ran ? (
              <p className="text-muted-foreground/60">$ waiting for a program…</p>
            ) : output.length === 0 ? (
              <p className="text-muted-foreground/60">$ (no output)</p>
            ) : (
              <>
                <p className="mb-1 text-muted-foreground/60">$ url-code run</p>
                {output.map((line, i) => (
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
                ))}
              </>
            )}
          </div>
        </section>

        {/* Examples */}
        <section>
          <h2 className="mb-2 font-mono text-xs text-muted-foreground">examples — click to load</h2>
          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map((ex) => (
              <button
                key={ex.path}
                onClick={() => {
                  setInput(ex.path);
                  window.location.assign(ex.path);
                }}
                className="rounded-md border border-border bg-card px-3 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:border-ring hover:text-foreground"
                title={ex.path}
              >
                {ex.label}
              </button>
            ))}
          </div>
        </section>

        {/* Reference */}
        <section className="rounded-xl border border-border bg-card p-4">
          <h2 className="mb-3 font-mono text-xs text-muted-foreground">command reference</h2>
          <dl className="grid gap-x-6 gap-y-2 font-mono text-xs sm:grid-cols-2">
            {[
              ["/print/<text>", "print text or a variable's value"],
              ["/set/<var>/<value>", "assign a value to a variable"],
              ["/add/<var>/<n>", "add n to a variable"],
              ["/subtract/<var>/<n>", "subtract n from a variable"],
              ["/multiply/<var>/<n>", "multiply a variable by n"],
              ["/divide/<var>/<n>", "divide a variable by n"],
              ["/repeat/<n>/<command>", "run the next command n times"],
              ["/read/<url>", "fetch a url (no https:// needed) and show its raw text"],
              ["/read/<url>;<command>", "; ends the url — commands after it run next (piping)"],
            ].map(([cmd, desc]) => (
              <div key={cmd} className="flex flex-col gap-0.5">
                <dt className="text-chart-2">{cmd}</dt>
                <dd className="text-muted-foreground">{desc}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 font-mono text-xs text-muted-foreground/70">
            tip: use %20 for spaces · commands run left to right · repeat applies to the single
            command that follows it
          </p>
        </section>

        <footer className="pb-4 text-center font-mono text-xs text-muted-foreground/60">
          the URL is the source of truth — no servers, no storage
        </footer>
      </div>
    </div>
  );
}
