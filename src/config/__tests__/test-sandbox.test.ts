import { describe, expect, test } from 'bun:test';
import os from 'os';
import path from 'path';

describe('test sandbox preload', () => {
  test('freezes config paths to preload temp directories', async () => {
    const { DB_PATH, ORACLE_DATA_DIR, REPO_ROOT } = await import('../../config.ts');

    expect(process.env.ORACLE_TEST_SANDBOX).toBe('1');
    expect(ORACLE_DATA_DIR).toBe(process.env.ORACLE_DATA_DIR);
    expect(DB_PATH).toBe(process.env.ORACLE_DB_PATH);
    expect(REPO_ROOT).toBe(process.env.ORACLE_REPO_ROOT);
    expect(ORACLE_DATA_DIR.startsWith(path.join(os.tmpdir(), 'arra-oracle-test-'))).toBe(true);
    expect(ORACLE_DATA_DIR).not.toBe(path.join(process.env.HOME || '', '.oracle'));
    expect(ORACLE_DATA_DIR).not.toBe(path.join(process.env.HOME || '', '.arra-oracle-v2'));
  });
});
