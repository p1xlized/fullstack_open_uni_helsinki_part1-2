// tests/blog_app.spec.js
const { test, expect, beforeEach, describe } = require("@playwright/test");

describe("Blog app (Routed E2E)", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("http://localhost:3003/api/testing/reset");
    await request.post("http://localhost:3003/api/users", {
      data: {
        username: "e2euser",
        name: "E2E Tester",
        password: "password123",
      },
    });
    await page.goto("/");
  });

  test("Login fails if the username/password is incorrect", async ({
    page,
  }) => {
    await page.getByRole("link", { name: "login" }).click();
    await page.locator('input[name="Username"]').fill("e2euser");
    await page.locator('input[name="Password"]').fill("wrong");
    await page.getByRole("button", { name: "login" }).click();

    await expect(page.getByText("Wrong username or password")).toBeVisible();
  });

  test("Login succeeds with the correct username/password combination", async ({
    page,
  }) => {
    await page.getByRole("link", { name: "login" }).click();
    await page.locator('input[name="Username"]').fill("e2euser");
    await page.locator('input[name="Password"]').fill("password123");
    await page.getByRole("button", { name: "login" }).click();

    await expect(page.getByText("E2E Tester logged in")).toBeVisible();
  });

  describe("When logged in", () => {
    beforeEach(async ({ page }) => {
      await page.getByRole("link", { name: "login" }).click();
      await page.locator('input[name="Username"]').fill("e2euser");
      await page.locator('input[name="Password"]').fill("password123");
      await page.getByRole("button", { name: "login" }).click();
    });

    test("A logged-in user can create a blog", async ({ page }) => {
      await page.getByRole("link", { name: "create new" }).click();
      await page.locator("input").nth(0).fill("Routed Flow Title");
      await page.locator("input").nth(1).fill("Router Master");
      await page.locator("input").nth(2).fill("http://routed.io");
      await page.getByRole("button", { name: "create" }).click();

      await expect(
        page.getByText("Routed Flow Title by Router Master"),
      ).toBeVisible();
    });

    test("A logged-in user can like blogs", async ({ page }) => {
      // Create it
      await page.getByRole("link", { name: "create new" }).click();
      await page.locator("input").nth(0).fill("Target Like Blog");
      await page.locator("input").nth(1).fill("Author Match");
      await page.locator("input").nth(2).fill("http://like.me");
      await page.getByRole("button", { name: "create" }).click();

      // Navigate to single page view
      await page
        .getByRole("link", { name: "Target Like Blog by Author Match" })
        .click();
      await expect(page.locator(".likes-count")).hasText("0");

      // Like it
      await page.getByRole("button", { name: "like" }).click();
      await expect(page.locator(".likes-count")).hasText("1");
    });

    test("A logged-in user can delete a blog", async ({ page }) => {
      await page.getByRole("link", { name: "create new" }).click();
      await page.locator("input").nth(0).fill("Removable Blog Item");
      await page.locator("input").nth(1).fill("Trash Bin");
      await page.locator("input").nth(2).fill("http://delete.me");
      await page.getByRole("button", { name: "create" }).click();

      await page
        .getByRole("link", { name: "Removable Blog Item by Trash Bin" })
        .click();

      page.on("dialog", async (dialog) => dialog.accept());
      await page.getByRole("button", { name: "remove" }).click();

      await expect(
        page.getByText("Removable Blog Item by Trash Bin"),
      ).not.toBeVisible();
    });
  });
});
