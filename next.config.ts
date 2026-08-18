import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/hubfs/:path*",
        destination: "https://www.undividedre.com/hubfs/:path*",
      },
      {
        source: "/hs-fs/:path*",
        destination: "https://www.undividedre.com/hs-fs/:path*",
      },
      {
        source: "/hs/:path*",
        destination: "https://www.undividedre.com/hs/:path*",
      },
      {
        source: "/_hcms/:path*",
        destination: "https://www.undividedre.com/_hcms/:path*",
      },
    ];
  },
};

export default nextConfig;
