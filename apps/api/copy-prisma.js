const fs = require('fs');
const path = require('path');

try {
  const possiblePrismaDirs = [
    (() => {
      try {
        const pkg = require.resolve('@prisma/client/package.json');
        return path.resolve(path.dirname(pkg), '../../.prisma/client');
      } catch (e) {
        return null;
      }
    })(),
    (() => {
      try {
        const pkg = require.resolve('@prisma/client/package.json');
        return path.resolve(path.dirname(pkg), '../.prisma/client');
      } catch (e) {
        return null;
      }
    })(),
    path.join(__dirname, 'node_modules/.prisma/client'),
    path.join(__dirname, '../../node_modules/.prisma/client'),
  ].filter(Boolean);

  let foundEngines = [];
  for (const dir of possiblePrismaDirs) {
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir);
      const engines = files.filter(f => f.endsWith('.node'));
      if (engines.length > 0) {
        console.log(`[copy-prisma] Found engines in: ${dir}`);
        engines.forEach(engine => {
          foundEngines.push({ name: engine, src: path.join(dir, engine) });
        });
        break;
      }
    }
  }

  const targetDirs = [
    path.join(__dirname, 'dist'),
    __dirname,
  ];

  targetDirs.forEach(td => {
    if (!fs.existsSync(td)) {
      fs.mkdirSync(td, { recursive: true });
    }
  });

  if (foundEngines.length > 0) {
    foundEngines.forEach(({ name, src }) => {
      targetDirs.forEach(targetDir => {
        const dest = path.join(targetDir, name);
        fs.copyFileSync(src, dest);
        console.log(`[copy-prisma] Copied ${name} -> ${dest}`);
      });
    });
  } else {
    console.warn("[copy-prisma] Could not find any Prisma engine .node files in candidate directories:", possiblePrismaDirs);
  }
} catch (err) {
  console.error("[copy-prisma] Failed to copy Prisma engine:", err);
}
