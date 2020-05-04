import store, { actions } from 'reducers/store';
import { ROUTES } from 'app/constants';

export default async (...args) => {
    const res = await fetch(...args);
    const s = store;
    if (res.status === 401 && !window.location.href.includes('/login')) {
        try {
            const json = await res.json();
            if (json.error_type === 'TokenExpiredError') {
                localStorage.clear();
                store.dispatch(actions.logout());
                window.location.href = `${window.location.origin}/${s.getState().siteConfig.basename}${ROUTES.LOGIN}`;
                
            }
        } catch (e) {
            debugger;
        }
        debugger;
    }
    return res;
}
