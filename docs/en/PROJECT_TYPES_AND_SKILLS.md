# Project Types and Skills

This document defines all supported project types and their associated skills in HeraSpec.

## Project Types

### wordpress-plugin

WordPress plugin development.

**Skills:**
- `admin-settings-page` - Create admin settings pages
- `custom-post-type` - Register custom post types
- `shortcode` - Create shortcodes
- `rest-endpoint` - WordPress REST API endpoints
- `ajax-handler` - AJAX request handlers
- `activation-hook` - Plugin activation hooks
- `deactivation-hook` - Plugin deactivation hooks
- `admin-menu-item` - Add admin menu items
- `meta-box` - Create meta boxes
- `taxonomy` - Register custom taxonomies
- `ux-element` - Create Flatsome UX Builder elements

### wordpress-theme

WordPress theme development.

**Skills:**
- `theme-setup` - Theme setup and initialization
- `custom-post-type` - Register custom post types
- `template-part` - Template parts and includes
- `widget-area` - Register widget areas
- `customizer-setting` - Theme customizer settings
- `theme-option` - Theme options pages
- `ux-element` - Create Flatsome UX Builder elements

### perfex-module

Perfex CRM module development.

**Skills:**
- `module-registration` - Module registration
- `permission-group` - Permission groups
- `admin-menu-item` - Admin menu items
- `login-hook` - Login hooks
- `database-table` - Database tables
- `api-endpoint` - API endpoints

### laravel-package

Laravel package development.

**Skills:**
- `service-provider` - Service providers
- `config-file` - Configuration files
- `artisan-command` - Artisan commands
- `migration` - Database migrations
- `model` - Eloquent models
- `controller` - Controllers
- `middleware` - Middleware
- `route` - Routes

### node-service

Node.js service development.

**Skills:**
- `express-route` - Express routes
- `middleware` - Express middleware
- `database-model` - Database models (Sequelize, Mongoose, etc.)
- `service-layer` - Service layer
- `api-endpoint` - API endpoints
- `background-job` - Background jobs (Bull, Agenda, etc.)

### generic-webapp

Generic web application.

**Skills:**
- `page` - Pages/views
- `component` - UI components
- `api-endpoint` - API endpoints
- `database-table` - Database tables
- `authentication` - Authentication
- `authorization` - Authorization

### backend-api

Backend API service.

**Skills:**
- `endpoint` - API endpoints
- `middleware` - Middleware
- `authentication` - Authentication
- `authorization` - Authorization
- `database-model` - Database models
- `validation` - Input validation

### frontend-app

Frontend application.

**Skills:**
- `page` - Pages/routes
- `component` - Components
- `route` - Routing
- `store` - State management
- `service` - API services
- `hook` - Custom hooks

### multi-stack

Multi-stack or cross-platform projects.

**Skills:**
- `cross-platform-feature` - Features spanning multiple stacks
- `api-contract` - API contracts/interfaces
- `shared-type` - Shared types/interfaces
- `integration-point` - Integration points

## Using Skills in Tasks

Skills are referenced in tasks.md:

```markdown
## 1. WordPress plugin – feature name (projectType: wordpress-plugin, skill: admin-settings-page)
- [ ] Task 1.1
- [ ] Task 1.2
```

## Adding New Project Types

1. Add to `PROJECT_TYPES` array in `src/core/config.ts`
2. Add skills mapping in `SKILLS` object
3. Update this documentation

## Adding New Skills

Add to the appropriate project type in the `SKILLS` mapping in `src/core/config.ts`.

