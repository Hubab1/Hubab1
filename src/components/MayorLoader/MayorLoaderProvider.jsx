import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';

import ReduxMayorLoader, { MayorLoader } from 'components/MayorLoader/MayorLoader';

export const MayorLoaderContext = createContext({});

export const useMayorLoader = () => {
    return useContext(MayorLoaderContext);
};

// TODO: backfill tests | created by @JimVercoelen | ticket: https://nestiolistings.atlassian.net/browse/NESTIO-20504
export const MayorLoaderProvider = (props) => {
    const { children } = props;
    const [isVisible, setIsVisible] = useState(false);

    const toggleLoader = useCallback((isVisible = true) => {
        setIsVisible(isVisible);
    }, []);

    const contextValue = useMemo(
        () => ({
            toggleLoader,
        }),
        [toggleLoader]
    );

    return (
        <MayorLoaderContext.Provider value={contextValue}>
            {children}
            <MayorLoader isVisible={isVisible} />
            <ReduxMayorLoader />
        </MayorLoaderContext.Provider>
    );
};

MayorLoaderProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default MayorLoaderProvider;
