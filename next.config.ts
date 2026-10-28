import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        // Moved into the Rigid Body Kinematics section (TP N°4, RB 6) —
        // kept as a redirect for anyone with the old URL bookmarked.
        source: "/fireman-ladder",
        destination: "/rigid-body-kinematics/fireman-ladder",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
