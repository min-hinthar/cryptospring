/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  env: {
    // INFURA_PROJECT_ID: process.env.INFURA_PROJECT_ID,
    // INFURA_API_SECRET: process.env.INFURA_API_SECRET,
    WEB_3_STORAGE_KEY: process.env.WEB_3_STORAGE_KEY,
    WEB_3_LOGIN: process.env.WEB_3_LOGIN,
    ALCHEMY_API_KEY: process.env.ALCHEMY_API_KEY,
    GOERLI_PRIVATE_KEY_1: process.env.GOERLI_PRIVATE_KEY_1,
  },
  images: {
    domains: ['bafybeidxae6kezhnfj5m3ktgvgotvjkr2zcfamiqxq42qrvv4us5u4ccca.ipfs.w3s.link'],
  },
};

module.exports = nextConfig;
