import * as Sentry from '@sentry/react';

import { Integrations } from '@sentry/tracing';
import { RewriteFrames } from '@sentry/integrations';

const sentryOptions = {
    dsn: 'https://99462942d8ac4d5ba01227973cf9a8b1@sentry.io/1784084',
    environment: process.env.NODE_ENV,
    integrations: [new RewriteFrames(), new Integrations.BrowserTracing()],
};

if (process.env.REACT_APP_SENTRY_RELEASE) {
    sentryOptions.release = `woodhouse@${process.env.REACT_APP_SENTRY_RELEASE}`;
}

Sentry.init(sentryOptions);
