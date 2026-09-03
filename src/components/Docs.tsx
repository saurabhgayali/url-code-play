const COMMANDS: [string, string][] = [
  ["/print/<text>", "print literal text, or the value of a variable with that name"],
  ["/set/<var>/<value>", "assign a number or string to a variable"],
  ["/add/<var>/<n>", "var = var + n"],
  ["/subtract/<var>/<n>", "var = var - n"],
  ["/multiply/<var>/<n>", "var = var * n"],
  ["/divide/<var>/<n>", "var = var / n (division by zero errors)"],
  ["/repeat/<n>/<command>", "run the single command that follows, n times"],
  ["/read/<url>", "fetch a url server-side and return its raw text, like opening it in notepad"],
  ["/read/<url>;<commands>", "; terminates the url; commands after it run and append their output"],
];

const SAMPLES: { title: string; note: string; path: string }[] = [
  {
    title: "Compound interest, 5 periods",
    note: "start at 1000, multiply by 1.05 five times, then print the balance",
    path: "/set/balance/1000/repeat/5/multiply/balance/1.05/print/balance",
  },
  {
    title: "Two counters in one program",
    note: "variables are independent; commands run strictly left to right",
    path: "/set/a/1/set/b/100/repeat/3/add/a/2/repeat/3/subtract/b/10/print/a/print/b",
  },
  {
    title: "Powers of two",
    note: "double a variable ten times and print the result",
    path: "/set/p/1/repeat/10/multiply/p/2/print/p",
  },
  {
    title: "Factorial-ish accumulation",
    note: "multiply through a fixed sequence of factors",
    path: "/set/f/1/multiply/f/2/multiply/f/3/multiply/f/4/multiply/f/5/print/f",
  },
  {
    title: "Labelled report",
    note: "mix literal text and variable printing to format output",
    path: "/set/total/240/divide/total/4/print/quarterly%20total/print/total",
  },
  {
    title: "Average of a running sum",
    note: "accumulate, then divide by the count",
    path: "/set/sum/0/add/sum/12/add/sum/30/add/sum/48/divide/sum/3/print/sum",
  },
  {
    title: "Banner with repeat",
    note: "repeat applies to exactly one command — the one directly after the count",
    path: "/repeat/8/print/%3D%3D%3D%3D%3D%3D%3D%3D/print/URL%20CODE",
  },
  {
    title: "Read a page as plain text",
    note: "no scheme needed — https:// is added automatically; HTML is returned as source text, never rendered",
    path: "/read/example.com",
  },
  {
    title: "Read an RSS feed, then pipe",
    note: "; ends the url; the commands after it run once the fetch completes",
    path: "/read/news.ycombinator.com/rss;/print/--%20end%20of%20feed%20--",
  },
  {
    title: "Read, then compute a summary",
    note: "piping composes a fetch with arithmetic in a single shareable url",
    path: "/read/example.com;/set/items/3/multiply/items/7/print/items",
  },
  {
    title: "Read, then repeat a separator",
    note: "any command sequence is valid after the ; terminator",
    path: "/read/example.com;/repeat/3/print/done",
  },
  {
    title: "Escaping and spaces",
    note: "%20 for spaces, %2F for a literal slash inside an argument",
    path: "/set/msg/hello%20there/print/msg/print/a%2Fb",
  },
];

export function Docs() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-semibold tracking-tight">URL Code documentation</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The URL is the program. Every path below is a complete, shareable program — open it and
          the server returns plain text output, nothing else.
        </p>

        <h2 className="mt-8 font-mono text-xs text-muted-foreground">command reference</h2>
        <dl className="mt-3 grid gap-x-6 gap-y-2 font-mono text-xs sm:grid-cols-2">
          {COMMANDS.map(([cmd, desc]) => (
            <div key={cmd} className="flex flex-col gap-0.5">
              <dt className="text-chart-2">{cmd}</dt>
              <dd className="text-muted-foreground">{desc}</dd>
            </div>
          ))}
        </dl>

        <h2 className="mt-10 font-mono text-xs text-muted-foreground">complex samples</h2>
        <ul className="mt-3 space-y-3">
          {SAMPLES.map((s) => (
            <li key={s.path} className="rounded-xl border border-border bg-card p-4">
              <h3 className="text-sm font-medium">{s.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{s.note}</p>
              <a
                href={s.path}
                className="mt-2 block break-all font-mono text-xs text-chart-2 underline-offset-4 hover:underline"
              >
                {s.path}
              </a>
            </li>
          ))}
        </ul>

        <h2 className="mt-10 font-mono text-xs text-muted-foreground">notes</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          <li>Commands execute left to right; there is no branching or nesting yet.</li>
          <li>
            <code className="font-mono text-xs">repeat</code> binds to the single command that
            follows it, including another <code className="font-mono text-xs">repeat</code>.
          </li>
          <li>Undefined variables, non-numeric operands, and division by zero raise errors.</li>
          <li>Reads are capped in size and time; oversized responses are truncated.</li>
          <li>No database, no accounts, no stored state — the URL is the only source of truth.</li>
        </ul>

        <p className="mt-10 font-mono text-xs text-muted-foreground/70">
          playground: <a className="underline" href="/help">/help</a> · this page is also served at{" "}
          <a className="underline" href="/doc">/doc</a> and <a className="underline" href="/docs">/docs</a>
        </p>
      </div>
    </div>
  );
}
