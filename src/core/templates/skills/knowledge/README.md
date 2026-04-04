# HeRaSpec Knowledge Base

Pre-analyzed profiles for frameworks, APIs, and platforms. When a skill (like `sourcecode-analyzer`) is invoked, it checks this knowledge base first to avoid redundant analysis.

## Structure

```
knowledge/
├── index.json              ← Registry of all built-in entries
├── frameworks/             ← CMS/Framework architecture profiles
│   └── <runtime>/<framework>/<cms>/
│       ├── profile.json    ← Metadata, match signals, key features
│       └── structure.md    ← Pre-analyzed architecture report
├── apis/                   ← Third-party API profiles (Shopify, QuickBooks, ...)
│   └── <provider>/
│       ├── profile.json
│       └── <analysis-files>
├── platforms/              ← Platform/infra knowledge (AWS, Vercel, ...)
│   └── <platform>/
│       ├── profile.json
│       └── <analysis-files>
└── custom/                 ← User's custom knowledge (NEVER touched by CLI)
    ├── index.json          ← Custom registry
    └── ...                 ← User-managed entries
```

## Categories

| Category | Purpose | Example |
|----------|---------|---------|
| `frameworks` | CMS/Framework architecture profiles | Laravel/Botble, WordPress, Perfex CRM |
| `apis` | Third-party API specifications | Shopify API, QuickBooks API |
| `platforms` | Deployment/infrastructure knowledge | AWS, Vercel, Docker patterns |

## How Matching Works

Each entry in `index.json` has `matchSignals` — conditions checked against the current project:

| Signal Type | Description | Example |
|-------------|-------------|---------|
| `file-contains` | File exists AND contains string | `composer.json` contains `"botble"` |
| `directory-exists` | Directory exists in project | `platform/core` exists |

Each matched signal = +1 score. If `score >= minMatchScore`, the knowledge is considered a match.

## How Skills Use Knowledge

1. Skill reads `heraspec/knowledge/index.json`
2. Matches project against entries using signals
3. If matched: loads pre-analyzed report as baseline, focuses on project-specific delta
4. If no match: performs full analysis from scratch

## Custom Knowledge

Users can add project-specific knowledge in `heraspec/knowledge/custom/`:

1. Create entry directory under `custom/`
2. Add to `custom/index.json`
3. The CLI will **never** modify or delete anything in `custom/`

## Updating Knowledge

Run `heraspec init` to update built-in knowledge to the latest version. Custom entries are preserved.
