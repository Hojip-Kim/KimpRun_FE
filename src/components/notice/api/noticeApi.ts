import { clientEnv, serverEnv } from '@/utils/env';
import { NoticeParameter } from '../type';

export const noticeEndPoint = {
  getNotices: (parameter: NoticeParameter) => {
    const marketTypeValue = parameter.marketType;

    const searchParameters = new URLSearchParams({
      marketType: marketTypeValue,
      page: (parameter.page || 0).toString(),
      size: (parameter.size || 15).toString(),
    });

    return {
      clientUrl: `${
        clientEnv.NOTICE_URL
      }/${marketTypeValue}?${searchParameters.toString()}`,
      serverUrl: `${
        serverEnv.NOTICE_URL
      }/${marketTypeValue}?${searchParameters.toString()}`,
    };
  },
};

export const createNoticeRequestConfig = (parameter: NoticeParameter) => ({
  cache: 'no-store' as const,
  header: {
    'Content-type': 'application/json',
  },
});
