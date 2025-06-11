import { clientEnv, serverEnv } from '@/utils/env';
import { NoticeParameter } from '../type';

export const noticeEndPoint = {
  getNotices: (parameter: NoticeParameter) => {
    const marketTypeValue = Number(parameter.marketType);

    // NaN 체크 및 기본값 설정
    const finalMarketTypeValue = isNaN(marketTypeValue) ? 1 : marketTypeValue;

    const searchParameters = new URLSearchParams({
      marketType: finalMarketTypeValue.toString(),
      page: (parameter.page || 0).toString(),
      size: (parameter.size || 15).toString(),
    });

    return {
      clientUrl: `${
        clientEnv.NOTICE_URL
      }/${finalMarketTypeValue}?${searchParameters.toString()}`,
      serverUrl: `${
        serverEnv.NOTICE_URL
      }/${finalMarketTypeValue}?${searchParameters.toString()}`,
    };
  },
};

export const createNoticeRequestConfig = (parameter: NoticeParameter) => ({
  cache: 'no-store' as const,
  header: {
    'Content-type': 'application/json',
  },
});
