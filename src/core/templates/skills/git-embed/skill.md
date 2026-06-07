# Skill: Git Embed

## Purpose

This skill establishes a nested Git repository structure (Monorepo) where the outer (parent) repository physically tracks and stores the source code of an inner (child) repository, without using the standard Git Submodule mechanism. This allows the child repository to retain its own `.git` directory for independent committing and pushing.

## When to Use

- When migrating an existing Git repository to be embedded within a parent Monorepo.
- When the parent repository needs full direct physical access to the child's source files.
- When you need to avoid "empty folder" issues caused by standard Git submodules during cloning.
- When you want to commit and push independently from both the parent root and the child root.

## Step-by-Step Process

### Step 1: Remove Submodule References (If Any)
- Ensure the inner repository is not tracked as a submodule.
- Run `git rm -r --cached <child-folder>` from the parent root.
- Remove `.gitmodules` if it exists: `rm .gitmodules` and `git add .gitmodules` (if tracked).

### Step 2: Temporary `.git` Relocation
- Move the inner repository's `.git` directory out of the way to prevent Git from treating it as an embedded repo.
- Run `mv <child-folder>/.git /tmp/<child-name>_git_bak`.

### Step 3: Embed Source Code into Parent
- Add the inner folder directly to the parent repository.
- Run `git add <child-folder>/`.
- Commit the changes: `git commit -m "Embed full source of <child-name> independent of submodule"`.

### Step 4: Restore Independent `.git`
- Move the inner repository's `.git` directory back to its original location.
- Run `mv /tmp/<child-name>_git_bak <child-folder>/.git`.

### Step 5: Verification
- Run `git status` in the parent directory to ensure no submodule links are shown.
- Navigate into `<child-folder>` and run `git status` to verify the independent repository tracking is intact.

## Required Input

- **Child folder path**: The relative path to the nested repository.
- **Child name**: A short identifier used for the backup directory.

## Expected Output

- The parent's remote repository will contain all physical files natively without gitlinks.
- The child folder will retain its `.git` folder for completely independent repository operations.

## Tone & Rules

### Git Rules
- The child folder's `.gitignore` MUST be preserved, as the parent git will natively respect `.gitignore` rules in subdirectories.
- Ensure all uncommitted changes in the parent repo are stashed or committed before starting.

### Limitations
- ❌ DO NOT use `git submodule add` under any circumstances for this skill.
- ❌ DO NOT delete the inner `.git` folder permanently.
- ❌ DO NOT use `git subtree` as it creates a different tracking model.
