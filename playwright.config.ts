import { defineConfig, devices } from "@playwright/test"
import fs from "node:fs"
import path from "node:path"

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000"

function loadLocalEnv() {
  const envPath = path.join(__dirname, ".env")

  if (!fs.existsSync(envPath)) return

  const content = fs.readFileSync(envPath, "utf8")

  for (const line of content.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/)
    if (!match) continue

    const [, key, rawValue] = match
    const value = rawValue.replace(/^["']|["']$/g, "")

    process.env[key] = value
  }
}

loadLocalEnv()

export default defineConfig({
  testDir: "./e2e",
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  webServer: {
    command: "corepack pnpm dev",
    url: baseURL,
    reuseExistingServer: true,
    timeout: 120_000,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
})
