import history from 'history.js';


export const initializePage = (profile) => {
    if (!profile) return;
    if (!profile.completed_terms_and_conditions) {
        history.push('/terms');
    } else if (profile.selected_rental_options.length === 0) {
        history.push('/profile/options');
    }
}
