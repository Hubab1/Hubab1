import React from 'react';
import { shallow } from 'enzyme';
import HoldingDepositAgreementView from "./HoldingDepositAgreementView";


let defaultProps;

beforeEach(() => {
    defaultProps = {
        handleContinue: jest.fn(),
        handleClickBack: 'some_route',
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
    let wrapper = shallow( <HoldingDepositAgreementView {...defaultProps}/> );
    expect(wrapper.debug()).toMatchSnapshot();
});