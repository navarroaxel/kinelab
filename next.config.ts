import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/ring",
        destination: "/particle-dynamics/ring",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
