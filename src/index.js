import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import TagManager from 'react-gtm-module';

import { setupSentry } from 'utils/sentry';
import 'utils/configureYup';
import store from 'reducers/store';

import ErrorBoundary from 'common-components/ErrorBoundary/ErrorBoundary';
import App from 'src/app/App';
import './assets/sass/styles.scss';

setupSentry();

const tagManagerArgs = {
    gtmId: 'GTM-W8J3S8J',
    auth: process.env.GTM_AUTH,
};

TagManager.initialize(tagManagerArgs);

ReactDOM.render(
    <Provider store={store}>
        <ErrorBoundary>
            <App />
        </ErrorBoundary>
    </Provider>,
    document.getElementById('root')
);
