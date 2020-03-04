import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import { LeaseSigned } from './LeaseSigned';
import ActionButton from 'components/common/ActionButton/ActionButton';
import API from 'app/api';

const buildProps = () => {
    return {
        unit: {

        },
        community: {

        }
    }
};

describe('hellosign modal', () => {
    it('fetches embedded signing url before opening', async () => {
        const props = buildProps();
        API.leaseDocumentUrl = jest.fn().mockReturnValue({url: 'testpdfurl.pdf'});
        let wrapper = mount(<LeaseSigned {...props} />);
        await act(async () => {
            await Promise.resolve(wrapper);
            wrapper.update();
        })
        expect(wrapper.find(ActionButton).prop('href')).toEqual('testpdfurl.pdf')
    })
})
