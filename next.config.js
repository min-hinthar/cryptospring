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
    GOERLI_PRIVATE_KEY_2: process.env.GOERLI_PRIVATE_KEY_2,
    GOERLI_PRIVATE_KEY_3: process.env.GOERLI_PRIVATE_KEY_3,
  },
  images: {
    domains: [
      'bafybeidxae6kezhnfj5m3ktgvgotvjkr2zcfamiqxq42qrvv4us5u4ccca.ipfs.w3s.link',
      'bafybeibjmlo6apjj47nqqrdlo35aycugeiks4r4i7zn6n4nowohujj5ns4.ipfs.w3s.link',
      'bafybeid6klu65ft5ei7wcky3csfy3mev5at7rqqggevgndnt5qe6empqxe.ipfs.w3s.link',
      'bafybeic7i4ee4cvknbffpxekmbcynogoflmwhf5gogspimemokjpnrvwda.ipfs.w3s.link',
      'bafybeicix433qbvosp5gugxpb4n7vccpxfu4ikv3qr4jfva5blrczie6he.ipfs.w3s.link',
      'bafybeiabl6oxpe3jh237pvaa3itigygynptt2c3xk5cnlqpdfl2f5aro54.ipfs.w3s.link',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'bafybeigoxjf46zecipu4aodkchevpshdx74t3bddd3j4q5oqrsmqj453oe.ipfs.w3s.link',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
