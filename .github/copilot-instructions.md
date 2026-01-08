# GitHub Copilot Instructions - TheBate

## Conventional Commits Standard

This repository follows [Conventional Commits](https://www.conventionalcommits.org/) specification to enable automated semantic versioning and changelog generation via `semantic-release`.

---

## Commit Message Format

Every commit message **MUST** follow this structure:

```
<type>(<scope>): <summary>

[optional body]

[optional footer(s)]
```

### Rules

- **type**: REQUIRED - must be one of the allowed types (see below)
- **scope**: RECOMMENDED - indicates the area/module affected (e.g., `auth`, `seo`, `ui`, `api`, `db`, `i18n`, `build`)
- **summary**: REQUIRED - short description in imperative mood, lowercase, no period at end
- **language**: Use English consistently throughout the repository
- **length**: Summary should be ≤ 72 characters

---

## Allowed Commit Types

| Type       | Effect            | Description                           | When to Use                                               |
| ---------- | ----------------- | ------------------------------------- | --------------------------------------------------------- |
| `feat`     | **MINOR** release | New feature for the user              | Adding new functionality, endpoints, UI components        |
| `fix`      | **PATCH** release | Bug fix for the user                  | Fixing broken behavior, errors, edge cases                |
| `perf`     | **PATCH** release | Performance improvement               | Optimizing queries, reducing bundle size, improving speed |
| `refactor` | No release        | Code change without functional impact | Restructuring code, renaming, cleaning up                 |
| `docs`     | No release        | Documentation changes                 | README, comments, markdown files                          |
| `test`     | No release        | Adding or fixing tests                | Unit tests, integration tests, e2e tests                  |
| `chore`    | No release        | Maintenance tasks                     | Dependencies update, config changes, tooling              |
| `ci`       | No release        | CI/CD pipeline changes                | GitHub Actions, build configs                             |
| `build`    | No release        | Build system changes                  | Webpack, Next.js config, bundler settings                 |
| `style`    | No release        | Code style changes                    | Formatting, linting fixes, whitespace                     |

### Important Notes

- `feat` → triggers **MINOR** version bump (1.x.0)
- `fix` → triggers **PATCH** version bump (1.0.x)
- `perf` → triggers **PATCH** version bump (1.0.x)
- Other types → **no release** by default

---

## Breaking Changes (MAJOR Release)

A breaking change **MUST** be indicated in two ways:

### 1. Add `!` after the type/scope:

```
feat(auth)!: switch to rotating refresh tokens
```

### 2. Include `BREAKING CHANGE:` in the commit body or footer:

```
feat(auth)!: switch to rotating refresh tokens

BREAKING CHANGE: All existing sessions will be invalidated.
Users must re-authenticate after deployment.
```

**Effect**: Triggers **MAJOR** version bump (x.0.0)

### Breaking Change Examples

```bash
# API contract change
feat(api)!: change topic response structure

BREAKING CHANGE: The topic API now returns `createdAt` instead of `created_at`.
Update all API clients accordingly.

# Removed functionality
feat(auth)!: remove legacy password reset flow

BREAKING CHANGE: The `/api/auth/reset-old` endpoint has been removed.
Use `/api/auth/reset` instead.

# Configuration change
build!: upgrade to Node 20

BREAKING CHANGE: Node.js 18 is no longer supported. Minimum version is now 20.
```

---

## How to Choose Type and Scope

### Type Selection Guide

| Situation                           | Type       | Example                                        |
| ----------------------------------- | ---------- | ---------------------------------------------- |
| Adding new user-facing feature      | `feat`     | `feat(topics): add markdown support`           |
| Fixing bug visible to users         | `fix`      | `fix(comments): prevent duplicate submissions` |
| Improving performance               | `perf`     | `perf(db): reduce N+1 queries on topic list`   |
| Refactoring without behavior change | `refactor` | `refactor(auth): extract validation logic`     |
| Updating documentation              | `docs`     | `docs: add deployment instructions`            |
| Adding/fixing tests                 | `test`     | `test(api): add topic creation tests`          |
| Updating dependencies               | `chore`    | `chore(deps): update next to 14.1.0`           |
| Changing CI/CD                      | `ci`       | `ci: add automated e2e tests`                  |
| Changing build config               | `build`    | `build: enable SWC minification`               |
| Code formatting only                | `style`    | `style: fix ESLint warnings`                   |

### Scope Selection Guide

Common scopes in this repository:

- `auth` - Authentication and authorization
- `topics` - Topic/debate functionality
- `comments` - Comment system
- `ui` - UI components
- `api` - API routes and handlers
- `db` - Database schema and queries
- `i18n` - Internationalization and translations
- `seo` - SEO optimization (metadata, schemas)
- `build` - Build configuration
- `deps` - Dependencies
- `dx` - Developer experience

**Scope is optional but highly recommended** - it helps with changelog organization and quick understanding of changes.

---

## Commit Message Examples

### ✅ Good Examples

```bash
feat(seo): add QAPage schema for topic pages
fix(api): handle null locale on topic fetch
perf(db): reduce N+1 queries on topic list
refactor(comments): extract vote logic to separate hook
docs(readme): add contributing guidelines
test(topics): add validation schema tests
chore(deps): update prisma to 5.8.0
ci: add semantic-release workflow
build: enable TypeScript strict mode
style(comments): fix indentation in comment-item
```

### ✅ With Body and Footer

```bash
feat(i18n): add German translations

Add complete German translation for all UI strings.
Includes navigation, forms, and error messages.

Closes #123
```

### ✅ Breaking Change

```bash
feat(auth)!: switch session tokens to rotating refresh tokens

This change improves security by implementing token rotation.
All existing sessions will be invalidated on deployment.

BREAKING CHANGE: Clients must re-authenticate once after deploy.
The session cookie structure has changed.

Refs: #456
```

### ❌ Bad Examples (DO NOT USE)

```bash
❌ update stuff
❌ WIP
❌ changes
❌ fix bug
❌ misc updates
❌ Updated the thing
❌ Fixed some issues
❌ feat: do a lot of things
```

---

## Referencing Issues and Tickets

Add issue references in the commit footer:

```bash
feat(topics): add vote count display

Closes #123
```

```bash
fix(api): prevent race condition on simultaneous votes

Fixes #456
Refs: #457
```

**Supported keywords**: `Closes`, `Fixes`, `Resolves`, `Refs`, `Related to`

---

## Quick Rules Checklist

- ✅ Use imperative mood: "add", "fix", "update" (not "added", "fixed", "updated")
- ✅ Keep summary lowercase
- ✅ No period (`.`) at end of summary
- ✅ One commit = one logical change
- ✅ Scope reflects the affected area
- ✅ Use `!` and `BREAKING CHANGE:` for breaking changes
- ❌ Never use "WIP", "misc", "update stuff", "changes"
- ❌ Don't combine unrelated changes in one commit
- ❌ Don't use vague descriptions

---

## GitHub Copilot Behavior Requirements

When GitHub Copilot suggests commit messages, it **MUST**:

1. **Always follow Conventional Commits format**: `<type>(<scope>): <summary>`
2. **Choose the correct type**:
   - Use `feat:` for new user-facing features
   - Use `fix:` for bug fixes
   - Use `perf:` for performance improvements
   - Use `refactor:` for code restructuring without functional changes
   - Use `docs:` for documentation-only changes
   - Use `test:` for test-only changes
   - Use `chore:` for maintenance tasks
3. **Include appropriate scope** when possible (e.g., `auth`, `api`, `ui`, `seo`)
4. **Write clear, imperative summaries** (e.g., "add feature" not "added feature")
5. **Detect breaking changes** and suggest `!` and `BREAKING CHANGE:` footer
6. **Avoid generic terms** like "update", "changes", "stuff", "WIP", "misc"
7. **Keep summary concise** (≤ 72 characters)
8. **Suggest body text** for complex changes that need explanation

### Examples of Copilot Suggestions

```bash
# When adding a new component
✅ feat(ui): add topic card hover animation

# When fixing a bug
✅ fix(comments): prevent double submission on fast clicks

# When optimizing
✅ perf(api): cache topic metadata for 5 minutes

# When restructuring code
✅ refactor(auth): extract JWT utilities to separate module

# When updating dependencies
✅ chore(deps): update next to 15.0.0
```

---

## Pull Request Title Requirements

If using **squash merge strategy**, the PR title becomes the commit message in `main`.

**PR titles MUST follow the same Conventional Commits format:**

```
feat(seo): add structured data for topics
```

The PR body can contain additional context, which will become the commit body.

---

## Integration with semantic-release

This repository uses `semantic-release` for automated versioning:

- **feat** commits → bump MINOR version (1.x.0)
- **fix** commits → bump PATCH version (1.0.x)
- **perf** commits → bump PATCH version (1.0.x)
- Commits with `!` or `BREAKING CHANGE:` → bump MAJOR version (x.0.0)
- Other types → no release

The changelog is automatically generated from commit messages, so **clear and accurate commit messages are critical**.

---

## Questions?

- Read [Conventional Commits specification](https://www.conventionalcommits.org/)
- Check [semantic-release documentation](https://semantic-release.gitbook.io/)
- When in doubt, ask the team or look at recent commit history

---

## Summary

Every commit and PR title in this repository must:

1. Follow `<type>(<scope>): <summary>` format
2. Use one of the allowed types (`feat`, `fix`, `perf`, `refactor`, `docs`, `test`, `chore`, `ci`, `build`, `style`)
3. Include scope when applicable
4. Write clear, imperative summaries
5. Mark breaking changes with `!` and `BREAKING CHANGE:` footer
6. Reference issues when applicable

**GitHub Copilot must strictly follow these rules when suggesting commits.**
