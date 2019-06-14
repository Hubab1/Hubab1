import { ROUTES } from 'app/constants';
import { selectors } from 'reducers/renter-profile';

describe('selectInitialPage', () => {
    it('computes initial page based on profile data', () => {
        const configuration = {
            rental_options_config: {
                roommates: {limit: 3},
                guarantor: {limit: 3},
                pets: {limit: 3}
            }
        };
        let initialPage;
        initialPage = selectors.selectInitialPage({
            configuration,
            renterProfile: {
                selected_rental_options: ['roommates', 'pets'],
                roommates: null,
                pets: null
            }
        });
        expect(initialPage).toEqual(ROUTES.ROOMMATES);
        initialPage = selectors.selectInitialPage({
            configuration,
            renterProfile: {
                selected_rental_options: ['roommates', 'pets'],
                roommates: [{name: 'bob'}],
                pets: null
            }
        });
        expect(initialPage).toEqual(ROUTES.PETS);
        initialPage = selectors.selectInitialPage({
            configuration,
            renterProfile: {
                selected_rental_options: ['roommates', 'pets'],
                roommates: [{name: 'bob'}],
                pets: [{name: 'Luscious', breed: 'Pitty', weight: '99', pet_type: 'Dog'}, {name: 'garfield', pet_type: 'Cat'}]
            }
        });
        expect(initialPage).toEqual(ROUTES.APPLICATION_FEE);

        initialPage = selectors.selectInitialPage({
            configuration,
            renterProfile: {
                selected_rental_options: ['guarantor', 'pets'],
                roommates: null,
                guarantor: null,
                pets: null
            }
        });

        expect(initialPage).toEqual(ROUTES.GUARANTOR);

        initialPage = selectors.selectInitialPage({
            configuration,
            renterProfile: {
                selected_rental_options: [],
                roommates: null,
                guarantor: null,
                pets: null
            }
        });

        expect(initialPage).toEqual(ROUTES.PROFILE_OPTIONS);
    })
})