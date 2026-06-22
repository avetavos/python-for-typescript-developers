export type RunResult = { output: string; errors: string };
type Runner = (source: string) => RunResult;

let loadPromise: Promise<void> | null = null;

declare global {
  // eslint-disable-next-line no-var
  var goRunWasm: Runner | undefined;
  // eslint-disable-next-line no-var
  var Go: { new (): { importObject: WebAssembly.Imports; run(i: WebAssembly.Instance): void } } | undefined;
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src; s.onload = () => resolve(); s.onerror = () => reject(new Error('failed to load ' + src));
    document.head.appendChild(s);
  });
}

export function loadRuntime(): Promise<void> {
  if (typeof globalThis.goRunWasm === 'function') return Promise.resolve();
  if (loadPromise) return loadPromise;
  loadPromise = (async () => {
    // Respect the configured base path (e.g. GitHub Pages project subpath).
    // Normalize to exactly one trailing slash — BASE_URL may or may not include one.
    const base = import.meta.env.BASE_URL.replace(/\/?$/, '/');
    await loadScript(`${base}wasm_exec.js`);
    const go = new globalThis.Go!();
    let instance: WebAssembly.Instance;
    try {
      const result = await WebAssembly.instantiateStreaming(fetch(`${base}go-runner.wasm`), go.importObject);
      instance = result.instance;
    } catch {
      // fallback for hosts that don't serve application/wasm
      const bytes = await (await fetch(`${base}go-runner.wasm`)).arrayBuffer();
      const result = await WebAssembly.instantiate(bytes, go.importObject);
      instance = result.instance;
    }
    go.run(instance); // sets globalThis.goRunWasm, then blocks on select{}
  })();
  return loadPromise;
}

export async function runGo(source: string, opts: { skipLoad?: boolean } = {}): Promise<RunResult> {
  if (!opts.skipLoad) {
    try { await loadRuntime(); }
    catch { return { output: '', errors: 'Failed to load Go runtime — try "Open in Go Playground".' }; }
  }
  const fn = globalThis.goRunWasm;
  if (typeof fn !== 'function') return { output: '', errors: 'Go runtime unavailable.' };
  return fn(source);
}
