import { describe, expect, test } from 'bun:test';
import fs from 'fs';
import os from 'os';
import path from 'path';

const home = process.env.HOME || process.env.USERPROFILE || '/tmp';
const realOracleDir = path.join(home, '.oracle');

const { assertSafeTestWritePath } = await import('../../test-sandbox-guard.ts');
const { generateDefaultConfig, writeVectorConfig } = await import('../config.ts');

describe('test sandbox tripwire', () => {
  test('resolves symlinks before checking forbidden test write paths', () => {
    const previousHome = process.env.HOME;
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'arra-tripwire-symlink-'));
    const realOracle = path.join(tmp, 'real-oracle');
    const fakeHome = path.join(tmp, 'home');
    const symlinkOracle = path.join(fakeHome, '.oracle');

    try {
      fs.mkdirSync(realOracle, { recursive: true });
      fs.mkdirSync(fakeHome, { recursive: true });
      fs.symlinkSync(realOracle, symlinkOracle);
      process.env.HOME = fakeHome;

      expect(() => assertSafeTestWritePath(
        path.join(symlinkOracle, 'nested', 'vector-server.json'),
        'symlink-test',
      )).toThrow(/Refusing symlink-test outside test sandbox/);
    } finally {
      if (previousHome === undefined) delete process.env.HOME;
      else process.env.HOME = previousHome;
      fs.rmSync(tmp, { recursive: true, force: true });
    }
  });

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
