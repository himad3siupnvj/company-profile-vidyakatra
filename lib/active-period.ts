import { eq } from "drizzle-orm"
import { getDb } from "@/db"
import { periods } from "@/db/schema"

export async function getActivePeriodId() {
  const db = getDb()
  const [activePeriod] = await db
    .select({ id: periods.id })
    .from(periods)
    .where(eq(periods.status, "active"))
    .limit(1)

  return activePeriod?.id ?? null
}
