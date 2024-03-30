/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    VERCEL_ENV: process.env.VERCEL_ENV,
  },
};

module.exports = nextConfig;
