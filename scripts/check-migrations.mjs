import { existsSync, readFileSync } from "node:fs"
import { resolve } from "node:path"
import { stdout } from "node:process"

const migrationDir = resolve("db/migrations")
const journalPath = resolve(migrationDir, "meta/_journal.json")

if (!existsSync(journalPath)) {
  throw new Error("Migration journal is missing")
}

const journal = JSON.parse(readFileSync(journalPath, "utf8"))
const seenTags = new Set()

for (const [position, entry] of journal.entries.entries()) {
  if (entry.idx !== position) {
    throw new Error(`Migration index ${entry.idx} is out of order at position ${position}`)
  }

  if (seenTags.has(entry.tag)) {
    throw new Error(`Duplicate migration tag: ${entry.tag}`)
  }

  seenTags.add(entry.tag)
  const sqlPath = resolve(migrationDir, `${entry.tag}.sql`)
  const snapshotPath = resolve(migrationDir, `meta/${String(entry.idx).padStart(4, "0")}_snapshot.json`)

  if (!existsSync(sqlPath)) {
    throw new Error(`Missing SQL file for ${entry.tag}`)
  }

  if (!existsSync(snapshotPath)) {
    throw new Error(`Missing schema snapshot for ${entry.tag}`)
  }

  if (!readFileSync(sqlPath, "utf8").trim()) {
    throw new Error(`Migration SQL is empty for ${entry.tag}`)
  }
}

stdout.write(`Migration chain is consistent (${journal.entries.length} migrations).\n`)
