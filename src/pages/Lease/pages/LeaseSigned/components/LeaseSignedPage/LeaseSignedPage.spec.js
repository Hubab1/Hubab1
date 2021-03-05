import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';

import API from 'api/api';
import { LeaseSignedPage } from './LeaseSignedPage';
import ActionButton from 'components//ActionButton/ActionButton';

const buildProps = () => {
    return {
        unit: {},
        community: {},
    };
};

it('fetches and links pdf url', async () => {
    const props = buildProps();
    API.leaseDocumentUrl = jest.fn().mockReturnValue({url: 'testpdfurl.pdf'});
    const wrapper = mount(<LeaseSignedPage {...props} />);
    await act(async () => {
        await Promise.resolve(wrapper);
        wrapper.update();
    });
    expect(wrapper.find(ActionButton).prop('href')).toEqual('testpdfurl.pdf');
});

it('lets you refetch lease url', async () => {
    const props = buildProps();
    API.leaseDocumentUrl = jest.fn().mockReturnValue({error: 'bad'});
    const wrapper = mount(<LeaseSignedPage {...props} />);
    await act(async () => {
        await Promise.resolve(wrapper);
        wrapper.update();
    });
    expect(wrapper.find(ActionButton).prop('href')).toEqual(undefined);
    expect(wrapper.find(ActionButton).text()).toEqual('Retrieve Lease...');
});
