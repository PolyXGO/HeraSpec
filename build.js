import { build } from 'esbuild';
import { readFileSync, writeFileSync, chmodSync, cpSync, existsSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const packageJson = JSON.parse(readFileSync(join(__dirname, 'package.json'), 'utf-8'));

build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  platform: 'node',
  target: 'node20',
  format: 'esm',
  outfile: 'dist/index.js',
  external: Object.keys(packageJson.dependencies || {}).concat(
    Object.keys(packageJson.peerDependencies || {})
  ),
  banner: {
    js: `import { createRequire } from 'module'; const require = createRequire(import.meta.url);`,
  },
  sourcemap: true,
  minify: false,
}).catch(() => process.exit(1));

// Build CLI entry point
build({
  entryPoints: ['src/cli/index.ts'],
  bundle: true,
  platform: 'node',
  target: 'node20',
  format: 'esm',
  outfile: 'bin/heraspec.js',
  external: Object.keys(packageJson.dependencies || {}).concat(
    Object.keys(packageJson.peerDependencies || {})
  ),
  // No banner needed - source code already handles createRequire
  sourcemap: true,
  minify: false,
}).then(() => {
  // Add shebang after build - must be first line with newline
  const filePath = join(__dirname, 'bin', 'heraspec.js');
  let content = readFileSync(filePath, 'utf-8');

  // Remove any existing shebangs (handle duplicates)
  const shebangRegex = /^#!\/usr\/bin\/env node\n?/gm;
  content = content.replace(shebangRegex, '');

  // Remove leading newlines
  content = content.replace(/^\n+/, '');

  // Add shebang at the very beginning
  writeFileSync(filePath, '#!/usr/bin/env node\n' + content, 'utf-8');

  // Make file executable (chmod +x)
  chmodSync(filePath, 0o755);
}).then(() => {
  // Copy templates directory to dist for skill add command
  const srcTemplatesDir = join(__dirname, 'src', 'core', 'templates', 'skills');
  const distTemplatesDir = join(__dirname, 'dist', 'core', 'templates', 'skills');
  
  if (existsSync(srcTemplatesDir)) {
    // Ensure dist directory exists
    mkdirSync(join(__dirname, 'dist', 'core', 'templates'), { recursive: true });
    
    // Copy templates directory
    cpSync(srcTemplatesDir, distTemplatesDir, { recursive: true });
    console.log('✓ Templates copied to dist');
  }
}).catch(() => process.exit(1));
