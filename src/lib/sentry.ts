import * as Sentry from '@sentry/react';

const isProduction = process.env.NODE_ENV === 'production';
const sentryDsn = process.env.VITE_SENTRY_DSN;

export function initSentry() {
  if (!sentryDsn || !isProduction) {
    return;
  }

  Sentry.init({
    dsn: sentryDsn,
    tracesSampleRate: 1.0,
    environment: process.env.NODE_ENV,
    release: process.env.VITE_APP_VERSION,
  });
}

export { Sentry };
