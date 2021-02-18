import './assets/sass/styles.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import TagManager from 'react-gtm-module';

import { setupSentry } from 'utils/sentry';
import 'utils/configureYup';
import store from 'reducers/store';
import ErrorBoundary from 'components/common/ErrorBoundary/ErrorBoundary';
import App from 'app/App';
import Auth from 'utils/auth';

Auth.init();
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
