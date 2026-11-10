import { expect, test } from "@playwright/test";

test.describe("Route: /", () => {
  const route = ".";

  test.describe("Page response", () => {
    test("loads successfully", async ({ page }) => {
      const response = await page.goto(route);
      expect(response?.status()).toBeLessThan(400);
    });
  });

  test.describe("Headings", () => {
    test("renders the page title", async ({ page }) => {
      const response = await page.goto(route);
      expect(response?.status()).toBeLessThan(400);

      await expect(page.getByRole("heading", { level: 1, name: /^MDTG$/ })).toBeVisible();
    });
  });
});

test.describe("Route: docs/intro", () => {
  const route = "docs/intro";

  test.describe("Page response", () => {
    test("loads successfully", async ({ page }) => {
      const response = await page.goto(route);
      expect(response?.status()).toBeLessThan(400);
    });
  });

  test.describe("Headings", () => {
    test("renders the documented section headings", async ({ page }) => {
      const response = await page.goto(route);
      expect(response?.status()).toBeLessThan(400);

      await expect(page.getByRole("heading", { level: 1, name: /^MDTG/ })).toBeVisible();
      await expect(page.getByRole("heading", { level: 2, name: /^Install/ })).toBeVisible();
      await expect(page.getByRole("heading", { level: 2, name: /^Quick start/ })).toBeVisible();
      await expect(page.getByRole("heading", { level: 2, name: /^Documentation/ })).toBeVisible();
    });
  });
});

test.describe("Route: docs/api/date-api", () => {
  const route = "docs/api/date-api";

  test.describe("Page response", () => {
    test("loads successfully", async ({ page }) => {
      const response = await page.goto(route);
      expect(response?.status()).toBeLessThan(400);
    });
  });

  test.describe("Headings", () => {
    test("renders the API headings", async ({ page }) => {
      const response = await page.goto(route);
      expect(response?.status()).toBeLessThan(400);

      await expect(page.getByRole("heading", { level: 1, name: /^Date API/ })).toBeVisible();
      await expect(
        page.getByRole("heading", {
          level: 2,
          name: /^formatMDTG\(date, options\)/,
        }),
      ).toBeVisible();
      await expect(
        page.getByRole("heading", {
          level: 2,
          name: /^parseMDTG\(value, options\)/,
        }),
      ).toBeVisible();
    });
  });
});

test.describe("Route: docs/api/temporal-api", () => {
  const route = "docs/api/temporal-api";

  test.describe("Page response", () => {
    test("loads successfully", async ({ page }) => {
      const response = await page.goto(route);
      expect(response?.status()).toBeLessThan(400);
    });
  });

  test.describe("Headings", () => {
    test("renders the Temporal API headings", async ({ page }) => {
      const response = await page.goto(route);
      expect(response?.status()).toBeLessThan(400);

      await expect(page.getByRole("heading", { level: 1, name: /^Temporal API/ })).toBeVisible();
      await expect(
        page.getByRole("heading", {
          level: 2,
          name: /^formatTemporalMDTG\(value, options\)/,
        }),
      ).toBeVisible();
      await expect(
        page.getByRole("heading", {
          level: 2,
          name: /^parseTemporalMDTG\(value, options\)/,
        }),
      ).toBeVisible();
    });
  });
});

test.describe("Route: docs/api/format-checks", () => {
  const route = "docs/api/format-checks";

  test.describe("Page response", () => {
    test("loads successfully", async ({ page }) => {
      const response = await page.goto(route);
      expect(response?.status()).toBeLessThan(400);
    });
  });

  test.describe("Headings", () => {
    test("renders the page title", async ({ page }) => {
      const response = await page.goto(route);
      expect(response?.status()).toBeLessThan(400);

      await expect(page.getByRole("heading", { level: 1, name: /^Format checks/ })).toBeVisible();
    });
  });
});

test.describe("Styling", () => {
  test.describe("Colors", () => {
    test.describe("Light mode", () => {
      test("uses the configured green primary palette", async ({ page }) => {
        await page.emulateMedia({ colorScheme: "light" });
        await page.goto("docs/intro");

        const palette = await page.locator("html").evaluate((element) => {
          const styles = getComputedStyle(element);

          return {
            primary: styles.getPropertyValue("--ifm-color-primary").trim(),
            dark: styles.getPropertyValue("--ifm-color-primary-dark").trim(),
            darker: styles.getPropertyValue("--ifm-color-primary-darker").trim(),
            darkest: styles.getPropertyValue("--ifm-color-primary-darkest").trim(),
            light: styles.getPropertyValue("--ifm-color-primary-light").trim(),
            lighter: styles.getPropertyValue("--ifm-color-primary-lighter").trim(),
            lightest: styles.getPropertyValue("--ifm-color-primary-lightest").trim(),
          };
        });

        expect(palette).toEqual({
          primary: "#2e8555",
          dark: "#29784c",
          darker: "#277148",
          darkest: "#205d3b",
          light: "#33925d",
          lighter: "#359962",
          lightest: "#3cad6e",
        });
        await expect(
          page.getByRole("link", {
            name: "military date-time groups",
            exact: true,
          }),
        ).toHaveCSS("color", "rgb(46, 133, 85)");
      });
    });

    test.describe("Dark mode", () => {
      test("uses the configured teal primary palette", async ({ page }) => {
        await page.emulateMedia({ colorScheme: "dark" });
        await page.goto("docs/intro");

        const palette = await page.locator("html").evaluate((element) => {
          const styles = getComputedStyle(element);

          return {
            primary: styles.getPropertyValue("--ifm-color-primary").trim(),
            dark: styles.getPropertyValue("--ifm-color-primary-dark").trim(),
            darker: styles.getPropertyValue("--ifm-color-primary-darker").trim(),
            darkest: styles.getPropertyValue("--ifm-color-primary-darkest").trim(),
            light: styles.getPropertyValue("--ifm-color-primary-light").trim(),
            lighter: styles.getPropertyValue("--ifm-color-primary-lighter").trim(),
            lightest: styles.getPropertyValue("--ifm-color-primary-lightest").trim(),
          };
        });

        expect(palette).toEqual({
          primary: "#25c2a0",
          dark: "#21af90",
          darker: "#1fa588",
          darkest: "#1a8870",
          light: "#29d5b0",
          lighter: "#32d8b4",
          lightest: "#4fddbf",
        });
        await expect(
          page.getByRole("link", {
            name: "military date-time groups",
            exact: true,
          }),
        ).toHaveCSS("color", "rgb(37, 194, 160)");
      });
    });
  });
});
