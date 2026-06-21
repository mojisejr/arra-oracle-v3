import { describe, expect, test } from 'bun:test';
import path from 'path';
import { LanceDBAdapter } from '../adapters/lancedb.ts';
import type { EmbeddingProvider } from '../types.ts';

const home = process.env.HOME || process.env.USERPROFILE || '/tmp';
const embedder: EmbeddingProvider = {
  dimensions: 3,
  async embed() { return [[0, 0, 0]]; },
};

describe('LanceDBAdapter test sandbox tripwire', () => {
  test('refuses real oracle LanceDB path while sandbox is active', async () => {
    const adapter = new LanceDBAdapter('test', path.join(home, '.oracle', 'lancedb'), embedder);
    expect(process.env.ORACLE_TEST_SANDBOX).toBe('1');
    await expect(adapter.connect()).rejects.toThrow(/Refusing LanceDBAdapter\.connect outside test sandbox/);
  });
});
