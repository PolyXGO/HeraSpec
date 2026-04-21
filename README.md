# HeraSpec

<p align="center">
  <img src="https://img.shields.io/npm/v/heraspec?style=for-the-badge&color=007ec6" alt="npm version" />
  <img src="https://img.shields.io/npm/l/heraspec?style=for-the-badge&color=97ca00" alt="license" />
  <img src="https://img.shields.io/node/v/heraspec?style=for-the-badge&color=339933" alt="node version" />
  <img src="https://img.shields.io/github/actions/workflow/status/PolyXGO/HeraSpec/build.yml?style=for-the-badge" alt="build status" />
</p>

<p align="center">
  <img src="https://img.shields.io/npm/dm/heraspec?style=flat-square&color=20c20e" alt="downloads" />
  <img src="https://img.shields.io/github/stars/PolyXGO/HeraSpec?style=flat-square&color=007ec6" alt="stars" />
  <img src="https://img.shields.io/github/forks/PolyXGO/HeraSpec?style=flat-square&color=007ec6" alt="forks" />
  <img src="https://img.shields.io/github/issues/PolyXGO/HeraSpec?style=flat-square&color=red" alt="issues" />
</p>

---

<p align="left">
  <a href="https://polyxgo.com"><strong>🌐 Website</strong></a> •
  <a href="https://github.com/PolyXGO/HeraSpec"><strong>💻 GitHub</strong></a> •
  <a href="https://www.npmjs.com/package/heraspec"><strong>📦 NPM</strong></a> •
  <a href="./docs/en/USER_GUIDE.md"><strong>📚 Documentation</strong></a>
</p>

HeraSpec is a specification-based development framework that helps you:

- Plan before coding by creating detailed project specifications
- Track changes through delta specifications
- Work across multiple project types (WordPress, Laravel, React, etc.)
- Integrate with AI tools for better development workflow

## Important Note

> **Note:** HeraSpec is a workflow that I have synthesized, tested, and am currently applying to my work. I constantly refine it to fit small and medium projects, especially for solo freelancers working alone: coding on demand, selling plugins, modules, themes, and software on platforms like Envato.
>
> Therefore, there may be many components and structures that are not strictly standardized or suitable for large and complex processes. In such cases, please skip or adjust them accordingly—ask your AI Agents to tailor it to your needs!
>
> **If you have any suggestions for new skills to supplement HeraSpec, please let me know!** Good luck with love!

<!-- HeraSpec Section -->

<!-- HeraSpec Section -->

<!-- HeraSpec Section -->

<!-- HeraSpec Section -->

<!-- HeraSpec Section -->

<!-- HeraSpec Section -->

<!-- HeraSpec Section -->

<!-- HeraSpec Section -->
## HeraSpec Development

