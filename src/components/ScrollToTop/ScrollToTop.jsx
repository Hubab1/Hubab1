import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
    const location = useLocation();
    const { pathname, hash } = location;

    useLayoutEffect(() => {
        // Only if there is no hash we want to scroll to the top of the page
        if (!hash) {
            window.scrollTo(0, 0);
        }
    }, [pathname, hash]);

    return null;
}
