# Gastar landing

Static landing page for Gastar (https://gastar.app), which links to the app at https://web.gastar.app.

Run locally:

```sh
docker build -t gastar-landing .
docker run --rm -p 8080:80 gastar-landing
```

Deploys via Dokploy to gastar.app.

## Deploy

Pushing to `main` builds the image, publishes it to `ghcr.io/mvalles02/gastar-app-landing` and triggers the Dokploy deploy webhook through Cloudflare Access. Required repo secrets: `DOKPLOY_WEBHOOK_URL`, `CF_ACCESS_CLIENT_ID`, `CF_ACCESS_CLIENT_SECRET`.
