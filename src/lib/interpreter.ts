export interface OutputLine {
  type: "out" | "err" | "info";
  text: string;
}

type Command =
  | { op: "print"; text: string }
  | { op: "set"; name: string; value: string }
  | { op: "add" | "subtract" | "multiply" | "divide"; name: string; value: string }
  | { op: "repeat"; count: number; body: Command };

const ARITY: Record<string, number> = {
  print: 1,
  set: 2,
  add: 2,
  subtract: 2,
  multiply: 2,
  divide: 2,
};

export function tokenize(input: string): string[] {
  // Accepts "/set/x/10/add/x/20", "set/x/10", or a full URL.
  let path = input.trim();
  try {
    if (/^https?:\/\//i.test(path)) path = new URL(path).pathname;
  } catch {
    /* fall through */
  }
  return path
    .split("/")
    .filter((s) => s.length > 0)
    .map((s) => {
      try {
        return decodeURIComponent(s);
      } catch {
        return s;
      }
    });
}

function parseOne(tokens: string[], i: number): { cmd: Command; next: number } {
  const op = tokens[i];
  if (op === "repeat") {
    const count = Number(tokens[i + 1]);
    if (!Number.isFinite(count) || count < 0) {
      throw new Error(`repeat: invalid count "${tokens[i + 1]}"`);
    }
    const inner = parseOne(tokens, i + 2);
    return { cmd: { op: "repeat", count: Math.floor(count), body: inner.cmd }, next: inner.next };
  }
  const arity = ARITY[op];
  if (arity === undefined) throw new Error(`unknown command "${op}"`);
  const args = tokens.slice(i + 1, i + 1 + arity);
  if (args.length < arity) throw new Error(`${op}: expected ${arity} argument(s)`);
  if (op === "print") return { cmd: { op, text: args[0] }, next: i + 2 };
  if (op === "set") return { cmd: { op, name: args[0], value: args[1] }, next: i + 3 };
  return { cmd: { op, name: args[0], value: args[1] }, next: i + 3 };
}

export function runProgram(input: string, maxSteps = 10000): OutputLine[] {
  const out: OutputLine[] = [];
  const tokens = tokenize(input);
  if (tokens.length === 0) {
    out.push({ type: "err", text: "empty program" });
    return out;
  }

  const commands: Command[] = [];
  try {
    let i = 0;
    while (i < tokens.length) {
      const { cmd, next } = parseOne(tokens, i);
      commands.push(cmd);
      i = next;
    }
  } catch (e) {
    out.push({ type: "err", text: `parse error: ${(e as Error).message}` });
    return out;
  }

  const vars = new Map<string, number | string>();
  let steps = 0;

  const num = (raw: string): number => {
    const n = Number(raw);
    if (!Number.isFinite(n)) throw new Error(`"${raw}" is not a number`);
    return n;
  };
  const getNum = (name: string): number => {
    if (!vars.has(name)) throw new Error(`undefined variable "${name}"`);
    return num(String(vars.get(name)));
  };

  const exec = (cmd: Command) => {
    if (++steps > maxSteps) throw new Error("step limit exceeded");
    switch (cmd.op) {
      case "print": {
        const value = vars.has(cmd.text) ? vars.get(cmd.text) : cmd.text;
        out.push({ type: "out", text: String(value) });
        break;
      }
      case "set": {
        const n = Number(cmd.value);
        vars.set(cmd.name, Number.isFinite(n) ? n : cmd.value);
        out.push({ type: "info", text: `${cmd.name} = ${cmd.value}` });
        break;
      }
      case "add":
      case "subtract":
      case "multiply":
      case "divide": {
        const current = getNum(cmd.name);
        const operand = num(cmd.value);
        let result: number;
        if (cmd.op === "add") result = current + operand;
        else if (cmd.op === "subtract") result = current - operand;
        else if (cmd.op === "multiply") result = current * operand;
        else {
          if (operand === 0) throw new Error(`divide: division by zero (${cmd.name} / 0)`);
          result = current / operand;
        }
        vars.set(cmd.name, result);
        out.push({ type: "info", text: `${cmd.name} = ${result}` });
        break;
      }
      case "repeat": {
        for (let k = 0; k < cmd.count; k++) exec(cmd.body);
        break;
      }
    }
  };

  for (const cmd of commands) {
    try {
      exec(cmd);
    } catch (e) {
      out.push({ type: "err", text: `error: ${(e as Error).message}` });
      break;
    }
  }

  return out;
}

export const EXAMPLES: { label: string; path: string }[] = [
  { label: "Hello World", path: "/print/Hello%20World" },
  { label: "Add to a variable", path: "/set/x/10/add/x/20/print/x" },
  { label: "Multiply", path: "/set/n/6/multiply/n/7/print/n" },
  { label: "Repeat print", path: "/repeat/3/print/ha" },
  { label: "Repeat math", path: "/set/i/2/repeat/4/multiply/i/3/print/i" },
];
