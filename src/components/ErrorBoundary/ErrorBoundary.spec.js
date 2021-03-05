import React from 'react';
import { mount } from 'enzyme';

import * as sentryUtils from 'utils/sentry';
import ErrorBoundary from './ErrorBoundary';
import CriticalErrorPage from 'components/Pages/CriticalErrorPage/CriticalErrorPage';

describe('ErrorBoundary', () => {
    it('render alternative UI and loggs error to sentry when app crashes', () => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
        const logToSentry = jest.spyOn(sentryUtils, 'logToSentry');

        const Throw = () => {
            throw new Error('bad');
        };

        const wrapper = mount(
            <ErrorBoundary>
                <Throw />
            </ErrorBoundary>
        );

        expect(wrapper.find(CriticalErrorPage)).toBeTruthy();

        expect(logToSentry).toBeCalled();

        jest.restoreAllMocks();
    });
});
