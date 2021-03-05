import React from 'react';
import { shallow } from 'enzyme';

import { ScreeningPage } from './ScreeningPage';
import SocialSecurityInput from 'components//SocialSecurityInput/SocialSecurityInput';
import GenericFormMessage from 'components//GenericFormMessage/GenericFormMessage';

const props = {
    applicant: {
        id: 123,
        first_name: 'Chakib',
    },
    buildingName: 'The blue building.',
    toggleLoader: jest.fn(),
};

it('Match initial snapshot', function () {
    const wrapper = shallow(<ScreeningPage {...props} />);
    expect(wrapper.getElement()).toMatchSnapshot();
});

it('Display SSN and Confirm SSN fields by default', function () {
    const wrapper = shallow(<ScreeningPage {...props} />);
    expect(wrapper.find('Formik').dive().find(SocialSecurityInput).length).toEqual(2);
});

it('shows generic error message', function () {
    const wrapper = shallow(<ScreeningPage {...props} />);
    wrapper.setState({ errors: ['some error'] });
    expect(wrapper.find('Formik').dive().find(GenericFormMessage).length).toBe(1);
});
