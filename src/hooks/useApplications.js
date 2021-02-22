import useEnhancedFetch from 'hooks/useEnhancedFetch';
import { API_URL } from 'config';

export const GET_APPLICATIONS = `${API_URL}/applications`;

const useApplications = () => {
    const { loading, error, data, ...rest } = useEnhancedFetch(GET_APPLICATIONS, {
        method: 'GET',
        fetchOnDemand: false,
        cachePolicy: 'network-only',
    });

    return {
        loading,
        error,
        applications: data || [],
        ...rest,
    };
};

export default useApplications;
