import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About URL Code — a shareable, URL-native mini language" },
      {
        name: "description",
        content:
          "URL Code by Saurabh Gayali turns the URL path into an executable program: print, variables, arithmetic, repeat, and /read as a plain-text, CORS-free fetcher with domain policy controls.",
      },
      { property: "og:title", content: "About URL Code — a shareable, URL-native mini language" },
      {
        property: "og:description",
        content:
          "Why URL Code exists, how /read bypasses browser CORS limits, and how the whitelist/blacklist domain policy works.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AboutPage,
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <h2 className="mb-3 font-mono text-xs uppercase tracking-wider text-muted-foreground">
        {title}
      </h2>
      <div className="space-y-3 text-sm leading-relaxed text-foreground/90">{children}</div>
    </section>
  );
}

function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-10">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">About URL Code</h1>
          <p className="text-sm text-muted-foreground">
            A tiny, playable, API-style language where the URL <em>is</em> the program — nothing to
            install, nothing to sign up for, just a link you can share.
          </p>
          <nav className="flex flex-wrap gap-3 pt-1 font-mono text-xs text-muted-foreground">
            <Link to="/help" className="hover:text-foreground">
              /help
            </Link>
            <Link to="/docs" className="hover:text-foreground">
              /docs
            </Link>
          </nav>
        </header>

        <Section title="author">
          <p>
            <strong>Saurabh Gayali</strong> — built URL Code as an experiment in radically small
            interfaces: no accounts, no database, no client-side state. Every program is fully
            described by its own address bar.
          </p>
        </Section>

        <Section title="purpose">
          <p>
            Most toy languages need an editor, a runtime, and a place to store snippets. URL Code
            removes all three. A program like{" "}
            <code className="font-mono text-chart-2">/set/x/10/add/x/20/print/x</code> is a complete,
            runnable, shareable artefact — paste it into chat, a ticket, or a README and the reader
            simply clicks it.
          </p>
          <p>
            Because every program URL answers with <code className="font-mono">text/plain</code> and
            no markup, scripts, or styling, URL Code doubles as a playable, API-style endpoint. It
            works equally well in a browser tab, in <code className="font-mono">curl</code>, in a
            shell pipeline, or as a quick data source for another tool. That makes it handy for
            teaching evaluation order, demoing URL encoding, sketching quick calculations, wiring
            throwaway health checks, or embedding a deterministic text response in a workflow.
          </p>
        </Section>

        <Section title="/read — a plain-text fetcher and CORS bypasser">
          <p>
            <code className="font-mono text-chart-2">/read/&lt;url&gt;</code> fetches a target URL{" "}
            <em>on the server</em> and returns its raw bytes as plain text. Nothing is rendered:
            HTML arrives as source, an RSS feed arrives as XML, a JSON API arrives as JSON — like
            opening the file in Notepad.
          </p>
          <p>
            Because the fetch happens server-side, the browser&apos;s same-origin policy never
            applies. Ordinary front-end JavaScript is blocked from reading a cross-origin response
            unless that server sends permissive{" "}
            <code className="font-mono">Access-Control-Allow-Origin</code> headers. Routing the
            request through <code className="font-mono">/read</code> sidesteps that entirely, so it
            acts as a lightweight CORS bypass proxy for public resources: feeds, sitemaps,{" "}
            <code className="font-mono">robots.txt</code>, open JSON endpoints, plain-text files.
          </p>
          <p>
            Reads are guarded: a 15-second timeout, a 512&nbsp;KB response cap with a truncation
            notice, and a semicolon terminator so a read can be piped —{" "}
            <code className="font-mono text-chart-2">/read/example.com;/print/done</code> fetches
            the page, then continues executing the program after it. Write the target without{" "}
            <code className="font-mono">https://</code> — the scheme is added automatically.
          </p>
          <p className="text-muted-foreground">
            It is a convenience for public content only — it sends no credentials, cookies, or
            authorization headers, and should not be used to reach private or rate-limited APIs.
          </p>
        </Section>

        <Section title="domain policy — whitelist &amp; blacklist">
          <p>
            An open fetcher needs a boundary, so <code className="font-mono">/read</code> is
            governed by a single configuration file,{" "}
            <code className="font-mono text-chart-2">blacklist.json</code>, in the project root. It
            holds exactly two keys:
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <code className="font-mono text-chart-2">whitelist</code> — an allow-list of top-level
              domains. Empty by default.
            </li>
            <li>
              <code className="font-mono text-chart-2">blacklist</code> — a deny-list of top-level
              domains, pre-populated with adult-content sites.
            </li>
          </ul>
          <p>The rules are deliberately simple and evaluated in this order:</p>
          <ol className="list-decimal space-y-2 pl-5">
            <li>
              <strong>Whitelist wins.</strong> If <code className="font-mono">whitelist</code> is
              non-empty it becomes the only source of truth: exclusively those domains may be read,
              and every other domain is refused — regardless of whether the blacklist is empty,
              short, or long. This turns an open instance into a locked-down one with a single edit.
            </li>
            <li>
              <strong>Otherwise, the blacklist applies.</strong> With an empty whitelist, any domain
              may be read except those on the deny-list.
            </li>
          </ol>
          <p>
            Matching is by registrable domain and covers subdomains, so one entry blocks{" "}
            <code className="font-mono">sub.example.com</code> as well as{" "}
            <code className="font-mono">example.com</code>, and a leading{" "}
            <code className="font-mono">www.</code> is ignored. Scheme and path are irrelevant —
            only the host is judged.
          </p>
          <p>
            When a request is refused, the response body is simply{" "}
            <code className="font-mono text-destructive">blacklisted</code> with an HTTP 403 status.
            The same wording is used for both a deny-list hit and a whitelist miss, so the policy
            never leaks which domains are configured.
          </p>
          <p className="text-muted-foreground">
            Anyone self-hosting can edit <code className="font-mono">blacklist.json</code> and
            redeploy: add domains to tighten, populate the whitelist to run a private, single-source
            reader, or empty both lists to run fully open.
          </p>
        </Section>

        <Section title="principles">
          <ul className="list-disc space-y-2 pl-5">
            <li>The URL is the source of truth — no database, no accounts, no cookies.</li>
            <li>Program responses are plain text: no HTML, no CSS, no client JavaScript.</li>
            <li>Execution is left to right, and every error is reported inline as text.</li>
            <li>Small on purpose — it should stay readable in one sitting.</li>
          </ul>
        </Section>

        <footer className="pb-6 text-center font-mono text-xs text-muted-foreground/60">
          URL Code · by Saurabh Gayali
        </footer>
      </div>
    </div>
  );
}
