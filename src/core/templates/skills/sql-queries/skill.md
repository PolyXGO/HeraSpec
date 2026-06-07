# Skill: SQL Queries (Cross-Cutting)

## Purpose

Write correct, readable, and highly performant SQL queries across all major database systems and data warehouse dialects (PostgreSQL, Snowflake, BigQuery, Redshift, Databricks SQL).

## When to Use

- When writing complex analytical queries involving CTEs, window functions, and cohort retention calculations.
- When optimizing slow-running SQL queries or translating queries between database dialects.
- When designing data models, schema migrations, and indexing strategies.

## Step-by-Step Process

### Step 1: Analyze Schema & Dialect
- Identify the target database engine (PostgreSQL, BigQuery, Snowflake, etc.).
- Review available table schemas, keys, indexes, and partitioning keys.

### Step 2: Structure Using CTEs
- Break down complex logic into small, readable Common Table Expressions (CTEs) representing logical steps.

### Step 3: Write Dialect-Specific Logic
- Implement date/time arithmetic, string manipulation, JSON/array functions, and window functions using syntax specific to the selected dialect.

### Step 4: Performance Optimization
- Apply database-specific optimization rules:
  - PostgreSQL: Use `EXPLAIN ANALYZE`, index columns, prefer `EXISTS` over `IN` for subqueries.
  - BigQuery: Minimize scanned bytes, partition on date columns, use `APPROX_COUNT_DISTINCT`.
  - Snowflake: Leverage clustering keys, transient tables, and avoid unnecessary warehouse resizing.

### Step 5: Test & Debug
- Verify correct handling of boundary cases (division by zero, null fields, type mismatch casting).

## Required Input

- **Database Engine**: PostgreSQL, BigQuery, Snowflake, etc.
- **Goal/Query Purpose**: What analytical question the query should answer.
- **Table Schema**: Definitions, keys, and partitioning details.

## Expected Output

- **Optimized SQL Code**: Full query code formatted using uppercase keywords and standard alignment.
- **Performance Explanation**: Brief details on partition pruning, indexing, or dialect-specific functions used to speed up the query.
- **Query Flow Explanation**: Explanation of each CTE step for developer readability.

## Tone & Rules

- Write clean, modern SQL using uppercase for keywords (SELECT, FROM, WHERE, etc.).
- Always qualify column names with table aliases when using JOINs.
- Avoid nested subqueries; always prefer Common Table Expressions (CTEs) for readability.

## Available Templates

- None

## Available Scripts

- None

## Examples

See `examples/` directory.

## Links to Other Skills

- **documents**: Use to document database schemas or technical data flow maps.
- **debug**: Use to diagnose and resolve errors returned by SQL execution engines.
