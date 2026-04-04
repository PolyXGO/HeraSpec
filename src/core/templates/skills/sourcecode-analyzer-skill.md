---
name: sourcecode-analyzer
description: Multi-agent deep source code analysis for architecture, coding style, design patterns, languages, frameworks, libraries, module structure, extension points, and integration readiness. Use when agents must understand a codebase before planning features, refactoring, integration, migration, auditing, or documentation.
projectType: all
---

# Source Code Analyzer

## Objective
Produce a high-confidence architecture and integration analysis of the repository with evidence from real files.

## Scope
Analyze:
- Architecture boundaries and layering
- Framework/CMS/runtime and dependency stack
- Coding style and conventions
- Modules/themes/plugins and extension points
- API surfaces (REST/GraphQL/webhooks/events/CLI/jobs)
- Data layer and configuration model
- Security and operational posture
- Integration capability and constraints

Do not:
- Modify business logic
- Run destructive commands
- Install or upgrade dependencies unless requested

## Required Output
Write a report to `_analytics/structure.md` (or user-provided path) with the exact section order defined in "Report Template".

## Evidence Rules
For every important claim:
- Include concrete evidence (file path, symbol/class/function, and short snippet summary)
- Mark confidence as `High`, `Medium`, or `Low`
- Label statement type:
  - `Observed`: Directly confirmed in source
  - `Inferred`: Derived from multiple observed facts
  - `Assumed`: Plausible but not yet confirmed

Avoid ungrounded conclusions.

## Multi-Agent Orchestration
If subagents are available, split work in parallel:

1. `Architecture lane`
- Map directory topology, layers, modules/plugins/themes
- Identify entry points and dependency direction

2. `Style and design lane`
- Detect naming conventions, folder conventions, patterns, anti-patterns
- Detect coding standards and linting/testing quality gates

3. `Dependency and runtime lane`
- Detect language/runtime/framework versions
- Inventory key libraries and their roles

4. `Integration and security lane`
- Map APIs, events/hooks, queues, cron/jobs, webhooks, third-party SDKs
- Assess authN/authZ, input validation, secrets handling, and attack surface

Coordinator responsibilities:
- Normalize lane outputs
- Resolve contradictions
- Produce one final report with evidence and confidence

If subagents are unavailable, execute the same lanes sequentially.

## Workflow

### Step 0 — Knowledge Lookup (Pre-Analysis)
Before starting full analysis, check if pre-analyzed knowledge exists:

1. Check if `heraspec/knowledge/index.json` exists in the project
2. Read all entries and match against the current project:
   - For `file-contains` signals: check if the file exists AND contains the specified string
   - For `directory-exists` signals: check if the directory exists
   - Each matched signal = +1 to the match score
3. If `score >= minMatchScore` for any entry:
   - Read the corresponding `structure.md` from `heraspec/knowledge/<knowledgePath>/`
   - Use it as the **baseline analysis** — skip redundant Steps 1-8 for sections already covered
   - Focus only on **project-specific differences** (custom plugins, configs, .env, custom code)
   - Output: merge baseline knowledge + project-specific delta into final report
4. Also check `heraspec/knowledge/custom/index.json` for project-specific knowledge entries
5. If no match found in either index: proceed with full analysis from Step 1

Knowledge hierarchy: `heraspec/knowledge/<category>/<runtime>/<framework>/<cms>/`

### Step 1 - Baseline Metadata
Read root metadata first:
- `composer.json`, `composer.lock`
- `package.json`, lockfiles
- `docker*`, `Makefile`, CI configs
- `.env.example`, config directories

Capture:
- Language/runtime versions
- Framework/CMS versions
- Build and deployment model

### Step 2 - Repository Topology
Map major folders and responsibilities:
- Core/domain/infrastructure boundaries
- Plugin/module/theme architecture
- Shared libraries and cross-cutting concerns
- Bootstrapping and entry points

### Step 3 - Architectural Patterns
Identify and evaluate:
- Layered/hexagonal/modular/monolith/microservice patterns
- Service container/DI usage
- Event-driven flows
- Boundaries and coupling hotspots

### Step 4 - Coding Style and Design Conventions
Inspect representative files from each major layer:
- Naming conventions (class/function/file)
- Folder and namespace strategy
- Error handling patterns
- Test style and coverage signals
- Static analysis/lint/format rules

### Step 5 - Extension Model
Map extensibility mechanisms:
- Hooks/filters/events/listeners
- Plugin/module registration and lifecycle
- Theme/template override model
- Custom providers, middleware, policies

### Step 6 - API and Interaction Surfaces
Inventory internal and external interfaces:
- REST/GraphQL routes and controllers
- Command bus, queues, jobs, schedulers
- CLI commands, webhooks, callbacks
- Public SDK/service abstractions

### Step 7 - Data and State
Analyze:
- ORM/data access strategy
- Migration and seeding patterns
- Cache/session/queue drivers
- Transaction boundaries and consistency risks

### Step 8 - Security and Compliance Signals
Check:
- Authentication and authorization model
- CSRF/XSS/SQLi protections
- Secrets and credential handling
- Rate limiting and abuse protection
- Audit logging and sensitive operation traces

### Step 9 - Integration Readiness
Evaluate integration capability across:
- Data integration
- API integration
- Event integration
- UI/theme integration
- Deployment/infra integration

For each integration type, summarize:
- Available entry points
- Required adapters
- Estimated complexity (`Low`/`Medium`/`High`)
- Major risks and mitigations

### Step 10 - Synthesis
Consolidate findings into one report, prioritize evidence-backed conclusions, and list unknowns that block confidence.

## Report Template

Use this exact section order in `_analytics/structure.md`:

1. `Executive Summary`
2. `Technology Profile`
3. `Repository Topology`
4. `Architecture and Dependency Flow`
5. `Coding Style and Conventions`
6. `Extension Points (Modules/Themes/Plugins/Hooks)`
7. `API and Interaction Surfaces`
8. `Data Model and State Management`
9. `Security Posture`
10. `Integration Capability Matrix`
11. `Strengths, Weaknesses, Risks`
12. `Top 10 Evidence Items`
13. `Unknowns and Verification Plan`
14. `Recommended Next Actions (30/60/90 day)`

## Integration Capability Matrix Format

Use one row per integration domain:

| Domain | Entry Points | Required Adapters | Complexity | Risks | Confidence |
|---|---|---|---|---|---|

Domains to include:
- External APIs
- Authentication/SSO
- Payment
- Messaging/Queue
- Storage/CDN
- Observability
- Admin/UI customization
- Content/data migration

## Completion Checklist
Complete the skill execution only when all conditions are met:
- Report file exists at target path
- Every critical claim has evidence
- Assumptions are explicitly marked
- Integration matrix is complete
- Top risks include mitigation guidance
