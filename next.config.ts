import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  // Tree-shake large icon/charting libraries so only used exports are bundled
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts'],
  },
};

export default nextConfig;
