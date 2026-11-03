import { expect, test } from "@playwright/test";

test("home renders", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.status()).toBe(200);
  await expect(page).toHaveTitle(/Gastar/);
  await expect(page.locator("h1")).toBeVisible();
});

test("app links point to web.gastar.app", async ({ page }) => {
  await page.goto("/");
  const signup = page.getByRole("link", { name: "Crear cuenta" }).first();
  await expect(signup).toHaveAttribute("href", /^https:\/\/web\.gastar\.app\//);
  const login = page.getByRole("link", { name: "Ingresar" }).first();
  await expect(login).toHaveAttribute("href", /^https:\/\/web\.gastar\.app\//);
});

test("every asset referenced by index.html returns 200", async ({
  page,
  request,
}) => {
  await page.goto("/");
  const urls = await page.evaluate(() => {
    const refs = [
      ...Array.from(
        document.querySelectorAll("link[href]"),
        (el) => (el as HTMLLinkElement).href,
      ),
      ...Array.from(
        document.querySelectorAll("img[src], script[src], source[src]"),
        (el) => (el as HTMLImageElement).src,
      ),
    ];
    // Same-origin static assets only; page links and external URLs are not assets.
    return [...new Set(refs)].filter((u) => {
      const url = new URL(u);
      return url.origin === location.origin && url.pathname !== "/";
    });
  });
  expect(urls.length).toBeGreaterThan(0);
  for (const url of urls) {
    const res = await request.get(url);
    expect(res.status(), url).toBe(200);
  }
});

test("/health returns JSON with status ok", async ({ request }) => {
  const res = await request.get("/health");
  expect(res.status()).toBe(200);
  expect(res.headers()["content-type"]).toContain("application/json");
  const body = await res.json();
  expect(body.status).toBe("ok");
  expect(typeof body.sha).toBe("string");
});
