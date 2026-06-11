import { expect, test } from "@playwright/test"
import fs from "node:fs"
import path from "node:path"

function readLocalEnv(key: string) {
  const envPath = path.join(process.cwd(), ".env")
  if (!fs.existsSync(envPath)) return process.env[key]

  const line = fs
    .readFileSync(envPath, "utf8")
    .split(/\r?\n/)
    .find((entry) => entry.startsWith(`${key}=`))

  return line?.slice(key.length + 1).replace(/^["']|["']$/g, "") ?? process.env[key]
}

const adminEmail = readLocalEnv("E2E_ADMIN_EMAIL")
const adminPassword = readLocalEnv("E2E_ADMIN_PASSWORD")

test.describe("published article flow", () => {
  test.skip(!adminEmail || !adminPassword, "Set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD to run this flow.")

  test("logs in, publishes an article, and renders it publicly", async ({ page }) => {
    test.setTimeout(120_000)

    const suffix = Date.now()
    const title = `E2E Published Article ${suffix}`
    let createdArticleId: string | null = null

    await page.goto("/x-panel/login")
    await expect(page.locator("form[data-client-ready='true']")).toBeVisible()
    await page.getByLabel("Email").fill(adminEmail!)
    await page.getByLabel("Password").fill(adminPassword!)
    const loginResponsePromise = page.waitForResponse(
      (response) =>
        response.request().method() === "POST" &&
        new URL(response.url()).pathname === "/api/auth/login",
    )
    await page.getByLabel("Password").press("Enter")
    const loginResponse = await loginResponsePromise
    expect(loginResponse.ok()).toBe(true)

    const sessionResponse = await page.request.get("/api/auth/me")
    expect(sessionResponse.ok(), await sessionResponse.text()).toBe(true)
    await expect(page).toHaveURL(/\/x-panel\/?$/)

    const createResponse = await page.request.post("/api/admin/articles", {
      data: {
        title,
        excerpt: "Artikel otomatis untuk memastikan flow publish tampil di public.",
        category: "berita",
        author: "Tim E2E",
        featured: false,
        content: {
          type: "doc",
          content: [
            {
              id: "e2e-paragraph",
              type: "paragraph",
              text: "Konten ini dibuat dari Playwright dan harus terlihat di halaman detail public.",
            },
          ],
        },
      },
    })
    expect(createResponse.ok(), await createResponse.text()).toBe(true)
    const createBody = await createResponse.json()
    createdArticleId = createBody.article.id
    const slug = createBody.article.slug

    try {
      const submitResponse = await page.request.patch("/api/admin/articles/status", {
        data: { id: createdArticleId, action: "submit" },
      })
      expect(submitResponse.ok(), await submitResponse.text()).toBe(true)

      const approveResponse = await page.request.patch("/api/admin/articles/status", {
        data: { id: createdArticleId, action: "approve" },
      })
      expect(approveResponse.ok(), await approveResponse.text()).toBe(true)

      await page.goto("/berita")
      await page.getByPlaceholder("Cari berita acara...").fill(title)
      await expect(page.getByRole("heading", { name: title })).toBeVisible()

      await page.goto(`/berita/${slug}`)
      await expect(page.getByRole("heading", { name: title })).toBeVisible()
      await expect(page.getByText("Konten ini dibuat dari Playwright")).toBeVisible()
    } finally {
      if (createdArticleId) {
        await page.request.delete(`/api/admin/articles?id=${createdArticleId}`).catch(() => undefined)
      }
    }
  })
})
