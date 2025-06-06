import { clientRequest } from '@/server/fetch';

export const logToServer = (
  message: string,
  level: 'info' | 'warn' | 'error' = 'info'
) => {
  clientRequest
    .post('/api/logs', {
      message,
      level,
      timestamp: new Date().toISOString(),
    })
    .catch((error) => {
      console.error('로그 전송 실패:', error);
    });
};

export const logToProduction = (
  message: string,
  level: 'info' | 'warn' | 'error' = 'info'
) => {
  if (process.env.NODE_ENV === 'production') {
    clientRequest
      .post('https://kimprun.com/api/logs', {
        message,
        level,
        timestamp: new Date().toISOString(),
        source: 'frontend',
      })
      .catch((error) => {
        console.error('프로덕션 로그 전송 실패:', error);
      });
  }
};
