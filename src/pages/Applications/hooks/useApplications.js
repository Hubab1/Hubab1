import { useCallback, useEffect, useState } from 'react';
import API from 'api/api';

import { useMayorLoader } from 'common-components/MayorLoader/MayorLoaderProvider';

export default function useApplications(errorMessage) {
    const { toggleLoader } = useMayorLoader();
    const [loading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [applications, setApplications] = useState([]);

    const getApplications = useCallback(async () => {
        setIsLoading(true);

        try {
            const response = await API.getApplications();
            const applications =
                response?.map(({ application, role, last_activity }) => {
                    return {
                        ...application,
                        role,
                        lastActivity: last_activity,
                    };
                }) || [];

            setApplications(applications);
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
        applications,
    };
}
