/** @type {import('next').NextConfig} */
const remoteImageHostnames = [
  process.env.SUPABASE_URL,
  "https://images.unsplash.com",
]
  .filter(Boolean)
  .map((url) => {
    try {
      return new URL(url).hostname
    } catch {
      return null
    }
  })
  .filter(Boolean)

const nextConfig = {
  images: {
    remotePatterns: remoteImageHostnames.map((hostname) => ({
      protocol: "https",
      hostname,
    })),
  },
}

export default nextConfig
