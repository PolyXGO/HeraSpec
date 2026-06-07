# Skill: Module Codebase (Perfex Module)

## Purpose

This skill is used to create and manage codebase structure for Perfex CRM modules following Perfex best practices.

## When to Use

- When creating a new module for Perfex CRM
- When refactoring existing module structure
- When ensuring module follows Perfex conventions
- When creating standard folder and file structure for module

## Step-by-Step Process

### Step 1: Analyze Requirements
- Identify main functionality of module
- Identify required database tables
- Identify hooks and filters to use
- Identify permissions to create

### Step 2: Scaffold Structure
- Run script: `scripts/scaffold-module.sh <module-name>`
- Script will create standard folder structure:
  - `modules/<module-name>/`
  - `modules/<module-name>/controllers/`
  - `modules/<module-name>/models/`
  - `modules/<module-name>/views/`
  - `modules/<module-name>/language/`
  - `modules/<module-name>/assets/`
- Copy templates to correct locations

### Step 3: Configure Module
- Fill information in `module-config.php` (from template)
- Register module in Perfex system
- Set up permissions and menu items

### Step 4: Implement Core Logic
- Create controllers following Perfex structure
- Create models with Eloquent patterns
- Implement hooks and filters
- Create database migrations

### Step 5: Testing & Documentation
- Test module with Perfex core
- Write documentation (use documents skill)
- Create user guide (use documents skill)

## Required Input

- **Module name**: Module name (kebab-case, e.g., `category-management`)
- **Module description**: Module functionality description
- **Database tables**: List of tables to create
- **Hooks required**: List of hooks to implement
- **Permissions**: List of permissions to create
- **Menu items**: List of menu items to add

## Expected Output

- Complete module folder structure
- Fully configured files
- Database migrations
- Module registration code
- Basic documentation structure

## Tone & Rules

### Code Style
- Follow PSR-12 coding standards
- Use camelCase for functions
- Use PascalCase for classes
- Comment in English

### Naming Conventions
- Module folder: `perfex-<module-name>`
- Class names: `Perfex<ModuleName>`
- Function names: `perfex_<module_name>_<action>`
- Database tables: `tbl<ModuleName>`

### Limitations
- ❌ DO NOT create global functions (except hooks)
- ❌ DO NOT hardcode database credentials
- ❌ DO NOT bypass Perfex permission system
- ❌ DO NOT modify core Perfex files
- ❌ DO NOT use deprecated Perfex APIs

## Available Templates

- `templates/module-structure.php` - Basic module structure
- `templates/module-config.php` - Module configuration file
- `templates/module-hooks.php` - Template for hooks
- `templates/module-migration.php` - Database migration template

## Available Scripts

- `scripts/scaffold-module.sh` - Automatically create module structure

## Examples

See `examples/` directory for reference:
- `good-module-structure/` - Example of well-organized module
- `bad-module-structure/` - Example to avoid

## Links to Other Skills

- **documents**: Use to create technical docs and user guide
- **ui-ux**: Use when module has admin interface
- **content-optimization**: Use for module marketing pages
- **module-registration**: Use to register module with Perfex
- **permission-group**: Use to create permissions for module
