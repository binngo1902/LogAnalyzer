import type { MetadataRoute } from "next"

import { blogPosts } from "./insights/data"

const baseUrl = "https://www.logfile.online"

export const dynamic = "force-static"
export const revalidate = false

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${baseUrl}/analyzer`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/insights`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ]

  const dynamicRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/insights/${post.id}`,
    lastModified: new Date(post.publishDate),
    changeFrequency: "weekly",
    priority: 0.7,
  }))

  return [...staticRoutes, ...dynamicRoutes]
}
