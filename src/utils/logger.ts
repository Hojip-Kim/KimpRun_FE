export const logger = {
  info: (message: string, meta = {}) => {
    if (process.env.NODE_ENV === 'production') {
      fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          level: 'info',
          message,
          timestamp: new Date().toISOString(),
          application: 'kimprun-frontend',
          ...meta,
        }),
      }).catch(console.error);
    }
    console.info(message, meta);
  },

  error: (message: string, meta = {}) => {
    if (process.env.NODE_ENV === 'production') {
      fetch('https://kimprun.com/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          level: 'error',
          message,
          timestamp: new Date().toISOString(),
          application: 'kimprun-frontend',
          ...meta,
        }),
      }).catch(console.error);
    }
    console.error(message, meta);
  },
};
