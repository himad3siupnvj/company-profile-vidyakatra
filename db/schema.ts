import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core"

export const articleStatus = pgEnum("article_status", ["draft", "published", "archived"])
export const eventStatus = pgEnum("event_status", ["upcoming", "ongoing", "completed", "cancelled"])
export const mediaType = pgEnum("media_type", ["image", "video"])
export const userRole = pgEnum("user_role", ["super_admin", "media_admin", "secretary_admin"])
export const userStatus = pgEnum("user_status", ["active", "inactive"])

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 160 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    passwordHash: text("password_hash").notNull(),
    role: userRole("role").notNull().default("media_admin"),
    status: userStatus("status").notNull().default("active"),
    avatarUrl: text("avatar_url"),
    lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [uniqueIndex("users_email_idx").on(table.email)]
)

export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 120 }).notNull().unique(),
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
})

export const departments = pgTable("departments", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  description: text("description"),
  color: varchar("color", { length: 80 }),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
})

export const members = pgTable("members", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  position: varchar("position", { length: 160 }).notNull(),
  departmentId: integer("department_id").references(() => departments.id, { onDelete: "set null" }),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 40 }),
  avatarUrl: text("avatar_url"),
  quote: text("quote"),
  isActive: boolean("is_active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  joinedAt: timestamp("joined_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
})

export const articles = pgTable(
  "articles",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 220 }).notNull(),
    slug: varchar("slug", { length: 260 }).notNull(),
    excerpt: text("excerpt"),
    content: text("content").notNull(),
    category: varchar("category", { length: 80 }).notNull(),
    status: articleStatus("status").notNull().default("draft"),
    authorId: integer("author_id").references(() => users.id, { onDelete: "set null" }),
    thumbnailUrl: text("thumbnail_url"),
    readTime: varchar("read_time", { length: 40 }),
    views: integer("views").notNull().default(0),
    isFeatured: boolean("is_featured").notNull().default(false),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [uniqueIndex("articles_slug_idx").on(table.slug)]
)

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 220 }).notNull(),
  description: text("description"),
  eventDate: timestamp("event_date", { withTimezone: true }).notNull(),
  location: text("location"),
  category: varchar("category", { length: 80 }).notNull(),
  status: eventStatus("status").notNull().default("upcoming"),
  registrations: integer("registrations").notNull().default(0),
  maxParticipants: integer("max_participants"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
})

export const albums = pgTable("albums", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 180 }).notNull(),
  description: text("description"),
  coverImageUrl: text("cover_image_url"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
})

export const media = pgTable("media", {
  id: serial("id").primaryKey(),
  albumId: integer("album_id").references(() => albums.id, { onDelete: "set null" }),
  name: varchar("name", { length: 220 }).notNull(),
  url: text("url").notNull(),
  type: mediaType("type").notNull().default("image"),
  sizeBytes: integer("size_bytes"),
  altText: text("alt_text"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
})

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  subject: varchar("subject", { length: 220 }).notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
})
