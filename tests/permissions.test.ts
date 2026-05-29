import { describe, expect, it } from "vitest"
import { getPermissions, getRoleGroup, hasPermission } from "@/lib/permissions"

describe("permissions", () => {
  it("maps organization roles to the intended permission groups", () => {
    expect(getRoleGroup("administrator")).toBe("super_admin")
    expect(getRoleGroup("ketua")).toBe("executive")
    expect(getRoleGroup("kepala_departemen")).toBe("reviewer")
    expect(getRoleGroup("staff")).toBe("contributor")
  })

  it("gives administrators full CMS permissions", () => {
    expect(hasPermission("administrator", "user.manage")).toBe(true)
    expect(hasPermission("administrator", "article.delete")).toBe(true)
    expect(hasPermission("administrator", "data.export")).toBe(true)
  })

  it("keeps contributors scoped to own content and uploads", () => {
    expect(getPermissions("staff")).toEqual(["article.create", "article.edit_own", "article.submit", "media.upload"])
    expect(hasPermission("staff", "article.edit_all")).toBe(false)
    expect(hasPermission("staff", "article.approve")).toBe(false)
  })

  it("lets reviewers approve articles without user or settings management", () => {
    expect(hasPermission("kepala_biro", "article.approve")).toBe(true)
    expect(hasPermission("kepala_biro", "settings.manage")).toBe(false)
    expect(hasPermission("kepala_biro", "user.manage")).toBe(false)
  })
})
