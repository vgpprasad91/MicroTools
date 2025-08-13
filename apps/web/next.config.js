/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true
  },
  transpilePackages: ["@ms/ui", "@ms/utils"]
};

module.exports = nextConfig;

