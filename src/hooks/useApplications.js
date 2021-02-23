import useEnhancedFetch from 'hooks/useEnhancedFetch';
import { API_URL } from 'config';

export const GET_APPLICATIONS = `${API_URL}/applications`;

const useApplications = () => {
    const { loading, error, data, ...rest } = useEnhancedFetch(GET_APPLICATIONS, {
        method: 'GET',
        fetchOnDemand: false,
        cachePolicy: 'network-only',
    });

    // Note: data returned by end point is actuall an list of ApplicantRoles
    // We 'flatmap' them by merging the role and last activity with the application
    const applications =
        data?.map(({ application, role, last_activity }) => {
            return {
                ...application,
                role,
                lastActivity: last_activity,
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
