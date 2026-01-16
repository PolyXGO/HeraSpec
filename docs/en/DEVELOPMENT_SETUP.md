# Development Setup

Guide on how to use HeraSpec in development environment (before publishing to npm).

## Important: How HeraSpec Works

**HeraSpec is a global CLI tool**, not a dependency in your project:

- ✅ Install **once** on your machine (global)
- ✅ Use in **all projects** without copying code
- ✅ No need to copy HeraSpec directory into projects
- ✅ Just run `heraspec init` in each project to create the `heraspec/` structure

## Scenario 1: HeraSpec Has Been Published to npm

(If already published to npm registry)

```bash
# Install globally from npm
npm install -g heraspec

# Verify
heraspec --version

# Use in any project
cd my-project
heraspec init
```

## Scenario 2: Development Mode (Not Yet Published)

(Current state - since HeraSpec hasn't been published to npm yet)

### Step 1: Install Dependencies and Build

In the HeraSpec directory:

```bash
cd /Applications/Data/Projects/HeadRandomSpec/HeraSpec

# Install dependencies (including esbuild for build process)
npm install

# Build source code
npm run build
```

**Important notes about Build:**

- HeraSpec uses `esbuild` to compile TypeScript
- `esbuild` has been added to `devDependencies` in package.json
- The `prepare` script has been removed to avoid errors during `npm install` (because build needs dependencies to be installed first)

After building, files will be created in:
- `dist/` - Compiled JavaScript
- `bin/heraspec.js` - CLI entry point

### Step 2: Link Local Package

There are 2 ways:

#### Option A: npm link (Recommended)

```bash
cd /Applications/Data/Projects/HeadRandomSpec/HeraSpec

# Create global symlink
npm link

# Verify
heraspec --version

# Now you can use heraspec anywhere
cd ~/my-project
heraspec init
```

**Note**: `npm link` creates a symlink, so any code changes will take effect immediately (after rebuilding).

#### Option B: Install Directly From Local Directory

```bash
# Install globally from local directory
npm install -g /Applications/Data/Projects/HeadRandomSpec/HeraSpec

# Verify
heraspec --version
```

**Note**: With this method, you need to reinstall whenever code changes.

### Step 3: Use In Projects

Now you can use HeraSpec in any project:

```bash
# Move to your project
cd ~/my-wordpress-plugin

# Initialize HeraSpec (creates heraspec/ directory in project)
heraspec init

# Use other commands
heraspec list
heraspec show change-name
```

## Build Process

### Overview

HeraSpec uses **esbuild** to compile TypeScript to JavaScript. The build process creates:

- `dist/index.js` - Main export (for programmatic usage)
- `bin/heraspec.js` - CLI entry point (executable)

### Required Dependencies

Ensure these packages are in `devDependencies`:
- `esbuild` - Build tool
- `typescript` - TypeScript compiler (for type checking)
- `@types/node` - Node.js type definitions

### Build Commands

```bash
# Build once
npm run build

# Watch mode (automatically rebuild when code changes)
npm run dev

# Build and run CLI immediately
npm run dev:cli list
```

### Build Workflow

1. **Install dependencies** (if not already):
   ```bash
   npm install
   ```
   Note: `esbuild` will be installed automatically as it's in `devDependencies`.

2. **Build source code**:
   ```bash
   npm run build
   ```
   The build script (`build.js`) will:
   - Bundle `src/index.ts` → `dist/index.js`
   - Bundle `src/cli/index.ts` → `bin/heraspec.js`
   - Externalize all dependencies (don't bundle them)

3. **Verify build**:
   ```bash
   # Check files have been created
   ls -la dist/
   ls -la bin/
   
   # Test CLI
   node bin/heraspec.js --version
   ```

### Important Notes

- **No `prepare` script**: Removed to avoid automatic build during `npm install` (can cause errors if dependencies aren't ready)
- **Manual build**: After `npm install`, you must run `npm run build` manually
- **Rebuild when code changes**: Every time you modify code in `src/`, you need to rebuild for changes to take effect

## Development Workflow

When developing HeraSpec:

```bash
# 1. Edit code in src/

# 2. Rebuild
npm run build

# 3. Test immediately (if already linked)
cd ~/test-project
heraspec list

# Or test directly
npm run dev:cli list
```

## Structure After Initialization

After running `heraspec init` in a project, you'll have:

```
my-project/
├── heraspec/              # ← Created by 'heraspec init'
│   ├── project.md
│   ├── config.yaml
│   ├── specs/
│   ├── changes/
│   └── archives/
├── AGENTS.heraspec.md     # ← Created by 'heraspec init'
└── ... (your project code)
```

**There is no** HeraSpec source code directory here. Only the `heraspec/` structure to manage specs.

## FAQ

### Q: Do I need to copy the HeraSpec directory into each project?

**A: NO.** HeraSpec is a global CLI tool. You only need:
1. Install globally once (or link)
2. Run `heraspec init` in each project to create the structure

### Q: Why doesn't `npm install -g heraspec` work?

**A:** Because HeraSpec hasn't been published to npm registry yet. You need to:
- Build source code
- Link or install from local directory

### Q: How to test HeraSpec in development?

**A:** 
```bash
# In HeraSpec directory
npm run build

# Link
npm link

# Test in another project
cd ~/test-project
heraspec init
```

### Q: Can I use HeraSpec in multiple projects?

**A: YES.** After linking/installing globally, you can use it in any project:
```bash
cd project-1
heraspec init

cd project-2
heraspec init

cd project-3
heraspec init
```

Each project will have its own `heraspec/` directory.

### Q: How to update HeraSpec after modifying code?

**A:**
```bash
# In HeraSpec directory
npm run build

# If using npm link, no need to do anything else
# If installed from local, reinstall:
npm install -g /path/to/HeraSpec
```

## Troubleshooting

### Error: "Cannot find package 'esbuild'"

**Cause**: Package `esbuild` hasn't been installed in `devDependencies`.

**Solution**:
```bash
cd /Applications/Data/Projects/HeadRandomSpec/HeraSpec

# Reinstall dependencies (esbuild will be installed)
npm install

# Then build
npm run build
```

**Note**: If you still encounter errors, check if `package.json` already has `esbuild` in `devDependencies`:
```json
"devDependencies": {
  "@types/node": "^24.2.0",
  "esbuild": "^0.24.0",
  "typescript": "^5.9.3"
}
```

### Error: "command not found: heraspec"

**Cause**: Not linked or not installed globally.

**Solution**:
```bash
cd /Applications/Data/Projects/HeadRandomSpec/HeraSpec

# Ensure built first
npm run build

# Link globally
npm link

# Verify
heraspec --version
```

### Error: "Cannot find module" when building

**Cause**: Dependencies haven't been fully installed.

**Solution**:
```bash
cd /Applications/Data/Projects/HeadRandomSpec/HeraSpec

# Reinstall dependencies
npm install

# Clean and rebuild
rm -rf dist bin
npm run build
```

### Error when running `npm install` automatically builds

**Cause**: The `prepare` script has been removed from package.json to avoid this error.

**Solution**: This is expected behavior. You need to build manually after installing dependencies:
```bash
npm install
npm run build
```

### Error when running heraspec in project

**Check in order**:
1. Have dependencies been installed? (`npm install`)
2. Has build been run? (`npm run build`)
3. Has it been linked? (`npm link`)
4. Has `heraspec init` been run in the project?

**Complete workflow**:
```bash
# In HeraSpec directory
cd /Applications/Data/Projects/HeadRandomSpec/HeraSpec
npm install        # Install dependencies (including esbuild)
npm run build      # Build source code
npm link           # Link globally

# Verify
heraspec --version

# Use in project
cd ~/my-project
heraspec init
```

### Detailed Build Process

HeraSpec uses `esbuild` to compile TypeScript. Build process:

1. **Build `src/index.ts`** → `dist/index.js` (main export)
2. **Build `src/cli/index.ts`** → `bin/heraspec.js` (CLI entry point)

Both are bundled with external dependencies (dependencies like commander, chalk, etc. are not bundled).

If you encounter build issues, check:
- Node.js version >= 20.19.0
- `esbuild` has been installed in `node_modules`
- No syntax errors in TypeScript code

## Summary

1. **HeraSpec is a global CLI** - don't copy into projects
2. **In development**: Build → Link → Use
3. **In production** (after publishing): `npm install -g heraspec`
4. **Each project** only needs to run `heraspec init` to create the `heraspec/` structure

---

After HeraSpec is published to npm, installation will be simpler:
```bash
npm install -g heraspec
```
