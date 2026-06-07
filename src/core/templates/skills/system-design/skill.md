# Skill: System Design (Cross-Cutting)

## Purpose

Evaluate architectural decisions, design API endpoints, model data schemas, and analyze trade-offs.

## When to Use

- When architecting a new microservice, system, or database model
- When defining API boundaries and integration contracts between components
- When scaling system capacities and outlining horizontal/vertical tradeoffs

## Step-by-Step Process

### Step 1: Gather Requirements & Constraints
- List functional requirements (what the system must do)
- List non-functional requirements (throughput, scale, latency, availability)
- Identify technical constraints (team skill set, budget, timeline, existing stack)

### Step 2: High-Level Design
- Map out system components (services, clients, data stores)
- Outline data flow and request/response lifecycles
- Choose datastores (SQL, NoSQL, Cache, Document store)

### Step 3: Deep Dive & Contract Design
- Define database schema models and indexing strategies
- Design concrete API contracts (REST endpoints, GraphQL query structures, gRPC specs)
- Design error-handling patterns, caching strategies, and event queue definitions

### Step 4: Trade-off Analysis
- Document choices explicitly using architectural trade-offs (e.g. Read latency vs Write latency)
- Formulate scaling strategies (sharding, replication, failover mechanisms)

## Required Input

- Architecture goals, specifications, or user stories
- Expected load (requests per second, data size)
- Pre-existing tech stack constraints

## Expected Output

- System design document containing:
  - Architecture diagram (ASCII or Mermaid)
  - Data model and DB schema
  - API endpoint specifications
  - Cache/Queue strategy
  - Explicit trade-off analysis

## Tone & Rules

- Every design decision must have a corresponding trade-off analyzed.
- Keep designs modular and explain service boundaries clearly.
- Avoid over-engineering. Design for 10x scale, but build for 1.5x scale.

## Available Templates

- None

## Available Scripts

- None

## Examples

See `examples/` directory.

## Links to Other Skills

- **documents**: Use to generate product and technical specification documents.
- **suggestion**: Use to analyze existing systems and suggest architectural improvements.
