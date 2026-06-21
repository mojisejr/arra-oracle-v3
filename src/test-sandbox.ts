import fs from 'fs';
import os from 'os';
import path from 'path';

const TEST_SANDBOX_PREFIX = 'arra-oracle-test-';

function ensureDir(dir: string): string {
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

export function setupTestSandbox(): string {
  process.env.ORACLE_TEST_SANDBOX = '1';

  const root = fs.mkdtempSync(path.join(os.tmpdir(), TEST_SANDBOX_PREFIX));
  const dataDir = ensureDir(path.join(root, 'data'));
  const repoRoot = ensureDir(path.join(root, 'repo'));

  process.env.ORACLE_DATA_DIR = dataDir;
  process.env.ORACLE_REPO_ROOT = repoRoot;
  process.env.ORACLE_DB_PATH = path.join(dataDir, 'oracle.db');

  process.on('exit', () => {
    try { fs.rmSync(root, { recursive: true, force: true }); } catch {}
  });

  return root;
}

setupTestSandbox();
