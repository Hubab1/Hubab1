import React from 'react';
import { shallow } from 'enzyme';

import API from 'api/api';
import ResetApplicantFinancials from './ResetApplicantFinancials';

let defaultProps;
beforeEach(() => {
    defaultProps = {
        onSubmit: jest.fn()
    };
});

it('calls reset applicant endpoint and finally calls props.onSubmit', async () => {
    API.resetApplicantFinancials = jest.fn().mockReturnValue({});
    const wrapper = await shallow(<ResetApplicantFinancials {...defaultProps}/>);
    await wrapper.instance().onSubmit();
    expect(API.resetApplicantFinancials).toHaveBeenCalled();
    expect(defaultProps.onSubmit).toHaveBeenCalled();
});

it('has error state if api throws error', async () => {
    API.resetApplicantFinancials = jest.fn().mockRejectedValue();
    const wrapper = await shallow(<ResetApplicantFinancials {...defaultProps}/>);
    await wrapper.instance().onSubmit();
    expect(wrapper.state('errorSubmitting')).toBe(true);
    expect(defaultProps.onSubmit).not.toHaveBeenCalled();
});
