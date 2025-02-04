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
    return config
  },
}

module.exports = nextConfig

