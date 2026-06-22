import { describe, it, expect } from 'vitest';
import { runPython } from '../src/components/py-runner';

function fakeRuntime(run: (src: string, emit: (s: string) => void) => void | Promise<void>) {
  let emit: (s: string) => void = () => {};
  return {
    setStdout: ({ batched }: { batched: (s: string) => void }) => { emit = batched; },
    setStderr: (_: { batched: (s: string) => void }) => {},
    runPythonAsync: async (src: string) => { await run(src, emit); },
  };
}

describe('py-runner', () => {
  it('runs code via the provided runtime and captures stdout', async () => {
    const rt = fakeRuntime((src, emit) => { emit('ran:' + src); });
    const res = await runPython('X', { runtime: rt });
    expect(res.output).toBe('ran:X\n');
    expect(res.errors).toBe('');
  });
  it('reports a clear error when the runtime is missing', async () => {
    const res = await runPython('X', { skipLoad: true });
    expect(res.errors).toMatch(/runtime/i);
  });
  it('captures python errors as the error string', async () => {
    const rt = fakeRuntime(() => { throw new Error('Traceback...\nNameError: boom'); });
    const res = await runPython('bad', { runtime: rt });
    expect(res.errors).toMatch(/boom/);
  });
});
