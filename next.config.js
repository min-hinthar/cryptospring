/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    // INFURA_PROJECT_ID: process.env.INFURA_PROJECT_ID,
    // INFURA_API_SECRET: process.env.INFURA_API_SECRET,
    WEB_3_STORAGE_KEY: process.env.WEB_3_STORAGE_KEY,
    WEB_3_LOGIN: process.env.WEB_3_LOGIN,
  },
  images: {
    domains: ['xx.infura-ipfs.io'],
  },
};

module.exports = nextConfig;
