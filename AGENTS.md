# Theme Development Workflow

## Repository and Environment

- This repository is the single source of truth for the base theme.
- Git repository: `https://github.com/ducdaotrung/beae-theme.git`
- Development store: `beae-duc-k4mqivfe.myshopify.com`
- Shopify CLI version: `3.91.1`
- Shopify MCP: Verified

## Shopify Themes

| Shopify theme | Theme ID | Role |
|---|---:|---|
| `Development (2a30b9-Duc)` | `156468314304` | Development, preview and Theme Editor testing |
| `beae-theme/main` | `156415033536` | Optional release target, unpublished by default |

Use the development theme for normal work. Never publish a live theme during development.

## Git Rules

- Use `main` as the only Git branch for this base-theme repository; do not create or require a separate `dev` branch.
- Do not switch branches as part of the normal development workflow; all development happens directly on `main`.
- Confirm that the current branch is `main` with `git branch --show-current` before editing or writing to Shopify.
- Keep the working tree reviewable and do not commit credentials, tokens, passwords, API keys or other secrets.
- Push reviewed changes to the repository's configured remote branch.

## Daily Workflow

Before starting work:

```bash
git status
git branch --show-current
```

Make and review code changes locally in the current repository branch.

Before any Shopify write, verify the current branch, store and target theme. Use the development theme by default:

```bash
git branch --show-current
shopify theme info \
  --store beae-duc-k4mqivfe.myshopify.com \
  --theme 156468314304
```

Start the development preview with:

```bash
shopify theme dev \
  --store beae-duc-k4mqivfe.myshopify.com \
  --theme 156468314304 \
  --open
```

Before committing, validate and review:

```bash
shopify theme check
git diff --check
git diff
git status
```

Stage only reviewed files, then commit and push to the configured remote branch:

```bash
git add <reviewed-files>
git commit -m "Describe the change"
git push origin main
```

## Optional Release Sync

The Shopify main theme is not part of the normal development loop. When a reviewed snapshot must be released, verify the store, theme ID and current branch again, then push explicitly to the unpublished release theme:

```bash
git branch --show-current
shopify theme info \
  --store beae-duc-k4mqivfe.myshopify.com \
  --theme 156415033536
shopify theme push \
  --store beae-duc-k4mqivfe.myshopify.com \
  --theme 156415033536
```

Do not publish the release theme unless live deployment has been explicitly approved.

## Preview and Release Checks

Before considering a change complete:

- Confirm the local preview URL works while checked out on `main`.
- Confirm the Shopify Theme Editor preview works on the development theme.
- Confirm the development theme preview link works.
- Confirm `shopify theme check` and `git diff --check` pass.
- Review the final diff and verify that no secrets or unrelated files are included.

The repository and development theme are the canonical working state. The optional release theme remains unpublished unless deployment is explicitly approved.
