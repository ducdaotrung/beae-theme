# Theme Development Workflow

## Environment

- Development store: `beae-duc-k4mqivfe.myshopify.com`
- Git repository: `https://github.com/ducdaotrung/beae-theme.git`
- Shopify CLI version: `3.91.1`
- Shopify MCP: Not yet verified

## Shopify Theme Mapping

| Git branch | Shopify theme | Theme ID | Role |
|---|---|---:|---|
| `main` | `beae-theme/main` | `156415033536` | Unpublished |
| `dev`  | `beae-theme/dev`  | `156468314304` | Development |

Never use the production store or publish a live theme during development.

## Branch Rules

- All development must happen on `dev`.
- Always run `git branch --show-current` before editing or writing to Shopify.
- Never commit directly to `main`.
- Never develop directly on `main`.
- `main` only receives reviewed and verified changes from `dev`.
- Do not commit credentials, tokens, passwords, API keys, or other secrets.
- Before any Shopify write, verify the current store, theme, and Git branch.

## Daily Workflow

All development must be performed on the `dev` branch. Never develop, commit, or deploy from `main`.

Before starting work:

```bash
git checkout dev
git pull origin dev
git status
git branch --show-current
```

The current branch must be `dev`.

During development, make all code changes locally on the `dev` branch.

Start the Shopify development server:

```bash
shopify theme dev \
  --store beae-duc-k4mqivfe.myshopify.com \
  --theme 156468314304 \
  --open
```

Use `beae-theme/dev` (`156468314304`) for local preview, Shopify Theme Editor preview, and testing. Never use or publish the `main` theme during normal development.

Before review, verify all three preview outputs:

- Local preview URL
- Shopify Theme Editor preview
- Theme preview link

Never run the preview command against the `main` theme during daily development.

Before committing any changes, validate the code:

```bash
shopify theme check
git diff --check
git diff
git status
```

Fix all relevant Theme Check errors and warnings before committing. Review the Git diff carefully and make sure no credentials, tokens, passwords, API keys, or other secrets are included.

After the changes have been tested and verified:

```bash
git add .
git commit -m "Describe the change"
git push origin dev
```

All development commits must be pushed to `origin/dev`.

Before promoting `dev` to `main`, make sure all changes have been tested and verified on the `dev` branch.

Check whether `main` has received new commits:

```bash
git fetch origin
git checkout dev
git pull origin dev
git merge origin/main
```

If conflicts occur, resolve them on `dev`. After resolving conflicts, run the validation and preview again:

```bash
shopify theme check
git diff --check
shopify theme dev \
  --store beae-duc-k4mqivfe.myshopify.com \
  --theme 156468314304 \
  --open
```

Once `dev` is fully verified, promote it to `main`:

```bash
git checkout main
git pull origin main
git merge dev
git push origin main
```

Do not make additional development changes directly on `main`.

After the promotion is complete, verify that both branches point to the same commit:

```bash
git fetch origin
git rev-parse main
git rev-parse dev
git rev-parse origin/dev
git rev-parse origin/main
```

After a successful `dev` to `main` promotion, `main`, `dev`, `origin/dev`, and `origin/main` must point to the same commit.

Before any Shopify operation that writes, uploads, modifies, or publishes theme files, always verify the current Git branch, Shopify store, Shopify theme, and Theme ID.

Normal development must never modify or publish the live storefront. The Shopify `main` theme must remain unpublished unless deployment to the live storefront has been explicitly approved.
