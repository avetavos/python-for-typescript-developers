import { useState } from 'preact/hooks';
import { runGo } from './go-runner';

export default function Playground({ code }: { code: string }) {
  const [out, setOut] = useState<string | null>(null);
  const [err, setErr] = useState<string>('');
  const [loading, setLoading] = useState(false);

  async function run() {
    setLoading(true); setErr(''); setOut(null);
    try {
      const data = await runGo(code);
      setErr(data.errors || ''); setOut(data.output ?? '');
    } catch {
      setErr('Run failed — try "Open in Go Playground".');
    } finally { setLoading(false); }
  }

  return (
    <div class="pg">
      <div class="pg__bar">
        <button class="pg__run" onClick={run} disabled={loading}>{loading ? 'Running…' : 'Run ▸'}</button>
        <a class="pg__run" href="https://go.dev/play/" target="_blank" rel="noopener" onClick={() => navigator.clipboard.writeText(code)}>Open in Playground</a>
      </div>
      <pre><code>{code}</code></pre>
      {loading && <p class="pg__hint">Loading Go runtime (first run only, ~8 MB)…</p>}
      {err && <pre class="pg__err"><code>{err}</code></pre>}
      {out !== null && <pre class="pg__out"><code>{out || '(no output)'}</code></pre>}
    </div>
  );
}
