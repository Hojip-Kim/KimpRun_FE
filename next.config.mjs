/** @type {import('next').NextConfig} */

import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

const loadEnvConfig = () => {
  const env = process.env.NODE_ENV === 'production' ? 'production' : 'local';
  const envFile = path.resolve(process.cwd(), `.env.${env}`);

  console.log(`현재 NODE_ENV: ${process.env.NODE_ENV}, 찾는 파일: .env.${env}`);
  console.log(`파일 경로: ${envFile}`);

  if (fs.existsSync(envFile)) {
    console.log(`환경 변수 파일 발견: ${envFile}`);
    const envConfig = dotenv.config({ path: envFile });

    if (envConfig.error) {
      console.error(`변수파일 로드 실패:`, envConfig.error);
    } else {
      console.log(`변수파일 로드 성공`);
      // 로드된 환경 변수 확인 (보안을 위해 값은 출력하지 않음)
      const envKeys = Object.keys(envConfig.parsed || {});
      console.log(`로드된 환경변수 키: ${envKeys.join(', ')}`);
    }
  } else {
    console.log(`환경변수 파일을 찾을 수 없습니다: ${envFile}`);

    // 현재 설정된 환경 변수 키 확인 (NEXT_PUBLIC_ 접두사만)
    const publicEnvKeys = Object.keys(process.env).filter((key) =>
      key.startsWith('NEXT_PUBLIC_')
    );
    console.log(
      `[환경 설정] 현재 설정된 NEXT_PUBLIC_ 환경 변수 키: ${publicEnvKeys.join(
        ', '
      )}`
    );
  }
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
};

export default nextConfig;
