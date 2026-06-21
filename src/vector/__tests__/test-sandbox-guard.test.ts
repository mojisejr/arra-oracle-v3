import { describe, expect, test } from 'bun:test';
import path from 'path';

const home = process.env.HOME || process.env.USERPROFILE || '/tmp';
const realOracleDir = path.join(home, '.oracle');

const { assertSafeTestWritePath } = await import('../../test-sandbox-guard.ts');
const { generateDefaultConfig, writeVectorConfig } = await import('../config.ts');

describe('test sandbox tripwire', () => {
  test('writeVectorConfig refuses real oracle data dir while sandbox is active', () => {
    expect(process.env.ORACLE_TEST_SANDBOX).toBe('1');
    expect(() => writeVectorConfig(
      generateDefaultConfig(),
      path.join(realOracleDir, 'vector-server.json'),
    )).toThrow(/Refusing writeVectorConfig outside test sandbox/);
  });

  test('tripwire is disabled outside test sandbox mode', () => {
    const previous = process.env.ORACLE_TEST_SANDBOX;
    delete process.env.ORACLE_TEST_SANDBOX;
    try {
      expect(() => assertSafeTestWritePath(path.join(realOracleDir, 'vector-server.json'), 'unit-test')).not.toThrow();
    } finally {
      if (previous === undefined) delete process.env.ORACLE_TEST_SANDBOX;
      else process.env.ORACLE_TEST_SANDBOX = previous;
    }
  });
});
