import { defineConfig, devices } from "@playwright/test";

// The e2e suite runs against the production image (nginx), not a dev server.
export default defineConfig({
  testDir: "e2e",
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: "http://localhost:4173",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command:
      "docker build -t gastar-app-landing:e2e . && docker run --rm -p 4173:80 gastar-app-landing:e2e",
    url: "http://localhost:4173/health",
    // Never reuse: a container left from an earlier run would serve a stale image.
    reuseExistingServer: false,
    timeout: 180_000,
  },
});
