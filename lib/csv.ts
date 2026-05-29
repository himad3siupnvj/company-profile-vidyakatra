export function toCsv(rows: Array<Record<string, unknown>>) {
  if (!rows.length) return ""

  const headers = Object.keys(rows[0])
  const escapeCell = (value: unknown) => {
    const text = value instanceof Date ? value.toISOString() : String(value ?? "")
    const escaped = text.replace(/"/g, '""')

    return /[",\r\n]/.test(escaped) ? `"${escaped}"` : escaped
  }

  return [
    headers.join(","),
    ...rows.map((row) => headers.map((header) => escapeCell(row[header])).join(",")),
  ].join("\r\n")
}
