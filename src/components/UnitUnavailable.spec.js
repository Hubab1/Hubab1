import React from 'react';
import { shallow } from 'enzyme';
import { UnitUnavailable } from 'components/UnitUnavailable';

describe('UnitUnavailable', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            profile: {},
            configuration: {
                community: {
                    contact_phone: '123456',
                },
            },
        };
    });

    describe('signed in', () => {
        it('matches snapshot', () => {
            const props = {
                ...defaultProps,
                profile: {
                    unit: {
                        unit_number: 123,
                    },
                },
            };
            const wrapper = shallow(<UnitUnavailable {...props} />);
            expect(wrapper.getElement()).toMatchSnapshot();
        });
    });

    describe('signed out', () => {
        it('matches snapshot', () => {
            const props = {
                ...defaultProps,
                configuration: {
                    ...defaultProps.configuration,
                    unit: {
                        unit_number: 123,
                    },
                },
            };
            const wrapper = shallow(<UnitUnavailable {...props} />);
            expect(wrapper.getElement()).toMatchSnapshot();
        });
    });
});
