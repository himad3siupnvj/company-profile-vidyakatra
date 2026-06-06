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
  serverExternalPackages: ["@napi-rs/canvas", "pdf-parse", "pdfjs-dist"],
  outputFileTracingIncludes: {
    "/api/admin/articles/generate": [
      "./node_modules/@napi-rs/canvas/**/*",
      "./node_modules/@napi-rs/canvas-linux-x64-gnu/**/*",
      "./node_modules/pdf-parse/**/*",
      "./node_modules/pdfjs-dist/**/*",
    ],
  },
  images: {
    remotePatterns: remoteImageHostnames.map((hostname) => ({
      protocol: "https",
      hostname,
    })),
  },
}

export default nextConfig
