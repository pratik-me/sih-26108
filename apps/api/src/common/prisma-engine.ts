import * as fs from 'fs';
import * as path from 'path';

export function configurePrismaEngine(): string | null {
  const isLinux = process.platform === 'linux';
  const isWindows = process.platform === 'win32';
  const isDarwin = process.platform === 'darwin';

  // If already set and the file exists, we're all good
  if (
    process.env.PRISMA_QUERY_ENGINE_LIBRARY &&
    fs.existsSync(process.env.PRISMA_QUERY_ENGINE_LIBRARY)
  ) {
    return process.env.PRISMA_QUERY_ENGINE_LIBRARY;
  }

  const binaryNames = isLinux
    ? [
        'libquery_engine-debian-openssl-3.0.x.so.node',
        'libquery_engine-rhel-openssl-3.0.x.so.node',
        'libquery_engine-linux-musl-openssl-3.0.x.so.node',
      ]
    : isWindows
    ? ['query_engine-windows.dll.node']
    : isDarwin
    ? [
        process.arch === 'arm64'
          ? 'libquery_engine-darwin-arm64.dylib.node'
          : 'libquery_engine-darwin.dylib.node',
      ]
    : ['libquery_engine-rhel-openssl-3.0.x.so.node'];

  const candidateDirs = [
    __dirname,
    path.join(__dirname, 'dist'),
    process.cwd(),
    path.join(process.cwd(), 'dist'),
    path.join(process.cwd(), 'apps', 'api'),
    path.join(process.cwd(), 'apps', 'api', 'dist'),
    '/var/task',
    '/var/task/dist',
    '/tmp/prisma-engines',
  ];

  const candidatePaths: string[] = [];
  for (const bName of binaryNames) {
    for (const cDir of candidateDirs) {
      candidatePaths.push(path.join(cDir, bName));
    }
  }

  for (const candidate of candidatePaths) {
    if (fs.existsSync(candidate)) {
      process.env.PRISMA_QUERY_ENGINE_LIBRARY = candidate;
      console.log(`[Prisma Engine] Located query engine at: ${candidate}`);

      // Ensure /tmp/prisma-engines also has a copy (Prisma's built-in fallback search path)
      try {
        const tmpDir = '/tmp/prisma-engines';
        if (!fs.existsSync(tmpDir)) {
          fs.mkdirSync(tmpDir, { recursive: true });
        }
        const engineFile = path.basename(candidate);
        const tmpFile = path.join(tmpDir, engineFile);
        if (!fs.existsSync(tmpFile)) {
          fs.copyFileSync(candidate, tmpFile);
          console.log(`[Prisma Engine] Copied engine to fallback: ${tmpFile}`);
        }
      } catch (err) {
        return null;
      }

      return candidate;
    }
  }

  // Fallback to Search directories recursively
  try {
    const searchRoots = ['/var/task', process.cwd(), __dirname].filter((dir) => {
      try {
        return fs.existsSync(dir);
      } catch {
        return false;
      }
    });

    const findEngine = (dir: string, depth = 0): string | null => {
      if (depth > 3) return null;
      try {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          if (entry.isFile() && binaryNames.includes(entry.name)) {
            return fullPath;
          }
          if (
            entry.isDirectory() &&
            !entry.name.startsWith('.') &&
            entry.name !== 'node_modules'
          ) {
            const found = findEngine(fullPath, depth + 1);
            if (found) return found;
          }
        }
      } catch {
        return null;
      }
      return null;
    };

    for (const root of searchRoots) {
      const found = findEngine(root);
      if (found) {
        process.env.PRISMA_QUERY_ENGINE_LIBRARY = found;
        console.log(`[Prisma Engine] Discovered query engine at: ${found}`);

        try {
          const tmpDir = '/tmp/prisma-engines';
          if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
          const tmpFile = path.join(tmpDir, path.basename(found));
          if (!fs.existsSync(tmpFile)) fs.copyFileSync(found, tmpFile);
        } catch {
          return null;
        }

        return found;
      }
    }
  } catch (err) {
    console.warn('[Prisma Engine] Dynamic search error:', err);
  }

  console.warn(
    `[Prisma Engine] Warning: Could not locate query engine in:`,
    candidatePaths,
  );
  return null;
}
