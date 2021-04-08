import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import { RewriteFrames } from '@sentry/integrations';

import { ENV, SENTRY_RELEASE } from 'config';

export const setupSentry = () => {
    const sentryOptions = {
        dsn: 'https://99462942d8ac4d5ba01227973cf9a8b1@o16407.ingest.sentry.io/1784084',
        environment: ENV,
        integrations: [new RewriteFrames(), new Integrations.BrowserTracing()],
    };

    if (SENTRY_RELEASE) {
        sentryOptions.release = `woodhouse@${SENTRY_RELEASE}`;
    }

    Sentry.init(sentryOptions);
};

export const logToSentry = async (error) => {
    if (error instanceof Response) {
        const apiError = new Error();
        apiError.name = error.status + ' - ' + error.statusText;
        apiError.message = await error.text();
        return Sentry.captureException(apiError);
    }
    Sentry.captureException(erroar);
};

export const setSentryUser = (user) => {
    Sentry.setUser({
        id: user.id,
        email: user.email,
    });
};
