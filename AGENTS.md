# gastar-app-landing

Static landing page for Gastar (https://gastar.app): one `index.html` plus images and fonts, served by nginx from a Docker image. It links to the app at https://web.gastar.app.

## Documentation

- [docs/WORKFLOW.md](docs/WORKFLOW.md): branching, CI gate, script contract, deploy pipeline. Shared by every app repo; edit it in infra's `standards/apps/`, never here.
- [docs/deployment.md](docs/deployment.md): environments, secrets and variables, Dokploy app, rollback.
- [README.md](README.md): overview and local run.

## Stack

- Plain HTML and CSS in `index.html`, no framework and no client build step.
- `nginx:alpine` image pinned by digest (`Dockerfile`), site config in `nginx.conf`.
- Tooling only (never shipped in the image): pnpm, Prettier, ESLint with typescript-eslint, TypeScript, Playwright, husky + lint-staged.

## Rules

- Single-environment exception: this repo has only `main` and the `production` environment, no `develop` branch and no dev environment. Feature branches merge into `main` with squash; every merge to `main` deploys production. The shared workflow files stay byte-identical to the other app repos; their `develop` paths simply never fire, and `develop-only` passes with a notice.
- Files copied from infra's `standards/apps/` (`.github/**`, `.husky/pre-commit`, `.lintstagedrc.json`, `.gitattributes`, `.npmrc`, `docs/WORKFLOW.md`) are never edited here; change the template in infra and copy it to every app repo.
- The `Dockerfile` COPYs an explicit file list: a new site asset must be added there, and the e2e asset check fails until it is.
- `/health` returns `{"status":"ok","sha":"<commit>"}`, written at build time from the `GIT_SHA` build arg; the deploy waits on it. Keep it.
- Public repo: the repository is public on purpose; never commit secrets, `.env*` (except examples), user data or non-public infra hostnames/IPs, and never file vulnerabilities as public issues (`docs/deployment.md`).
- User-facing copy in Spanish (es-AR). Code, comments, commits and docs in English.
- Only integration and E2E tests (Playwright against the built image), never unit tests.

## Commands

| Command          | What it does                                                                               |
| ---------------- | ------------------------------------------------------------------------------------------ |
| `pnpm install`   | install tooling and the husky pre-commit hook                                              |
| `pnpm lint`      | `prettier --check .` and `eslint .`                                                        |
| `pnpm typecheck` | `tsc --noEmit` over the e2e specs and configs                                              |
| `pnpm build`     | `docker build -t gastar-app-landing:ci .`                                                  |
| `pnpm test:e2e`  | builds the image, runs it on http://localhost:4173 and runs the Playwright specs in `e2e/` |

Docker Desktop must be running for `build` and `test:e2e`. On Windows and macOS the e2e container can outlive the run; remove it before the next run with `docker rm -f $(docker ps -q --filter ancestor=gastar-app-landing:e2e)`.

## Before declaring work complete

- `pnpm lint`, `pnpm typecheck`, `pnpm build` and `pnpm test:e2e` exit 0.
- A visual change is checked in a browser against the built image, in light and dark themes and at phone width.
- From the infra checkout, `node scripts/check-standards.mjs --only gastar-app-landing --path <this checkout>` exits 0.
