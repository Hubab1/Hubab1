import { useCallback, useEffect, useState } from 'react';
import API from 'api/api';

import { useMayorLoader } from 'common-components/MayorLoader/MayorLoaderProvider';

export default function useApplications(errorMessage) {
    const { toggleLoader } = useMayorLoader();
    const [loading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState([]);

    const getApplications = useCallback(async () => {
        setIsLoading(true);

        try {
            const applications = await API.getApplications();
            const applicationsData =
                applications?.map(({ application, role, last_activity }) => {
                    return {
                        ...application,
                        role,
                        lastActivity: last_activity,
                    };
                }) || [];

            setData(applicationsData);
        } catch {
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [errorMessage]);

    useEffect(() => {
        getApplications();
    }, [getApplications]);

    useEffect(() => {
        toggleLoader(loading);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading]);

    return {
        loading,
        error,
        data,
    };
}