This project uses [HeraSpec](https://github.com/your-org/heraspec) for spec-driven development.

### Quick Start

```bash
# Initialize HeraSpec (if not already done)
heraspec init

# List active changes
heraspec list

# View a change
heraspec show <change-name>

# Validate changes
heraspec validate <change-name>
```

### Project Structure

- `heraspec/project.md` - Project overview and configuration
- `heraspec/specs/` - Source of truth specifications
- `heraspec/changes/` - Active changes in progress
- `heraspec/skills/` - Reusable skills for AI agents
- `AGENTS.heraspec.md` - AI agent instructions

### Working with Changes

1. **Create a change**: Ask AI to create a HeraSpec change, or create manually
2. **Refine specs**: Review and update delta specs in `heraspec/specs/<change-name>/`
3. **Implement**: Follow tasks in `heraspec/changes/<change-name>/tasks.md`
4. **Archive**: Run `heraspec archive <change-name> --yes` when complete

### Skills

Add skills to your project:

```bash
# List available skills
heraspec skill list

# Add a skill
heraspec skill add ui-ux
heraspec skill add unit-test

# View skill details
heraspec skill show ui-ux
```

For more information, see the [HeraSpec documentation](https://github.com/your-org/heraspec/docs).

---

*This section is automatically updated by `heraspec init`. Last updated: 2026-04-21*


## Installation

```bash
npm install -g heraspec
```

## Quick Start

```bash
# Initialize a new project
heraspec init

# Create your first change proposal
heraspec change create "add-user-authentication"

# Start working on the change
heraspec change start "add-user-authentication"
```

## Documentation

- [User Guide](./docs/en/USER_GUIDE.md)
- [Quick Start](./QUICK_START.md)
- [Architecture](./docs/en/ARCHITECTURE.md)

## Features

- ✅ Multi-project type support (WordPress, Laravel, React, Vue, etc.)
- ✅ Specification-driven development
- ✅ AI integration ready
- ✅ Change tracking and management
- ✅ Delta specifications
- ✅ Task management with skills system

## AI Integration

Integrate with AI tools for better development workflow: Cursor, Antigravity, Windsurf, Copilot, and Claude Desktop. HeraSpec automatically generates specifications that AI tools can understand and implement.

### Supported AI Tools

- **Cursor** - Native AGENTS.md support for automatic change creation
- **Antigravity** - AGENTS.md integration for spec-driven development
- **Windsurf** - AI-powered workflow with HeraSpec specifications
- **Copilot** - Enhanced development with structured specs
- **Claude Desktop** - MCP-ready architecture for AI assistance

## Showcase

Here are some products built partially or entirely using the HeraSpec framework:

<ul>
    <li><a href="https://codecanyon.net/item/flexinote-for-perfex-crm/60590690" target="_blank">FlexNote for Perfex CRM</a> - Advanced note management with AI capabilities.</li>
    <li><a href="https://codecanyon.net/item/polyutilities-for-perfex-crm-quick-access-menu-custom-js-css-and-more/49522529" target="_blank">PolyUtilities for Perfex CRM</a> - Essential toolkit for Perfex CRM customization.</li>
    <li><a href="https://erp.polyxgo.com/code/project/demo-builder-for-perfex-crm" target="_blank">Demo Builder for Perfex CRM</a> - Automated demo instance creator.</li>
    <li><a href="https://chromewebstore.google.com/detail/flexinote/oendkbllnfafakogepolfaonionlkehc" target="_blank">FlexNote - Sticky Notes for Web</a> - Create, manage, and customize notes directly on any webpage.<br>
    GitHub: <a href="https://github.com/PolyXGO/FlexiNote-extension" target="_blank">FlexNote - Smart Sticky Notes</a></li>
    <li><a href="https://erp.polyxgo.com/code/project/polymetrics" target="_blank">PolyMetrics</a> - Product price analysis extension for Envato.</li>
    <li><a href="https://erp.polyxgo.com/code/project/polydemo" target="_blank">PolyDemo</a> - Dynamic demonstration environment for web applications.</li>
    <li><a href="https://erp.polyxgo.com/code/project/smart-payment-for-perfex-crm" target="_blank">Smart Payment for Perfex CRM</a> - Intelligent payment gateway integration.</li>
</ul>

### Plugin WordPress cho Phong Thủy Huyền Học

<ul>
    <li><a href="https://erp.polyxgo.com/code/project/pxg-geofesh" target="_blank">Xem Ngày Tốt Xấu</a></li>
    <li><a href="https://erp.polyxgo.com/code/project/pxg-geofesh" target="_blank">Xem và Lập Lá Số Tứ Trụ - Bát Tự</a></li>
    <li><a href="https://erp.polyxgo.com/code/project/pxg-sow-hexagram" target="_blank">Giao Quẻ Kinh Dịch - Lục Hào - Mai Hoa Tiên Thiên</a></li>
    <li><a href="https://erp.polyxgo.com/code/project/pxg-geo-compass" target="_blank">Thước Lập Cực</a></li>
    <li><a href="https://erp.polyxgo.com/code/project/pxg-palm-reading" target="_blank">Xem Chỉ Tay</a></li>
    <li><a href="https://erp.polyxgo.com/code/project/pxg-face-reading" target="_blank">Diện Tướng</a></li>
</ul>

### Plugin WordPress khác

<ul>
    <li><a href="https://wordpress.org/plugins/white-label-builder/" target="_blank">White Label Builder</a></li>
    <li><a href="https://wordpress.org/plugins/poly-support/" target="_blank">Poly Support</a></li>
    <li><a href="https://wordpress.org/plugins/team-manager-unified/" target="_blank">Team Manager Unified</a></li>
</ul>

## Support

<div align="center">

If you find this source code helpful, consider buying me a coffee to support my work! ☕

[![Buy Me A Coffee](https://img.shields.io/badge/BUY_ME_A_COFFEE-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://paypal.me/polyxgo)

-or-

<img src="https://polyxgo.com/wp-content/uploads/2026/01/CafeCodeTrauNheNgokNgok.png" alt="Donate QR Code" width="300" />

</div>

## License

MIT License - see [LICENSE](./LICENSE) file for details.
