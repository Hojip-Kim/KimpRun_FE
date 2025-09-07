/** @type {import('next').NextConfig} */

const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's2.coinmarketcap.com',
        port: '',
        pathname: '/static/img/coins/**',
      },
      {
        protocol: 'https',
        hostname: 'assets.coingecko.com',
        port: '',
        pathname: '/coins/images/**',
      },
    ],
    domains: ['s2.coinmarketcap.com', 'assets.coingecko.com'],
  },
  webpack: (config, options) => {
    // 개발 모드에서 캐시 문제 방지
    if (process.env.NODE_ENV !== 'production') {
      config.cache = false;
    }
    return config;
  },
  poweredByHeader: false,
  compress: true,
  staticPageGenerationTimeout: 180,
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : undefined,
  async headers() {
    return [
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, s-maxage=86400',
          },
        ],
      },
      {
        source: '/robots.txt',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, s-maxage=86400',
          },
        ],
      },
    ];
  },
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  env: {
    MARKET_FIRST_NAME: process.env.MARKET_FIRST_NAME,
    MARKET_UPBIT_DATA: process.env.MARKET_UPBIT_DATA,
    MARKET_COMBINE_DATA: process.env.MARKET_COMBINE_DATA,
    NOTICE_URL: process.env.NOTICE_URL,
    BOARD_URL: process.env.BOARD_URL,
    ALL_POSTS_URL: process.env.ALL_POSTS_URL,
    CATEGORY_URL: process.env.CATEGORY_URL,
    COMMENT_URL: process.env.COMMENT_URL,
    MARKET_BINANCE_DATA: process.env.MARKET_BINANCE_DATA,
    MARKET_DATA: process.env.MARKET_DATA,
  },
};

export default nextConfig;
