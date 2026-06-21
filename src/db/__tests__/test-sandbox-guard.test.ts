import { describe, expect, test } from 'bun:test';
import path from 'path';
import { createDatabase } from '../index.ts';

const home = process.env.HOME || process.env.USERPROFILE || '/tmp';

describe('createDatabase test sandbox tripwire', () => {
  test('refuses real oracle db path while sandbox is active', () => {
    expect(process.env.ORACLE_TEST_SANDBOX).toBe('1');
    expect(() => createDatabase(path.join(home, '.oracle', 'oracle.db')))
      .toThrow(/Refusing createDatabase outside test sandbox/);
  });
});
