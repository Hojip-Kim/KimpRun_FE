/** @type {import('next').NextConfig} */

import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

export default () => {
  const env = process.env.ENVIRONMENT || 'local';
  const envFile = path.resolve(process.cwd(), `.env.${env}`);

  if (fs.existsSync(envFile)) {
    dotenv.config({ path: envFile });
  }

  return {
    reactStrictMode: false,
    webpack: (config, options) => {
      config.cache = false;
      return config;
    },
  };
};
