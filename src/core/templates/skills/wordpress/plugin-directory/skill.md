# Skill: WordPress Plugin Directory Compliance Check

This skill provides a systematic approach to review WordPress plugin source code against the [WordPress Plugin Directory Guidelines](https://developer.wordpress.org/plugins/wordpress-org/detailed-plugin-guidelines/).

## Purpose

To ensure a WordPress plugin fully complies with all 18 guidelines before submission to WordPress.org Plugin Directory, identifying issues and providing detailed recommendations for user approval before making changes.

## Prerequisites

1. **Identify Plugin Root**: The agent must identify the root directory of the WordPress plugin being reviewed.
2. **Plugin Main File**: Locate the main plugin file (with `Plugin Name:` header).
3. **Readme File**: Check for `readme.txt` or `README.md`.

## Required Variables

- `{{plugin_path}}`: Absolute path to the plugin root directory.
- `{{plugin_slug}}`: The plugin's slug (folder name).

## Process Flow

### Step 1: Gather Plugin Information

1. **Find Main Plugin File**:
   ```bash
   grep -l "Plugin Name:" {{plugin_path}}/*.php
   ```

2. **Read Plugin Headers**:
   - Plugin Name
   - Version
   - Author
   - License
   - Text Domain

3. **Scan File Structure**:
   ```bash
   find {{plugin_path}} -type f \( -name "*.php" -o -name "*.js" -o -name "*.css" \) | head -50
   ```

### Step 2: Review All 18 Guidelines

Perform systematic checks on each guideline:

---

#### **Guideline 1: GPL Compatibility**
> "Plugins must be compatible with the GNU General Public License"

**Checks:**
- [ ] Main plugin file has License header?
- [ ] License is GPL-compatible? (GPLv2 or later recommended)
- [ ] Third-party libraries have GPL-compatible licenses?
- [ ] Images and fonts have clear licensing?

**Commands:**
```bash
grep -r "License:" --include="*.php" {{plugin_path}}
grep -r "@license" --include="*.php" {{plugin_path}}
```

---

#### **Guideline 2: Developer Responsibility**
> "Developers are responsible for the contents and actions of their plugins"

**Checks:**
- [ ] No code intentionally bypassing guidelines?
- [ ] All files have confirmed licensing?
- [ ] Third-party APIs comply with terms of use?

---

#### **Guideline 3: Stable Version Availability**
> "A stable version of a plugin must be available from its WordPress Plugin Directory page"

**Checks:**
- [ ] Code on SVN/directory is the latest version?
- [ ] Not distributing code via alternate methods without updating directory?

---

#### **Guideline 4: Human Readable Code**
> "Code must be (mostly) human readable"

**Checks:**
- [ ] No obfuscated code (p,a,c,k,e,r, uglify mangle)?
- [ ] No obscure variable names ($z12sdf813d)?
- [ ] Source code or link to development location available in readme?
- [ ] Build tools documented?

**Commands:**
```bash
# Find eval() that may contain obfuscated code
grep -r "eval(" --include="*.php" --include="*.js" {{plugin_path}}
# Find strange variable names
grep -rE "\$[a-z][0-9]{3,}" --include="*.php" {{plugin_path}}
```

---

#### **Guideline 5: No Trialware**
> "Trialware is not permitted"

**Checks:**
- [ ] No features locked behind payment?
- [ ] No time-based trial limits?
- [ ] No quota restrictions?
- [ ] No sandbox-only API access?

**Commands:**
```bash
grep -ri "trial" --include="*.php" {{plugin_path}}
grep -ri "expired" --include="*.php" {{plugin_path}}
grep -ri "license_key" --include="*.php" {{plugin_path}}
grep -ri "is_pro" --include="*.php" {{plugin_path}}
```

---

#### **Guideline 6: Software as a Service**
> "Software as a Service is permitted"

**Checks:**
- [ ] Service provides real functionality, not just license validation?
- [ ] Service documented in readme?
- [ ] Link to Terms of Use provided?
- [ ] Not just a storefront?

---

#### **Guideline 7: User Tracking Consent**
> "Plugins may not track users without their consent"

**Checks:**
- [ ] No automatic data collection without consent?
- [ ] Clear opt-in mechanism?
- [ ] Privacy policy documented in readme?
- [ ] Not misleading users to submit information?
- [ ] Not offloading unrelated assets?
- [ ] No undocumented external data usage?

**Commands:**
```bash
# Find external requests
grep -ri "wp_remote" --include="*.php" {{plugin_path}}
grep -ri "curl_" --include="*.php" {{plugin_path}}
grep -ri "file_get_contents.*http" --include="*.php" {{plugin_path}}
# Find tracking
grep -ri "analytics" --include="*.php" --include="*.js" {{plugin_path}}
grep -ri "tracking" --include="*.php" --include="*.js" {{plugin_path}}
```

---

#### **Guideline 8: No External Executable Code**
> "Plugins may not send executable code via third-party systems"

**Checks:**
- [ ] Not serving updates from external servers?
- [ ] Not installing plugins/themes/add-ons from outside?
- [ ] Not calling CDN for JS/CSS (except fonts)?
- [ ] Not using third-party services to manage data lists?
- [ ] Not using iframes in admin pages?

**Commands:**
```bash
grep -ri "cdn" --include="*.php" --include="*.js" {{plugin_path}}
grep -ri "<iframe" --include="*.php" {{plugin_path}}
grep -ri "wp_remote_get.*\.js" --include="*.php" {{plugin_path}}
```

---

#### **Guideline 9: Legal and Ethical Conduct**
> "Developers and their plugins must not do anything illegal, dishonest, or morally offensive"

**Checks:**
- [ ] No keyword stuffing?
- [ ] No fake reviews/sockpuppeting?
- [ ] No copying others' plugins?
- [ ] No automatic legal compliance claims?
- [ ] No unauthorized server resource usage (botnet, crypto-mining)?

---

#### **Guideline 10: External Links and Credits**
> "Plugins may not embed external links or credits on the public site without explicitly asking the user's permission"

**Checks:**
- [ ] "Powered By" links are optional and default OFF?
- [ ] Users must opt-in to display credits?
- [ ] Plugin doesn't require credit for functionality?

**Commands:**
```bash
grep -ri "powered by" --include="*.php" {{plugin_path}}
grep -ri "credit" --include="*.php" {{plugin_path}}
grep -ri "footer_text" --include="*.php" {{plugin_path}}
```

---

#### **Guideline 11: Admin Dashboard Experience**
> "Plugins should not hijack the admin dashboard"

**Checks:**
- [ ] Upgrade prompts are limited and contextual?
- [ ] Notices are dismissible?
- [ ] Error messages have resolution guidance?
- [ ] No excessive dashboard advertising?
- [ ] No tracking in ads (related to Guideline 7)?

**Commands:**
```bash
grep -ri "admin_notice" --include="*.php" {{plugin_path}}
grep -ri "is-dismissible" --include="*.php" {{plugin_path}}
grep -ri "upgrade" --include="*.php" {{plugin_path}}
```

---

#### **Guideline 12: No Spam in Public Pages**
> "Public facing pages on WordPress.org (readmes) must not spam"

**Checks in readme.txt:**
- [ ] No more than 5 tags?
- [ ] No undisclosed affiliate links?
- [ ] No keyword stuffing?
- [ ] No competitor tags?
- [ ] Links are direct, not redirected/cloaked?

---

#### **Guideline 13: WordPress Default Libraries**
> "Plugins must use WordPress' default libraries"

**Checks:**
- [ ] Not including separate jQuery?
- [ ] Not including libraries already in WordPress?
- [ ] Using `wp_enqueue_script()` with standard handles?

**WordPress Default Libraries:**
- jQuery, jQuery UI
- Backbone.js, Underscore.js
- React, ReactDOM
- Lodash
- Moment.js
- PHPMailer, PHPass

**Commands:**
```bash
find {{plugin_path}} -name "jquery*.js" -o -name "jquery*.min.js"
find {{plugin_path}} -name "underscore*.js" -o -name "backbone*.js"
find {{plugin_path}} -name "react*.js" -o -name "moment*.js"
```

---

#### **Guideline 14: Commit Frequency**
> "Frequent commits to a plugin should be avoided"

**Checks:**
- [ ] SVN is release repository, not development?
- [ ] Meaningful commit messages?
- [ ] No rapid-fire minor commits?

---

#### **Guideline 15: Version Number Increment**
> "Plugin version numbers must be incremented for each new release"

**Checks:**
- [ ] Version in main plugin file matches readme.txt?
- [ ] Correct version format (semantic versioning recommended)?
- [ ] SVN tag matches version number?

**Commands:**
```bash
grep -r "Version:" --include="*.php" {{plugin_path}} | head -5
grep -r "Stable tag:" {{plugin_path}}/readme.txt
```

---

#### **Guideline 16: Complete Plugin Required**
> "A complete plugin must be available at the time of submission"

**Checks:**
- [ ] Plugin is fully functional?
- [ ] Not a placeholder/coming soon?
- [ ] Not reserving name for future use?

---

#### **Guideline 17: Trademark and Copyright**
> "Plugins must respect trademarks, copyrights, and project names"

**Checks:**
- [ ] Slug doesn't start with trademarked names (WordPress, WooCommerce, etc.) unless authorized?
- [ ] Plugin name doesn't cause confusion with other products?
- [ ] Original branding recommended?

---

#### **Guideline 18: Directory Maintenance Rights**
> "We reserve the right to maintain the Plugin Directory to the best of our ability"

**Notes:** WordPress.org has rights to:
- Update guidelines at any time
- Disable/remove plugins for unlisted reasons
- Grant exceptions
- Remove developer access
- Modify plugins without consent for public safety

---

### Step 3: Generate Compliance Report

Create a report using this format:

```markdown
# WordPress Plugin Directory Compliance Report

## Plugin Information
- **Name:** [Plugin Name]
- **Version:** [Version]
- **Path:** [Path]
- **Review Time:** [Date/Time]

## Summary
- ✅ Passed: X/18 guidelines
- ⚠️ Needs Review: X issues
- ❌ Violations: X issues

## Details by Guideline

### ❌ Guideline X: [Guideline Name]
**Issues Found:**
- [Issue description]
- **File:** [file path]
- **Line:** [line number]

**Suggested Fix:**
\`\`\`php
// Code suggestion
\`\`\`

### ⚠️ Guideline Y: [Guideline Name]
**Needs Review:**
- [Description]

---

## Recommended Actions
1. [ ] [Action 1]
2. [ ] [Action 2]
...
```

### Step 4: User Confirmation

**CRITICAL:** Before making ANY changes, the Agent MUST:

1. Present the complete report to the user
2. Clearly explain each issue with reference to the specific guideline number
3. Wait for user confirmation on each action item
4. Only proceed after receiving approval

## Useful Commands

```bash
# Check plugin structure overview
find {{plugin_path}} -type f \( -name "*.php" -o -name "*.js" -o -name "*.css" \) | head -50

# Find all external URLs
grep -rhoE "https?://[a-zA-Z0-9./?=_-]*" --include="*.php" {{plugin_path}} | sort -u

# Check enqueued scripts
grep -r "wp_enqueue_script\|wp_enqueue_style" --include="*.php" {{plugin_path}}

# Find admin notices
grep -r "add_action.*admin_notices" --include="*.php" {{plugin_path}}

# Check AJAX handlers
grep -r "wp_ajax_" --include="*.php" {{plugin_path}}

# Find direct database queries
grep -r "\$wpdb->" --include="*.php" {{plugin_path}}
```

## References

- [WordPress Plugin Guidelines](https://developer.wordpress.org/plugins/wordpress-org/detailed-plugin-guidelines/)
- [GPL Compatible Licenses](https://www.gnu.org/licenses/license-list.html#GPLCompatibleLicenses)
- [Default Scripts in WordPress](https://developer.wordpress.org/reference/functions/wp_enqueue_script/#default-scripts-and-js-libraries-included-and-registered-by-wordpress)
