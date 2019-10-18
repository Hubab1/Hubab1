import './assets/sass/styles.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import * as Sentry from '@sentry/browser';

import store from 'reducers/store';
import App from 'app/App';
import TagManager from 'react-gtm-module';


Sentry.init({dsn:"url.com"});

const GTM_AUTH = process.env.GTM_AUTH;

const tagManagerArgs = {
    gtmId: 'GTM-W8J3S8J',
    auth: GTM_AUTH
};

TagManager.initialize(tagManagerArgs);

ReactDOM.render((
    <Provider store={store}>
        <App />
    </Provider>
), document.getElementById('root'));
