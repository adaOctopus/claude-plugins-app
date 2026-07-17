import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "coolplugz.com" }],
        destination: "https://www.coolplugz.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
