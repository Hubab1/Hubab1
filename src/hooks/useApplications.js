import useEnhancedFetch from 'hooks/useEnhancedFetch';
import { API_URL } from 'config';

export const GET_APPLICATIONS = `${API_URL}/applications`;

const useApplications = () => {
    const { loading, error, data, ...rest } = useEnhancedFetch(GET_APPLICATIONS, {
        method: 'GET',
        fetchOnDemand: false,
        cachePolicy: 'network-only',
    });

    const applications =
        data?.map(({ application, role }) => {
            return {
                ...application,
                role,
            };
        }) || [];

    return {
        loading,
        error,
        applications,
        ...rest,
    };
};

export default useApplications;
