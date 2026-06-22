import { useState } from 'preact/hooks';

function CopyBtn({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button class="tsgo__copy" onClick={() => { navigator.clipboard.writeText(text); setDone(true); setTimeout(() => setDone(false), 1200); }}>
      {done ? 'Copied' : 'Copy'}
    </button>
  );
}

export default function TsGo({ ts, go, tsTitle = 'TypeScript', goTitle = 'Go' }: { ts: string; go: string; tsTitle?: string; goTitle?: string }) {
  return (
    <div class="tsgo">
      <div class="tsgo__col">
        <header>{tsTitle}<CopyBtn text={ts} /></header>
        <pre><code>{ts}</code></pre>
      </div>
      <div class="tsgo__col">
        <header>{goTitle}<CopyBtn text={go} /></header>
        <pre><code>{go}</code></pre>
      </div>
    </div>
  );
}
