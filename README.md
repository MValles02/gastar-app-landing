# Gastar landing

Static landing page for Gastar (https://gastar.app), which links to the app at https://web.gastar.app. The site is `index.html` plus images and fonts, served by nginx from a Docker image.

## Run locally

```sh
docker build -t gastar-landing .
docker run --rm -p 8080:80 gastar-landing
```

Then open http://localhost:8080. `/health` returns `{"status":"ok","sha":"dev"}` for a local build.

## Develop

```sh
pnpm install
pnpm lint
pnpm typecheck
pnpm build
pnpm test:e2e
```

`build` and `test:e2e` need Docker. The Playwright specs in `e2e/` run against the built image. See [AGENTS.md](AGENTS.md) for the rules and [docs/WORKFLOW.md](docs/WORKFLOW.md) for branching and CI.

## Deploy

Merging to `main` builds the image, publishes it to `ghcr.io/mvalles02/gastar-app-landing` and triggers the Dokploy deploy webhook through Cloudflare Access, using the secrets of the `production` GitHub environment. The deploy job then waits until `HEALTH_URL=https://gastar.app/health` reports the new commit sha. Details in [docs/deployment.md](docs/deployment.md).

The Dockerfile COPYs an explicit file list, so new site assets must be added there.
