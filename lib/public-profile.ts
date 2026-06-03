import { asc, eq, isNull } from "drizzle-orm"
import { unstable_cache } from "next/cache"
import { getDb } from "@/db"
import { members, organizationalUnits } from "@/db/schema"
import { slugify } from "@/lib/article-content"
import { publicCacheTags } from "@/lib/cache-tags"
import { workUnits, type WorkUnit } from "@/lib/public-content"

const fallbackBySlug = new Map(workUnits.map((unit) => [unit.slug, unit]))
const fallbackUnit = workUnits[0]

export const getPublicWorkUnits = unstable_cache(
  async function getPublicWorkUnits(): Promise<WorkUnit[]> {
    try {
      const db = getDb()
      const units = await db
        .select()
        .from(organizationalUnits)
        .where(isNull(organizationalUnits.deletedAt))
        .orderBy(asc(organizationalUnits.sortOrder), asc(organizationalUnits.name))
      const unitMembers = await db
        .select({
          id: members.id,
          name: members.name,
          position: members.position,
          organizationalUnitId: members.organizationalUnitId,
          avatarUrl: members.avatarUrl,
        })
        .from(members)
        .where(isNull(members.deletedAt))
        .orderBy(asc(members.sortOrder), asc(members.name))

      if (!units.length) return workUnits

      return units.map((unit) => {
        const slug = slugify(unit.name)
        const fallback = fallbackBySlug.get(slug) ?? fallbackUnit
        const mappedMembers = unitMembers
          .filter((member) => member.organizationalUnitId === unit.id)
          .map((member, index) => ({
            name: member.name,
            role: member.position,
            image: member.avatarUrl || fallback.members[index % fallback.members.length]?.image || "/placeholder-user.jpg",
          }))

        return {
          slug,
          type: unit.type === "bureau" ? "Biro" : "Departemen",
          name: unit.name,
          description: unit.description ?? fallback.description,
          logo: fallback.logo,
          programs: fallback.programs,
          members: mappedMembers.length ? mappedMembers : fallback.members,
          workPrograms: fallback.workPrograms,
        }
      })
    } catch {
      return workUnits
    }
  },
  ["public-work-units"],
  { revalidate: 3600, tags: [publicCacheTags.profile] },
)
