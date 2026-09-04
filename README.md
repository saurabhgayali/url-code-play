# URL Code Play

**The URL is the program.**

URL Code is a tiny, playable, API-style programming language where the program lives entirely inside the URL.

There is no editor to install, no account, no database and no saved state.

Write a program into a URL, open it, and the URL executes.

## Links

- **Demo:** https://urlcodeplay.vercel.app/
- **Documentation:** https://urlcodeplay.vercel.app/docs
- **About:** https://urlcodeplay.vercel.app/about
- **GitHub:** https://github.com/saurabhgayali/url-code-play

---

## The idea

A normal program might look like this:

```text
program.js
```

URL Code asks:

> What if the program itself was the URL?

For example:

```text
/r/set/x/10;add/x/20;print/x
```

produces:

```text
30
```

The complete program can be shared simply by sharing its URL.

No project file is required.

---

## A tiny language inside a URL

Commands execute from left to right.

Commands are separated using `;`.

```text
/r/command/argument;command/argument;command/argument
```

For example:

```text
/r/set/x/10;add/x/20;multiply/x/3;print/x
```

produces:

```text
90
```

The URL is simultaneously:

- the source code
- the program
- the shareable link
- the execution request

---

## Piping and composition

The interesting part starts when commands are composed.

For example:

```text
/r/repeat/5/print/Hello;repeat/5/print/World
```

produces:

```text
Hello
Hello
Hello
Hello
Hello
World
World
World
World
World
```

A URL can therefore describe a small sequence of operations:

```text
operation → operation → operation
```

without requiring a traditional code editor.

---

## Commands

| Command | Example | Description |
|---|---|---|
| `print` | `/print/Hello` | Print text or a variable |
| `set` | `/set/x/10` | Assign a number or string |
| `add` | `/add/x/5` | Add to a variable |
| `subtract` | `/subtract/x/5` | Subtract from a variable |
| `multiply` | `/multiply/x/2` | Multiply a variable |
| `divide` | `/divide/x/2` | Divide a variable |
| `repeat` | `/repeat/5/print/Hello` | Execute one command repeatedly |
| `read` | `/read/https:/example.com` | Fetch a public URL as plain text |

---

## Examples

### Hello World

```text
/r/print/Hello%20World
```

### Arithmetic

```text
/r/set/x/10;add/x/20;multiply/x/3;print/x
```

Result:

```text
90
```

### Repeat

```text
/r/repeat/5/print/Hello
```

### Two repeated outputs

```text
/r/repeat/5/print/Hello;repeat/5/print/World
```

### Powers of two

```text
/r/set/x/1;repeat/10/multiply/x/2;print/x
```

Result:

```text
1024
```

### Compound interest

```text
/r/set/balance/1000;repeat/5/multiply/balance/1.05;print/balance
```

### Multiple variables

```text
/r/set/a/1;set/b/100;repeat/3/add/a/2;repeat/3/subtract/b/10;print/a;print/b
```

### Factorial-style calculation

```text
/r/set/f/1;multiply/f/2;multiply/f/3;multiply/f/4;multiply/f/5;print/f
```

Result:

```text
120
```

---

## `/read`

`read` fetches a public URL and returns its content as plain text.

For example:

```text
/r/read/https:/news.ycombinator.com/rss
```

An RSS feed is returned as text rather than being rendered as a webpage.

It can also be followed by additional URL Code commands:

```text
/r/read/https:/news.ycombinator.com/rss;print/--%20end%20of%20feed%20--
```

This makes `read` useful as the beginning of a small URL-native pipeline.

Possible inputs include:

- RSS feeds
- JSON APIs
- XML
- HTML source
- text files
- sitemaps
- `robots.txt`
- other publicly accessible resources

Reads are intended for public content and are subject to the project's domain policy and resource limits.

---

## Why `;`?

The `/` character already has an important job:

```text
/command/argument
```

But URLs also contain `/`.

For example:

```text
https://news.ycombinator.com/rss
```

Using another `/` as an instruction terminator creates ambiguity.

URL Code therefore uses:

```text
;
```

to separate commands.

Example:

```text
/r/read/https:/news.ycombinator.com/rss;print/done
```

Conceptually:

```text
READ https://news.ycombinator.com/rss
        ↓
PRINT done
```

---

## URL encoding

Because the program is transported as a URL, normal URL encoding rules apply.

For example:

```text
Hello World
```

becomes:

```text
Hello%20World
```

A literal slash inside an argument can be encoded as:

```text
%2F
```

For example:

```text
/r/print/a%2Fb
```

prints:

```text
a/b
```

---

## Design principles

URL Code is deliberately small.

### 1. The URL is the source of truth

A program does not need to be stored anywhere else.

### 2. No accounts

There is nothing to sign into.

### 3. No database

Programs are not stored on a server.

### 4. Shareable by default

A URL is already a distribution mechanism.

### 5. Plain-text output

Programs return simple text rather than requiring a traditional application interface.

### 6. Small on purpose

The project explores an idea rather than trying to become a general-purpose programming language.

---

## Interesting possibilities

The current language is intentionally tiny, but the same model could eventually support more expressive pipelines:

```text
input
  ↓
transform
  ↓
filter
  ↓
calculate
  ↓
format
```

all represented by one URL.

For example, `/read` could become the input to increasingly sophisticated processing commands.

The interesting question is not whether URL Code can replace JavaScript.

It can't.

The interesting question is:

> **How much computation can be expressed in a URL before a URL starts looking like a programming language?**

---

## Technical notes

URL Code executes commands left to right.

`repeat` applies to the single command immediately following it.

For example:

```text
/repeat/5/print/Hello
```

runs `print/Hello` five times.

Errors such as undefined variables, invalid numeric operands and division by zero are reported as text.

The `/read` functionality is protected by request limits and a configurable domain policy.

---

## Development

Clone the repository:

```bash
git clone https://github.com/saurabhgayali/url-code-play.git
cd url-code-play
npm install
npm run dev
```

The project is designed to remain small and understandable.

---

## Project

Created by **Saurabh Gayali** as an experiment in URL-native programming.

**GitHub:**  
https://github.com/saurabhgayali/url-code-play

**Live Demo:**  
https://urlcodeplay.vercel.app/

**Documentation:**  
https://urlcodeplay.vercel.app/docs

**About:**  
https://urlcodeplay.vercel.app/about