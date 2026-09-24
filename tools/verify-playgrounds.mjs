// Verify every EN <Playground code={...}> snippet runs on CPython 3.14 and
// prints without error.
// Usage: node tools/verify-playgrounds.mjs [pathFilter]
// The site runs snippets on Pyodide (CPython 3.14.2 via pyodide@314.0.6);
// locally we use python3.14. Compare stdout against the `#`/`//` output
// comments in the lesson by eye.
//
// Unlike a course that names every runnable literal `xxxCode`, this course's
// literal names vary per lesson (`playgroundDecorators`, `dataclassCode`,
// `mypyDemo`, ...). So instead of matching by name pattern, we read the
// variable name straight out of each `<Playground code={name} />` usage and
// look up its `export const name = \`...\`;` literal.
import { readFileSync, mkdirSync, writeFileSync, globSync } from 'node:fs';
import { execSync } from 'node:child_process';

const PYTHON = process.env.PYTHON ?? 'python3.14';
const filter = process.argv[2] ?? '';
const files = globSync('src/content/docs/en/**/*.mdx').filter((f) => f.includes(filter));

function parseStringAt(text, i) {
  const quote = text[i];
  let j = i + 1;
  let out = '';
  while (j < text.length) {
    const c = text[j];
    if (c === '\\') { out += c + (text[j + 1] ?? ''); j += 2; continue; }
    if (c === quote) { j++; break; }
    out += c; j++;
  }
  return { value: out, end: j };
}

function findNamedLiteral(src, name) {
  const re = new RegExp(`export const ${name}\\s*=\\s*\``);
  const m = re.exec(src);
  if (!m) return null;
  const start = m.index + m[0].length - 1;
  return parseStringAt(src, start).value;
}

let fail = 0;
let n = 0;
for (const f of files.sort()) {
  const src = readFileSync(f, 'utf8');
  const names = [...src.matchAll(/<Playground\s+code=\{(\w+)\}/g)].map((m) => m[1]);
  for (const name of new Set(names)) {
    const raw = findNamedLiteral(src, name);
    if (raw == null) {
      // Aliased to another export (e.g. `export const x = y;`) — not a template literal, skip.
      continue;
    }
    n++;
    let code = Function('return `' + raw + '`')().trim() + '\n';
    // Pyodide's runPythonAsync executes every snippet as a coroutine, so
    // lessons demonstrating asyncio intentionally use top-level `await`.
    // Plain `python3.14 script.py` doesn't support that outside a REPL, so
    // wrap the snippet in `async def _main(): ...; asyncio.run(_main())`
    // for a fair local check — this mirrors what Pyodide does under the hood.
    if (/^\s*(await |[\w, ]+ = await )/m.test(code) && /^await |[^.\w]await /.test(code)) {
      const indented = code.split('\n').map((l) => (l ? '    ' + l : l)).join('\n');
      code = `import asyncio\n\nasync def _main():\n${indented}\nasyncio.run(_main())\n`;
    }
    const dir = `.verify/${f.replace(/[\/.]/g, '_')}_${name}`;
    mkdirSync(dir, { recursive: true });
    writeFileSync(`${dir}/main.py`, code);
    try {
      // -X dev surfaces ResourceWarnings and "coroutine was never awaited".
      const out = execSync(`cd ${dir} && ${PYTHON} -X dev -W error::RuntimeWarning main.py`, {
        stdio: 'pipe',
        timeout: 30000,
      });
      console.log(`OK   ${f} ${name}\n--- stdout ---\n${out.toString()}--------------`);
    } catch (e) {
      fail++;
      console.log(`FAIL ${f} ${name}\n${String(e.stderr).slice(0, 600)}`);
    }
  }
}
console.log(`${n} playgrounds, ${fail} failed`);
process.exit(fail ? 1 : 0);
