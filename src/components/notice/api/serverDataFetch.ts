import { ApiResponse } from '@/server/type';
import { NoticeParameter, NoticeResponse } from '../type';
import { noticeEndPoint } from './noticeApi';
import { createNoticeRequestConfig } from './noticeApi';
import { serverRequest } from '@/server/fetch';
import { serverEnv } from '@/utils/env';

export const fetchServerNotice = async (
  parameter: NoticeParameter
): Promise<ApiResponse<NoticeResponse>> => {
  try {
    const url = noticeEndPoint.getNotices(parameter).serverUrl;
    const config = createNoticeRequestConfig(parameter);

    console.log('🔍 fetchServerNotice 호출:', {
      url,
      parameter,
      serverEnv: {
        NOTICE_URL: serverEnv.NOTICE_URL,
      },
      timestamp: new Date().toISOString(),
    });

    const response = await serverRequest.get<NoticeResponse>(url, config);

    if (response.success && response.data) {
      console.log('✅ 공지사항 서버 데이터 가져오기 성공');
      return response;
    } else {
      console.error('❌ 공지사항 서버 데이터 가져오기 실패:', response.error);
      return {
        success: false,
        data: {
          data: null,
          absoluteUrl: '',
          marketType: parameter.marketType,
        },
        error: response.error,
        status: response.status || 500,
      };
    }
  } catch (error) {
    console.error('❌ 공지사항 서버 요청 오류:', error);
    return {
      success: false,
      data: {
        data: null,
        absoluteUrl: '',
        marketType: parameter.marketType,
      },
      error: error instanceof Error ? error.message : '알 수 없는 오류',
      status: 500,
    };
  }
};
