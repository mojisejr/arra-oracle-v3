import path from 'path';

function isInsideOrEqual(target: string, root: string): boolean {
  const relative = path.relative(path.resolve(root), path.resolve(target));
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}

export function assertSafeTestWritePath(targetPath: string, operation: string): void {
  if (process.env.ORACLE_TEST_SANDBOX !== '1') return;

  const home = process.env.HOME || process.env.USERPROFILE;
  if (!home) return;

  const target = path.resolve(targetPath);
  const forbiddenRoots = [
    path.join(home, '.oracle'),
    path.join(home, '.arra-oracle-v2'),
  ];

  const forbidden = forbiddenRoots.find(root => isInsideOrEqual(target, root));
  if (!forbidden) return;

  throw new Error(
    `[TestSandbox] Refusing ${operation} outside test sandbox: ${target} is under ${path.resolve(forbidden)}`,
  );
}
