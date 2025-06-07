import { clientEnv, serverEnv } from '@/utils/env';
import { NoticeParameter } from '../type';

export const noticeEndPoint = {
  getNotices: (parameter: NoticeParameter) => {
    const searchParameters = new URLSearchParams({
      marketType: parameter.marketType.toString(),
      page: (parameter.page || 0).toString(),
      size: (parameter.size || 15).toString(),
    });

    return {
      clientUrl: `${clientEnv.NOTICE_URL}/${parameter.marketType}?page=${parameter.page}&size=${parameter.size}`,
      serverUrl: `${serverEnv.NOTICE_URL}/${
        parameter.marketType
      }?${searchParameters.toString()}`,
    };
  },
};

export const createNoticeRequestConfig = (parameter: NoticeParameter) => ({
  cache: 'no-store' as const,
  header: {
    'Content-type': 'application/json',
  },
});
