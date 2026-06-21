import { describe, expect, test } from 'bun:test';
import path from 'path';
import { getPubkeyHex, resetPubkeyCache } from '../identity-key.ts';
import { pinPeerPubkey } from '../peer-tofu.ts';

const home = process.env.HOME || process.env.USERPROFILE || '/tmp';
const pubkey = 'a'.repeat(64);

describe('peer write test sandbox tripwire', () => {
  test('getPubkeyHex refuses real oracle key path while sandbox is active', () => {
    resetPubkeyCache();
    expect(process.env.ORACLE_TEST_SANDBOX).toBe('1');
    expect(() => getPubkeyHex(path.join(home, '.oracle', 'peer-key.hex')))
      .toThrow(/Refusing getPubkeyHex outside test sandbox/);
  });

  test('writePins refuses real oracle TOFU path while sandbox is active', () => {
    expect(process.env.ORACLE_TEST_SANDBOX).toBe('1');
    expect(() => pinPeerPubkey('peer-a', pubkey, path.join(home, '.oracle', 'peers-tofu.json')))
      .toThrow(/Refusing writePins outside test sandbox/);
  });
});
