import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow:     "/",
        disallow:  ["/admin", "/admin/", "/api/", "/login"],
      },
    ],
    sitemap: "https://kidslab.lk/sitemap.xml",
    host:    "https://kidslab.lk",
  };
}
