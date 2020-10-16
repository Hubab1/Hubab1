import React from 'react';
import { shallow } from 'enzyme';
import RadioGroup from '@material-ui/core/RadioGroup';

import { ApplicationFees, EveryoneRow } from './ApplicationFees';
import { PaidText } from 'components/common/PaidText';

let defaultProps;

beforeEach(() => {
    defaultProps = {
        everyone: [
            {
                address_city: 'abc',
                lease_settings: 2,
                address_postal_code: '',
                email: 'slkejhfkajshefjkhek@gm.com',
                role: 'primary_applicant',
                guarantors: [
                    {
                        phone_number: '(555) 123-6456',
                        first_name: 'scotty',
                        last_name: '2hotty',
                        id: 5,
                        is_registered: false,
                    },
                ],
                application: 16,
                person: {
                    id: 346785,
                    email: 'slkejhfkajshefjkhek@gm.com',
                    name: 'Spanky McDanky',
                    phone_1: '(555) 555-5555',
                    first_name: 'Spanky',
                },
                address_state: '',
                address_street: '',
                id: 18,
                applicationFeePaid: false,
                events: [{ event: '45' }],
            },
            {
                phone_number: '(383) 838-4849',
                first_name: 'kreebs',
                last_name: 'mcgreebs',
                id: 71,
                is_registered: false,
                applicationFeePaid: true,
            },
            {
                phone_number: '(333) 888-4449',
                first_name: 'jerry',
                last_name: 'maguire',
                id: 73,
                is_registered: true,
                applicationFeePaid: false,
            },
            {
                phone_number: '(222) 111-0000',
                first_name: 'elvish',
                last_name: 'parsley',
                id: 74,
                is_registered: false,
                applicationFeePaid: false,
            },
        ],
        applicationFeesSelected: 'everyone',
        handleChange: jest.fn(),
        baseAppFee: 75,
        numUnpaidApplicants: 3,
    };
});

it('renders row with radio select and all other applicants when everyone selected', () => {
    const wrapper = shallow(<ApplicationFees {...defaultProps} />);

    expect(wrapper.find(RadioGroup).length).toEqual(1);
    expect(wrapper.text().includes('Application Fee')).toBeTruthy();
    expect(wrapper.find(EveryoneRow).length).toEqual(4);
});

it('renders does not render radio select when everyone is only the logged in applicant', () => {
    const mainApplicant = [
        {
            address_city: 'abc',
            lease_settings: 2,
            address_postal_code: '',
            email: 'slkejhfkajshefjkhek@gm.com',
            role: 'primary_applicant',
            guarantors: [
                {
                    phone_number: '(555) 123-6456',
                    first_name: 'scotty',
                    last_name: '2hotty',
                    id: 5,
                    is_registered: false,
                },
            ],
            application: 16,
            person: {
                id: 346785,
                email: 'slkejhfkajshefjkhek@gm.com',
                name: 'Spanky McDanky',
                phone_1: '(555) 555-5555',
                first_name: 'Spanky',
            },
            address_state: '',
            address_street: '',
            id: 18,
            applicationFeePaid: false,
            events: [{ event: '45' }],
        },
    ];
    const wrapper = shallow(
        <ApplicationFees {...defaultProps} everyone={mainApplicant} applicationFeesSelected="myself" />
    );

    expect(wrapper.find(RadioGroup).length).toEqual(0);
    expect(wrapper.text()).toEqual('Application Fee <SimplePopover />$75');
});

it('renders row with radio select, but no other Applicants when self is selected', () => {
    defaultProps.applicationFeesSelected = 'self';
    const wrapper = shallow(<ApplicationFees {...defaultProps} />);

    expect(wrapper.text().includes('Application Fee')).toBeTruthy();

    expect(wrapper.find(EveryoneRow).length).toEqual(0);
});

it('renders EveryoneRows with full names', () => {
    const wrapper = shallow(<ApplicationFees {...defaultProps} />);

    expect(wrapper.find(EveryoneRow).at(1).props().person.first_name).toEqual('kreebs');
    expect(wrapper.find(EveryoneRow).at(2).props().person.first_name).toEqual('jerry');
    expect(wrapper.find(EveryoneRow).last().props().person.first_name).toEqual('elvish');
});

it('renders EveryoneRow without $75, but with PaidText when fees have been paid', () => {
    const wrapper = shallow(<EveryoneRow person={defaultProps.everyone[1]} baseAppFee={defaultProps.baseAppFee} />);

    expect(wrapper.find(PaidText).length).toBeTruthy();
    expect(wrapper.text().includes('$75')).not.toBeTruthy();
});

it('renders EveryoneRow without PaidText, but with $75, when fees have not been paid', () => {
    const wrapper = shallow(<EveryoneRow person={defaultProps.everyone[0]} baseAppFee={defaultProps.baseAppFee} />);

    expect(wrapper.find(PaidText).length).not.toBeTruthy();
    expect(wrapper.text().includes('$75')).toBeTruthy();
});

it('renders PaidText when activeApplicantPaid is true', () => {
    const wrapper = shallow(<ApplicationFees {...defaultProps} activeApplicantFeePaid={true} />);

    expect(wrapper.find(PaidText).length).toEqual(1);
    expect(wrapper.find(EveryoneRow).length).toEqual(0);
});
