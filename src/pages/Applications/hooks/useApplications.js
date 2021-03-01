import { useCallback, useEffect, useState } from 'react';
import API from 'app/api';

export default function useApplications(errorMessage) {
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

    return {
        loading,
        error,
        applications,
    };
}
