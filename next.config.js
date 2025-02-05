/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/register",
        destination: "/voter-registration",
        permanent: true,
      },
    ]
  },
  webpack: (config, { isServer }) => {
    // Ignore .map file requests
    config.ignoreWarnings = [{ module: /node_modules\/react-toastify/ }]

    // Handle pino-pretty
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        "pino-pretty": false,
      }
    }

    return config
  },
  env: {
    NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
  },
}

module.exports = nextConfig

