# URL Playground

Build a small web app called "URL Code".

Concept:

The URL itself is the program. A user can write a tiny sequence of commands in the URL path, open/share that URL, and the app parses and executes the commands in the browser.

Example:

/print/Hello%20World

should display:

Hello World

Another example:

/set/x/10/add/x/20/print/x

should display:

30

MVP commands:

- print/<text>

- set/<variable>/<value>

- add/<variable>/<value>

- subtract/<variable>/<value>

- multiply/<variable>/<value>

- divide/<variable>/<value>

- repeat/<number>/<commands>

Create a simple browser playground with:

1. A URL/program input field.

2. A Run button.

3. The generated executable URL shown below it.

4. An output/terminal area.

5. A small command reference.

6. Copy URL button.

7. When the app itself is opened with a valid program encoded in the URL path, automatically execute it.

The URL should be the source of truth. Do not use a database or user accounts.

Use client-side JavaScript/TypeScript only.

Design:

- Minimal developer-tool aesthetic.

- Dark terminal-style output area.

- Clean responsive layout.

- Make the concept immediately understandable.

- Include a few example programs users can click to load.

Important:

Keep this as a small experimental project. Do not add authentication, database, payments, AI, backend services, dashboards, or unnecessary frameworks/features.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://url-code-play.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/22ecbcaa-1099-4852-81d2-53d67239bd70).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
