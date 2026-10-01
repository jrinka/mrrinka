import type { NextConfig } from "next";
const config: NextConfig = {
  async redirects() {
    return ['literature', 'language-literature'].map(course => ({ source: `/io-resources/${course}-planning.html`, destination: `/practice/io-planning/${course}`, permanent: false }));
  },
  async rewrites() {
    return [{ source: "/recess", destination: "/recess.html" }];
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
