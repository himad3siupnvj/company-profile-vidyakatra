import type { UserRole } from "@/lib/permissions"

export type UserStatus = "unclaimed" | "active" | "inactive"
export type PeriodStatus = "upcoming" | "active" | "archived"
export type OrgUnitType = "department" | "bureau"
export type ArticleStatus =
  | "draft"
  | "submitted"
  | "approved"
  | "rejected"
  | "published"
  | "archived"

export type BaseRecord = {
  id: string
  createdAt: Date
  updatedAt: Date
}

export type Period = BaseRecord & {
  name: string
  status: PeriodStatus
  startDate: string | null
  endDate: string | null
}

export type Member = BaseRecord & {
  name: string
  position: string
  organizationalUnitId: string | null
  divisionId: string | null
  periodId: string | null
  email: string | null
  avatarUrl: string | null
  sortOrder: number
  joinedAt: Date | null
  deletedAt: Date | null
  deletedBy: string | null
}

export type CmsUser = BaseRecord & {
  name: string
  email: string
  passwordHash: string | null
  claimCode: string | null
  role: UserRole
  status: UserStatus
  memberId: string | null
  periodId: string | null
  lastLoginAt: Date | null
  claimedAt: Date | null
}

export type OrganizationalUnit = BaseRecord & {
  name: string
  type: OrgUnitType
  periodId: string | null
  description: string | null
  imageUrl: string | null
  color: string | null
  sortOrder: number
  deletedAt: Date | null
  deletedBy: string | null
}

export type Division = BaseRecord & {
  name: string
  organizationalUnitId: string | null
  periodId: string | null
  description: string | null
  sortOrder: number
  deletedAt: Date | null
  deletedBy: string | null
}

export type ArticleCategory = BaseRecord & {
  name: string
  slug: string
  description: string | null
  deletedAt: Date | null
  deletedBy: string | null
}

export type Article = BaseRecord & {
  title: string
  slug: string
  excerpt: string | null
  content: unknown
  categoryId: string | null
  status: ArticleStatus
  authorId: string | null
  authorName: string | null
  reviewerId: string | null
  organizationalUnitId: string | null
  divisionId: string | null
  periodId: string | null
  thumbnailUrl: string | null
  thumbnailAlt: string | null
  seoTitle: string | null
  seoDescription: string | null
  canonicalUrl: string | null
  ogImageUrl: string | null
  readTime: string | null
  views: number
  isFeatured: boolean
  rejectedNote: string | null
  publishedAt: Date | null
  deletedAt: Date | null
  deletedBy: string | null
}
