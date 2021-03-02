import { useContext } from 'react';

import { MayorLoaderContext } from './MayorLoaderProvider';

const useMayorLoader = () => {
    return useContext(MayorLoaderContext);
};

export default useMayorLoader;
