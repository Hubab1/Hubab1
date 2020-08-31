import React from 'react';
import { mount } from 'enzyme';
import HoldingDepositAgreementConfirmation from "./HoldingDepositAgreementConfirmation";


let defaultProps;

beforeEach(() => {
    defaultProps = {
        handleContinue: jest.fn(),
        viewDocument: jest.fn(),
        configuration: {
            community: {
                buildingName: 'Monterey Pines Apartments',

            }
        },
        profile: {
            unit: {
                unit_number: 'Unit 14F',
            }
        }
    };
});

it('Matches Snapshot', async () => {
    let wrapper = mount( <HoldingDepositAgreementConfirmation {...defaultProps}/> );
    expect(wrapper.debug()).toMatchSnapshot();
});