import fs from 'fs';
import path from 'path';

function isInsideOrEqual(target: string, root: string): boolean {
  const relative = path.relative(root, target);
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}

function realpathWithMissingTail(inputPath: string): string {
  const resolved = path.resolve(inputPath);
  const parsed = path.parse(resolved);
  const missing: string[] = [];
  let current = resolved;

  while (!fs.existsSync(current) && current !== parsed.root) {
    missing.unshift(path.basename(current));
    current = path.dirname(current);
  }

  const realBase = fs.existsSync(current) ? fs.realpathSync(current) : current;
  return path.join(realBase, ...missing);
}

export function assertSafeTestWritePath(targetPath: string, operation: string): void {
  if (process.env.ORACLE_TEST_SANDBOX !== '1') return;

  const home = process.env.HOME || process.env.USERPROFILE;
  if (!home) return;

  const target = realpathWithMissingTail(targetPath);
  const forbiddenRoots = [
    path.join(home, '.oracle'),
    path.join(home, '.arra-oracle-v2'),
  ].map(realpathWithMissingTail);

  const forbidden = forbiddenRoots.find(root => isInsideOrEqual(target, root));
  if (!forbidden) return;

  throw new Error(
    `[TestSandbox] Refusing ${operation} outside test sandbox: ${target} is under ${forbidden}`,
  );
}
