import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';

import API from 'api/api';
import { HoldingDepositAgreementConfirmation } from './HoldingDepositAgreementConfirmation';
import ActionButton from 'components//ActionButton/ActionButton';

let defaultProps;

beforeEach(() => {
    defaultProps = {
        handleContinue: jest.fn(),
        viewDocument: jest.fn(),
        configuration: {
            community: {
                buildingName: 'Monterey Pines Apartments',
            },
        },
        profile: {
            unit: {
                unit_number: 'Unit 14F',
            },
        },
    };
});

it('Matches Snapshot', async () => {
    const wrapper = mount(<HoldingDepositAgreementConfirmation {...defaultProps} />);
    expect(wrapper.debug()).toMatchSnapshot();
});

describe('Button text', function () {
    it('lets you refetch holding deposit url', async () => {
        API.leaseDocumentUrl = jest.fn().mockReturnValue({ error: 'bad' });
        const wrapper = mount(<HoldingDepositAgreementConfirmation {...defaultProps} />);
        await act(async () => {
            await Promise.resolve(wrapper);
            wrapper.update();
        });
        expect(wrapper.find(ActionButton).last().prop('href')).toEqual(undefined);
        expect(wrapper.find(ActionButton).last().text()).toEqual('Retrieve Holding Deposit Agreement...');
    });

    it('fetches and links pdf url', async () => {
        API.leaseDocumentUrl = jest.fn().mockReturnValue({ url: 'testpdfurl.pdf' });
        const wrapper = mount(<HoldingDepositAgreementConfirmation {...defaultProps} />);
        await act(async () => {
            await Promise.resolve(wrapper);
            wrapper.update();
        });
        expect(wrapper.find(ActionButton).last().prop('href')).toEqual('testpdfurl.pdf');
        expect(wrapper.find(ActionButton).last().text()).toEqual('Review Holding Deposit Agreement');
    });

    it('Displays loading state', async () => {
        const wrapper = mount(<HoldingDepositAgreementConfirmation {...defaultProps} />);
        expect(wrapper.find(ActionButton).last().prop('href')).toEqual(null);
        expect(wrapper.find(ActionButton).last().text()).toEqual('Loading...');
    });
});
