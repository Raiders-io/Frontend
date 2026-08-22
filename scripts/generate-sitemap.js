import fs from "node:fs"
import path from "node:path"

const siteUrl = "https://raiders.io"
const routerFilePath = path.resolve(process.cwd(), "src/utils/router/index.tsx")
const source = fs.readFileSync(routerFilePath, "utf8")

const routes = [
  ...new Set(
    Array.from(source.matchAll(/path\s*:\s*['"`]([^'"`]+)['"`]/g))
      .map((match) => match[1])
      .filter((route) => route && !route.includes(":") && route !== "*"),
  ),
]

const outputDir = path.resolve(process.cwd(), "public")
fs.mkdirSync(outputDir, { recursive: true })

const today = new Date().toISOString().split("T")[0]

// Source : https://www.sitemaps.org/protocol.html
// Source : https://www.webrankinfo.com/dossiers/sitemaps/tutoriel-fichier-sitemap

// Generate sitemap.xml content
// Priority is ignored by search engines, but we include it for completeness
// Change frequency is also ignored by search engines
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `  <url>
    <loc>${siteUrl}${route}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>always</changefreq>
    <priority>0.8</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`

const outputPath = path.join(outputDir, "sitemap.xml")
fs.writeFileSync(outputPath, sitemap, "utf8")
console.log(`Sitemap generated: ${outputPath} (${routes.length} URLs)`)
