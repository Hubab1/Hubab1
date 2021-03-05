import React from 'react';
import { shallow } from 'enzyme';

import { STRIPE_PUBLISHABLE_KEY_DEMO, STRIPE_PUBLISHABLE_KEY_LIVE } from 'config';
import { AppContextProvider, AppTheme } from './AppContextProvider';
import { StripeProvider } from 'react-stripe-elements';

let defaultProps;

beforeEach(() => {
    defaultProps = {
        config: {
            dark_mode: true,
            use_demo_config: true,
        },
        theme: {
            palette: {
                primary: {
                    main: '#000',
                    contrastText: '#666',
                },
            },
        },
    };
});

describe('dark mode', () => {
    it('should set dark mode when config.dark_mode is true', () => {
        defaultProps.config.dark_mode = true;
        const wrapper = shallow(<AppContextProvider {...defaultProps} />);

        expect(wrapper.find(AppTheme.Provider).prop('value')['dark_mode']).toBe(true);
    });

    it('should not set dark mode when config.dark_mode is false', () => {
        defaultProps.config.dark_mode = false;
        const wrapper = shallow(<AppContextProvider {...defaultProps} />);

        expect(wrapper.find(AppTheme.Provider).prop('value')['dark_mode']).toBe(false);
    });
});

describe('Stripe Provider', () => {
    it('should use demo api key when use_demo_config is true', () => {
        defaultProps.config.use_demo_config = true;
        const wrapper = shallow(<AppContextProvider {...defaultProps} skipStripeAndMayorLoader={false} />);

        expect(wrapper.find(StripeProvider).prop('apiKey')).toBe(STRIPE_PUBLISHABLE_KEY_DEMO);
    });

    it('should use live api key when use_demo_config is false', () => {
        defaultProps.config.use_demo_config = false;
        const wrapper = shallow(<AppContextProvider {...defaultProps} skipStripeAndMayorLoader={false} />);

        expect(wrapper.find(StripeProvider).prop('apiKey')).toBe(STRIPE_PUBLISHABLE_KEY_LIVE);
    });

    it('should use demo api key when use_demo_config is missing', () => {
        delete defaultProps.config.use_demo_config;
        const wrapper = shallow(<AppContextProvider {...defaultProps} skipStripeAndMayorLoader={false} />);

        expect(wrapper.find(StripeProvider).prop('apiKey')).toBe(STRIPE_PUBLISHABLE_KEY_DEMO);
    });
});
