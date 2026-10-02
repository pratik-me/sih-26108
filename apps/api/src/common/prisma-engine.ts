import * as fs from 'fs';
import * as path from 'path';

/**
 * Ensures the Prisma query engine binary is located and made available
 * to Prisma Client on serverless runtimes like Vercel (AWS Lambda).
 */
export function configurePrismaEngine(): string | null {
  const isLinux = process.platform === 'linux';
  const isWindows = process.platform === 'win32';
  const isDarwin = process.platform === 'darwin';

  const binaryName = isLinux
    ? 'libquery_engine-rhel-openssl-3.0.x.so.node'
    : isWindows
    ? 'query_engine-windows.dll.node'
    : isDarwin
    ? (process.arch === 'arm64' ? 'libquery_engine-darwin-arm64.dylib.node' : 'libquery_engine-darwin.dylib.node')
    : 'libquery_engine-rhel-openssl-3.0.x.so.node';

  // If already set and the file exists, we're all good
  if (
    process.env.PRISMA_QUERY_ENGINE_LIBRARY &&
    fs.existsSync(process.env.PRISMA_QUERY_ENGINE_LIBRARY)
  ) {
    return process.env.PRISMA_QUERY_ENGINE_LIBRARY;
  }

  // 1. Static reference for @vercel/nft to trace and bundle the binary
  const bundledLinuxEngine = path.join(__dirname, 'libquery_engine-rhel-openssl-3.0.x.so.node');

  // 2. Candidate locations where Vercel / Lambda might place the binary
  const candidatePaths = [
    path.join(__dirname, binaryName),
    path.join(__dirname, 'dist', binaryName),
    path.join(process.cwd(), binaryName),
    path.join(process.cwd(), 'dist', binaryName),
    path.join(process.cwd(), 'apps', 'api', binaryName),
    path.join(process.cwd(), 'apps', 'api', 'dist', binaryName),
    path.join('/var/task', binaryName),
    path.join('/var/task', 'dist', binaryName),
    path.join('/tmp/prisma-engines', binaryName),
  ];

  if (isLinux) {
    candidatePaths.unshift(bundledLinuxEngine);
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
        const tmpFile = path.join(tmpDir, binaryName);
        if (!fs.existsSync(tmpFile)) {
          fs.copyFileSync(candidate, tmpFile);
          console.log(`[Prisma Engine] Copied engine to fallback: ${tmpFile}`);
        }
      } catch (err) {
        // Non-fatal if /tmp write fails
      }

      return candidate;
    }
  }

  // 3. Fallback: Search directories recursively
  try {
    const searchRoots = ['/var/task', process.cwd(), __dirname].filter(dir => {
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
          if (entry.isFile() && entry.name === binaryName) {
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
          const tmpFile = path.join(tmpDir, binaryName);
          if (!fs.existsSync(tmpFile)) fs.copyFileSync(found, tmpFile);
        } catch {}

        return found;
      }
    }
  } catch (err) {
    console.warn('[Prisma Engine] Dynamic search error:', err);
  }

  console.warn(
    `[Prisma Engine] Warning: Could not locate ${binaryName} in:`,
    candidatePaths,
  );
  return null;
}
