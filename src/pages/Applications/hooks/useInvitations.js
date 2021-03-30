import { useCallback, useEffect, useState } from 'react';
import API from 'api/api';

import { useMayorLoader } from 'common-components/MayorLoader/MayorLoaderProvider';

export default function useInvitations(errorMessage) {
    const { toggleLoader } = useMayorLoader();
    const [loading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [invitations, setInvitations] = useState([]);

    const getInvitations = useCallback(async () => {
        setIsLoading(true);

        try {
            const invitations = await API.getInvitations();
            setInvitations(invitations);
        } catch {
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [errorMessage]);

    useEffect(() => {
        getInvitations();
    }, [getInvitations]);

    useEffect(() => {
        toggleLoader(loading);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading]);

    return {
        loading,
        error,
        invitations,
    };
}
