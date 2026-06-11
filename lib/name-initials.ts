export function getFirstNameInitial(name: string, fallback = "A") {
  const firstName = name.trim().split(/\s+/)[0]
  return firstName?.charAt(0).toUpperCase() || fallback
}
