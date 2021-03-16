import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';

import API from 'api/api';
import { LeaseExecutedPage } from './LeaseExecutedPage';
import ActionButton from 'common-components/ActionButton/ActionButton';

const buildProps = () => {
    return {
        unit: {},
        community: {},
    };
};

it('fetches and links pdf url', async () => {
    const props = buildProps();
    API.leaseDocumentUrl = jest.fn().mockReturnValue({ url: 'testpdfurl.pdf' });
    const wrapper = mount(<LeaseExecutedPage {...props} />);
    await act(async () => {
        await Promise.resolve(wrapper);
        wrapper.update();
    });
    expect(wrapper.find(ActionButton).last().prop('href')).toEqual('testpdfurl.pdf');
});
