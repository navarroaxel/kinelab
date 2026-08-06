import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/pin-slot",
        destination: "/particle-kinematics/pin-slot",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
