export type RunResult = { output: string; errors: string };

const PYODIDE_VERSION = 'v0.29.4'; // current stable, verified against CDN + GitHub releases
const CDN = `https://cdn.jsdelivr.net/pyodide/${PYODIDE_VERSION}/full/`;

type Runtime = {
  setStdout: (o: { batched: (s: string) => void }) => void;
  setStderr: (o: { batched: (s: string) => void }) => void;
  runPythonAsync: (src: string) => Promise<unknown>;
};

let runtime: Runtime | null = null;
let loadPromise: Promise<void> | null = null;

declare global {
  // eslint-disable-next-line no-var
  var loadPyodide: ((opts?: { indexURL?: string }) => Promise<Runtime>) | undefined;
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src; s.onload = () => resolve(); s.onerror = () => reject(new Error('failed to load ' + src));
    document.head.appendChild(s);
  });
}

export function loadRuntime(): Promise<void> {
  if (runtime) return Promise.resolve();
  if (loadPromise) return loadPromise;
  loadPromise = (async () => {
    await loadScript(`${CDN}pyodide.js`);
    runtime = await globalThis.loadPyodide!({ indexURL: CDN });
  })();
  return loadPromise;
}

export async function runPython(
  source: string,
  opts: { skipLoad?: boolean; runtime?: Runtime } = {},
): Promise<RunResult> {
  let py = opts.runtime ?? null;
  if (!py) {
    if (!opts.skipLoad) {
      try { await loadRuntime(); }
      catch { return { output: '', errors: 'Failed to load Python runtime — try an online REPL.' }; }
    }
    py = runtime;
  }
  if (!py) return { output: '', errors: 'Python runtime unavailable.' };

  let out = '';
  const sink = { batched: (s: string) => { out += s + '\n'; } };
  py.setStdout(sink);
  py.setStderr(sink);
  try {
    await py.runPythonAsync(source);
    return { output: out, errors: '' };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { output: out, errors: msg };
  }
}
