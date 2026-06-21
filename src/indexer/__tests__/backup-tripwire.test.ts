import { describe, expect, test } from 'bun:test';
import path from 'path';
import { backupDatabase } from '../backup.ts';
import type { IndexerConfig } from '../../types.ts';

const home = process.env.HOME || process.env.USERPROFILE || '/tmp';

describe('backupDatabase test sandbox tripwire', () => {
  test('refuses real oracle db path while sandbox is active', () => {
    const config = {
      dbPath: path.join(home, '.oracle', 'oracle.db'),
    } as IndexerConfig;

    expect(process.env.ORACLE_TEST_SANDBOX).toBe('1');
    expect(() => backupDatabase({} as never, config)).toThrow(/Refusing backupDatabase outside test sandbox/);
  });
});
