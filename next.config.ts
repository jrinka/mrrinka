import type { NextConfig } from "next";
const config: NextConfig = {
  async redirects() {
    return ['literature', 'language-literature'].map(course => ({ source: `/io-resources/${course}-planning.html`, destination: `/practice/io-planning/${course}`, permanent: false }));
  },
  async rewrites() {
    const resourceOrigin = new URL(process.env.R2_PUBLIC_URL || "https://resources.mrrinka.com").origin;
    return [
      { source: "/recess", destination: "/recess.html" },
      // A same-origin file URL lets the browser honor the rubric link's download filename.
      {
        source: "/rubrics/uploaded/:file([0-9a-f-]{36}\\.pdf)",
        destination: `${resourceOrigin}/resources/:file`,
      },
    ];
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};
export default config;
