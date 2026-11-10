import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.BASE_URL ?? "http://127.0.0.1:3000/mdtg/";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,

  reporter: "list",

  use: {
    baseURL,
    trace: "retain-on-failure",
  },

  projects: [
    {
      name: "Chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
    {
      name: "Firefox",
      use: {
        ...devices["Desktop Firefox"],
      },
    },
  ],
});
