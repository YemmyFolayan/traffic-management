/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.NETLIFY ? undefined : "standalone",
};

module.exports = nextConfig;
