import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { logToSentry } from 'utils/sentry';
import CriticalError from 'components/common/CriticalError';

const initialState = {
    hasError: false,
    showError: false,
};

export default class ErrorBoundary extends Component {
    static propTypes = {
        children: PropTypes.node.isRequired,
    };

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    state = initialState;

    componentDidCatch(error) {
        logToSentry(error);
    }

    render() {
        const { children } = this.props;
        const { hasError } = this.state;

        if (hasError) {
            return <CriticalError />;
        }

        return children;
    }
}
