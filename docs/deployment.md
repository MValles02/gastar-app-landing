# Deployment

Generic pipeline: [WORKFLOW.md](WORKFLOW.md). This file holds what is specific to the landing.

## Environments

| Environment  | Branch | URL                                       | Image tag                                     |
| ------------ | ------ | ----------------------------------------- | --------------------------------------------- |
| `production` | `main` | https://gastar.app (and `www.gastar.app`) | `ghcr.io/mvalles02/gastar-app-landing:latest` |

This is the single-environment app repo: there is no `develop` branch and no development environment. A push to `main` (markdown-only commits excluded) builds the image, publishes it and redeploys production.

## Secrets and variables

| Where                           | Name                                             | Value                                                                                           |
| ------------------------------- | ------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| Environment `production` secret | `DOKPLOY_WEBHOOK_URL`                            | Dokploy deploy webhook of the landing app                                                       |
| Environment `production` secret | `CF_ACCESS_CLIENT_ID`, `CF_ACCESS_CLIENT_SECRET` | Cloudflare Access service token `gastar-app-landing-deploy` (see infra `docs/access-tokens.md`) |
| Repository variable             | `HEALTH_URL`                                     | `https://gastar.app/health`                                                                     |

No secrets at repository level. `BUILD_ARGS` is not used: the image only takes `GIT_SHA`, which the workflow always passes.

## Public repository

This repository is public on purpose and stays public. That means:

- Never commit secrets, `.env*` files (except examples), user data, or VPS IPs, hostnames and internal URLs that are not already public. Secrets live only in GitHub Actions secrets and Dokploy.
- PRs from forks run CI without secrets; deploys run only on pushes to `main`.
- A `pull_request_target` workflow never checks out or runs PR code (`auto-merge.yml` has no checkout step).
- Report vulnerabilities privately (a GitHub security advisory), never as a public issue with exploit detail.

## Dokploy

- App `gastarapp-landing-rx1bqj`, source type Docker, image `ghcr.io/mvalles02/gastar-app-landing:latest`, domains `gastar.app` and `www.gastar.app`.
- Nothing is built on the VPS: Dokploy pulls the image that CI published.
- The container HEALTHCHECK requests `/`; the deploy job waits until `HEALTH_URL` reports `{"status":"ok","sha":"<pushed commit>"}`, then smoke-tests the home page.

## Rollback

Every build is also tagged `sha-<short>` in GHCR and those tags are never deleted. To roll back, set the Dokploy app's image to `ghcr.io/mvalles02/gastar-app-landing:sha-<short>` of a previous good commit and redeploy, then confirm `https://gastar.app/health` reports that sha. Switch the image back to `:latest` once the fix is merged to `main` (or revert the bad commit on `main`, which redeploys through the normal pipeline).
