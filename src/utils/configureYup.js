import * as Yup from 'yup';

import { STATE_ZIP_CODES } from 'constants/zipcodes';

/* eslint-disable no-template-curly-in-string */
Yup.setLocale({});

Yup.addMethod(Yup.number, 'zipcodeBelongsToState', function () {
    return this.test('test-zipcode-belongs-to-state', 'Unknown zipcode', function (zipcode) {
        const stateKey = Object.keys(this.parent).find((key) => {
            if (key.includes('state')) {
                return true;
            }
        });

        const state = this.parent[stateKey];

        if (!state) {
            return false;
        }

        const zipcodeRange = STATE_ZIP_CODES.find((s) => {
            return zipcode >= s.zipCodeMin && zipcode <= s.zipCodeMax;
        });

        if (!zipcodeRange) {
            return false;
        }

        return (
            state.toLowerCase() === zipcodeRange.state.toLowerCase() ||
            state.toLowerCase() === zipcodeRange.stateAbbrv.toLowerCase()
        );
    });
});
