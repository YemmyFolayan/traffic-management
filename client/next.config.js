/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.NETLIFY || process.env.VERCEL ? undefined : "standalone",
  env: {
    NEXT_PUBLIC_DEMO_MODE: process.env.NEXT_PUBLIC_DEMO_MODE ?? "true",
  },
};

module.exports = nextConfig;
