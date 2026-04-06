import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/lapora",
        destination: "/laporan",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
