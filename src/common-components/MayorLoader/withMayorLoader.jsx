import React from 'react';
import useMayorLoader from './useMayorLoader';

function withMayorLoader(Component) {
    function ContextWrapper(props) {
        const context = useMayorLoader();

        return <Component {...props} {...context} />;
    }

    return ContextWrapper;
}

export default withMayorLoader;
