import * as Sentry from '@sentry/browser';
import { RewriteFrames } from '@sentry/integrations';

const sentryOptions = {
    dsn: 'https://99462942d8ac4d5ba01227973cf9a8b1@sentry.io/1784084',
    environment: process.env.NODE_ENV,
    release: window.SENTRY_RELEASE ? window.SENTRY_RELEASE.id : null,
    integrations: [new RewriteFrames()],
};

Sentry.init(sentryOptions);
