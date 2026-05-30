export const userRoles = [
  "administrator",
  "ketua",
  "wakil_ketua",
  "koordinator",
  "wakil_koordinator",
  "sekretaris",
  "bendahara",
  "kepala_departemen",
  "wakil_kepala_departemen",
  "kepala_biro",
  "wakil_kepala_biro",
  "kepala_divisi",
  "staff",
] as const

export type UserRole = (typeof userRoles)[number]

export const roleLabels: Record<UserRole, string> = {
  administrator: "Administrator",
  ketua: "Ketua",
  wakil_ketua: "Wakil Ketua",
  koordinator: "Koordinator",
  wakil_koordinator: "Wakil Koordinator",
  sekretaris: "Sekretaris",
  bendahara: "Bendahara",
  kepala_departemen: "Kepala Departemen",
  wakil_kepala_departemen: "Wakil Kepala Departemen",
  kepala_biro: "Kepala Biro",
  wakil_kepala_biro: "Wakil Kepala Biro",
  kepala_divisi: "Kepala Divisi",
  staff: "Staff",
}

export const roleGroups = {
  super_admin: ["administrator"],
  executive: ["ketua", "wakil_ketua"],
  reviewer: [
    "koordinator",
    "wakil_koordinator",
    "kepala_departemen",
    "wakil_kepala_departemen",
    "kepala_biro",
    "wakil_kepala_biro",
    "kepala_divisi",
  ],
  contributor: ["sekretaris", "bendahara", "staff"],
} as const satisfies Record<string, readonly UserRole[]>

export type RoleGroup = keyof typeof roleGroups

export type Permission =
  | "user.manage"
  | "role.manage"
  | "settings.manage"
  | "article.create"
  | "article.read_all"
  | "article.edit_own"
  | "article.edit_all"
  | "article.submit"
  | "article.review"
  | "article.approve"
  | "article.reject"
  | "article.archive"
  | "article.delete"
  | "article.restore"
  | "media.upload"
  | "media.manage"
  | "media.delete"
  | "member.manage"
  | "org_unit.manage"
  | "period.manage"
  | "data.export"

const groupPermissions = {
  super_admin: [
    "user.manage",
    "role.manage",
    "settings.manage",
    "article.create",
    "article.read_all",
    "article.edit_own",
    "article.edit_all",
    "article.submit",
    "article.review",
    "article.approve",
    "article.reject",
    "article.archive",
    "article.delete",
    "article.restore",
    "media.upload",
    "media.manage",
    "media.delete",
    "member.manage",
    "org_unit.manage",
    "period.manage",
    "data.export",
  ],
  executive: [
    "settings.manage",
    "article.create",
    "article.read_all",
    "article.edit_own",
    "article.edit_all",
    "article.submit",
    "article.review",
    "article.approve",
    "article.reject",
    "article.archive",
    "media.upload",
    "media.manage",
    "member.manage",
    "org_unit.manage",
    "period.manage",
    "data.export",
  ],
  reviewer: [
    "article.create",
    "article.read_all",
    "article.edit_own",
    "article.submit",
    "article.review",
    "article.approve",
    "article.reject",
    "media.upload",
    "media.manage",
  ],
  contributor: ["article.create", "article.edit_own", "article.submit", "media.upload"],
} as const satisfies Record<RoleGroup, readonly Permission[]>

export function getRoleGroup(role: UserRole): RoleGroup {
  const group = (Object.entries(roleGroups) as Array<[RoleGroup, readonly UserRole[]]>).find(([, roles]) => roles.includes(role))

  return (group?.[0] as RoleGroup | undefined) ?? "contributor"
}

export function getPermissions(role: UserRole) {
  return groupPermissions[getRoleGroup(role)]
}

export function hasPermission(role: UserRole, permission: Permission) {
  const permissions: readonly Permission[] = getPermissions(role)

  return permissions.includes(permission)
}
