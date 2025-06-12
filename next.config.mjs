/** @type {import('next').NextConfig} */

const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  reactStrictMode: false,
  webpack: (config, options) => {
    // 프로덕션에서는 캐시 활성화
    if (process.env.NODE_ENV === 'production') {
      config.cache = {
        type: 'filesystem',
      };
    } else {
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
  generateBuildId: async () => {
    console.log('🔍 빌드 시점 환경변수 확인:');
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('MARKET_FIRST_NAME:', process.env.MARKET_FIRST_NAME);
    console.log('MARKET_COMBINE_DATA:', process.env.MARKET_COMBINE_DATA);
    console.log('NOTICE_URL:', process.env.NOTICE_URL);
    return `build-${Date.now()}`;
  },
};

export default nextConfig;
