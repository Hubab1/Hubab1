import React from 'react';
import { shallow } from 'enzyme';
import { UnitUnavailablePage } from './UnitUnavailablePage';

describe('UnitUnavailablePage', () => {
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

    describe('missing profile', () => {
        it('returns null', () => {
            const props = {
                ...defaultProps,
                profile: null,
            };
            const wrapper = shallow(<UnitUnavailablePage {...props} />);
            expect(wrapper.instance()).toBe(null);
        });
    });

    describe('missing configuration', () => {
        it('returns null', () => {
            const props = {
                ...defaultProps,
                configuration: null,
            };
            const wrapper = shallow(<UnitUnavailablePage {...props} />);
            expect(wrapper.instance()).toBe(null);
        });
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
            const wrapper = shallow(<UnitUnavailablePage {...props} />);
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
            const wrapper = shallow(<UnitUnavailablePage {...props} />);
            expect(wrapper.getElement()).toMatchSnapshot();
        });
    });
});
