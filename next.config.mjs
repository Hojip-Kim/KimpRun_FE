/** @type {import('next').NextConfig} */

import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

const loadEnvConfig = () => {
  console.log(`현재 NODE_ENV: ${process.env.NODE_ENV}`);

  const env = process.env.NODE_ENV === 'production' ? 'production' : 'local';
  const envFile = path.resolve(process.cwd(), `.env.${env}`);

  console.log(`찾는 파일: .env.${env}`);
  console.log(`파일 경로: ${envFile}`);

  if (fs.existsSync(envFile)) {
    console.log(`✅ 환경 변수 파일 발견: ${envFile}`);
    const envConfig = dotenv.config({ path: envFile });

    if (envConfig.error) {
      console.error(`❌ 변수파일 로드 실패:`, envConfig.error);
    } else {
      console.log(`✅ 변수파일 로드 성공`);
      // 로드된 환경 변수 확인 (보안을 위해 값은 출력하지 않음)
      const envKeys = Object.keys(envConfig.parsed || {});
      console.log(
        `로드된 환경변수 키 (${envKeys.length}개): ${envKeys.join(', ')}`
      );

      // 서버 환경변수들이 제대로 로드되었는지 확인
      const serverEnvKeys = envKeys.filter(
        (key) => !key.startsWith('NEXT_PUBLIC_')
      );
      console.log(
        `서버 환경변수 키 (${serverEnvKeys.length}개): ${serverEnvKeys.join(
          ', '
        )}`
      );
    }
  } else {
    console.log(`❌ 환경변수 파일을 찾을 수 없습니다: ${envFile}`);

    // 현재 디렉토리의 파일 목록 확인
    try {
      const files = fs.readdirSync(process.cwd());
      const envFiles = files.filter((file) => file.startsWith('.env'));
      console.log(`현재 디렉토리의 .env 파일들: ${envFiles.join(', ')}`);
    } catch (error) {
      console.error('디렉토리 읽기 실패:', error);
    }

    // 현재 설정된 환경 변수 키 확인 (NEXT_PUBLIC_ 접두사만)
    const publicEnvKeys = Object.keys(process.env).filter((key) =>
      key.startsWith('NEXT_PUBLIC_')
    );
    console.log(
      `현재 설정된 NEXT_PUBLIC_ 환경 변수 키: ${publicEnvKeys.join(', ')}`
    );
  }
  console.log('=== 환경변수 로딩 완료 ===\n');
};

loadEnvConfig();

const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  reactStrictMode: false,
  webpack: (config, options) => {
    config.cache = false;
    return config;
  },
  poweredByHeader: false,
  compress: true,
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : undefined,
  staticPageGenerationTimeout: 180,
  output: 'standalone',
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
    skipTrailingSlashRedirect: true,
  },
  env: {
    SKIP_ENV_VALIDATION:
      process.env.NODE_ENV === 'production' ? 'true' : undefined,
    // 서버 환경변수들을 명시적으로 노출 (빌드 시점에 번들에 포함됨)
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
