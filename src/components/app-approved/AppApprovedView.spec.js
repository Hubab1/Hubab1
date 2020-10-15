import React from 'react';
import { shallow } from 'enzyme';
import { ROLE_OCCUPANT } from 'app/constants';
import { AppApprovedView } from 'components/app-approved/AppApprovedView';
import ActionButton from 'components/common/ActionButton/ActionButton';
import API from 'app/api';
import { LinkButton } from 'assets/styles';
import { AppAdverseActions } from 'components/AppAdverseActions';

const buildProps = (buildingName = 'Fake Building', streetAddress = '123 Fake Street', unitNumber = '2B') => {
    return {
        profile: {
            events: [{ event: '270' }],
            unit: {
                unit_number: unitNumber,
            },
            last_status_change: {
                created_at: '2020-05-06 04:06:23',
            },
        },
        configuration: {
            community: {
                building_name: buildingName,
                normalized_street_address: streetAddress,
                guarantor_income_requirement_multiplier: 1,
            },
        },
        applicant: {
            person: {
                name: 'John Doe',
            },
        },
        setShowPaymentDetails: jest.fn(),
    };
};

it('displays some legal words about the lease', () => {
    const props = buildProps('Fake Building', '123 Fake Street', null);
    API.embeddedSigningUrl = jest.fn().mockReturnValue({ url: 'test' });
    API.fetchApplicant = jest.fn().mockReturnValue({ events: [] });
    const wrapper = shallow(<AppApprovedView {...props} />);
    expect(wrapper.text()).toContain('The lease linked below constitutes a legal agreement between you and Landlord');
});

describe('application unit', () => {
    it('displays building name when no unit', () => {
        const props = buildProps('Fake Building', '123 Fake Street', null);
        props.unit = null;

        const wrapper = shallow(<AppApprovedView {...props} />);

        expect(wrapper.find('#application-unit').text()).toEqual('Fake Building');
    });

    it('displays building name without unit when no unit number', () => {
        const props = buildProps('Fake Building', '123 Fake Street', null);

        const wrapper = shallow(<AppApprovedView {...props} />);

        expect(wrapper.find('#application-unit').text()).toEqual('Fake Building');
    });

    it('displays building name with unit when has unit number', () => {
        const props = buildProps('Fake Building', '123 Fake Street', '7F');

        const wrapper = shallow(<AppApprovedView {...props} />);

        expect(wrapper.find('#application-unit').text()).toEqual('Fake Building Unit 7F');
    });

    it('displays normalized street address and unit number when no building name', () => {
        const props = buildProps(null, '123 Fake Street', '7F');

        const wrapper = shallow(<AppApprovedView {...props} />);

        expect(wrapper.find('#application-unit').text()).toEqual('123 Fake Street Unit 7F');
    });
});

describe('Lease not sent', () => {
    it('Should should show different message and no action button', () => {
        const props = buildProps();
        props.profile.events = [];

        const wrapper = shallow(<AppApprovedView {...props} />);
        expect(wrapper.text()).toContain('email with instructions on how to sign the lease');
        expect(wrapper.find(ActionButton)).toHaveLength(0);
    });
});

describe('security deposit message', () => {
    it('should render when there is a security deposit', () => {
        const props = buildProps();
        props.profile.security_deposit = 123.45;
        props.profile.security_deposit_multiplier = 1.5;

        const wrapper = shallow(<AppApprovedView {...props} />);

        expect(wrapper.find('.security-deposit-container')).toHaveLength(1);
    });

    it('should not render when there is no security deposit', () => {
        const props = buildProps();
        props.profile.security_deposit = null;
        props.profile.security_deposit_multiplier = null;

        const wrapper = shallow(<AppApprovedView {...props} />);

        expect(wrapper.find('.security-deposit-container')).toHaveLength(0);
    });
});

describe('approved occupants', () => {
    it('should show the approved message and no action button when lease not ready', () => {
        const props = buildProps();
        props.applicant.role = ROLE_OCCUPANT;
        props.profile.events = [];

        const wrapper = shallow(<AppApprovedView {...props} />);
        expect(wrapper.text()).toContain(`We'll let you know when everything has been finalized.`);
        expect(wrapper.find(ActionButton)).toHaveLength(0);
    });

    it('should show the approved message and no action button when lease ready', () => {
        const props = buildProps();
        props.applicant.role = ROLE_OCCUPANT;

        const wrapper = shallow(<AppApprovedView {...props} />);
        expect(wrapper.text()).toContain(`We'll let you know when everything has been finalized.`);
        expect(wrapper.find(ActionButton)).toHaveLength(0);
    });
});

it('matches snapshot without security deposit', () => {
    const props = buildProps();
    props.profile.security_deposit = null;
    props.profile.security_deposit_multiplier = null;
    const wrapper = shallow(<AppApprovedView {...props} />);
    expect(wrapper.getElement()).toMatchSnapshot();
});

it('matches snapshot with security deposit', () => {
    const props = buildProps();
    props.profile.security_deposit = 123.45;
    const wrapper = shallow(<AppApprovedView {...props} />);
    expect(wrapper.getElement()).toMatchSnapshot();
});

it('matches snapshot with occupant', () => {
    const props = buildProps();
    props.profile.security_deposit = null;
    props.profile.security_deposit_multiplier = null;
    props.applicant.role = ROLE_OCCUPANT;
    const wrapper = shallow(<AppApprovedView {...props} />);
    expect(wrapper.getElement()).toMatchSnapshot();
});

it('renders adverse actions without international applicant', () => {
    const props = buildProps();
    props.profile.security_deposit = 123;
    props.applicant.role = ROLE_OCCUPANT;
    const wrapper = shallow(<AppApprovedView {...props} />);
    wrapper.find(LinkButton).simulate('click');
    expect(wrapper.find(AppAdverseActions)).toBeTruthy();
    expect(wrapper.find(AppAdverseActions).prop('hasInternationalApplicant')).toBe(false);
});

it('renders adverse actions with international primary applicant', () => {
    const props = buildProps();
    props.profile.security_deposit = 123;
    props.profile.primary_applicant = { international: true };
    const wrapper = shallow(<AppApprovedView {...props} />);
    wrapper.find(LinkButton).simulate('click');
    expect(wrapper.find(AppAdverseActions)).toBeTruthy();
    expect(wrapper.find(AppAdverseActions).prop('hasInternationalApplicant')).toBe(true);
});

it('renders adverse actions with international co-applicant', () => {
    const props = buildProps();
    props.profile.security_deposit = 123;
    props.profile.primary_applicant = { international: false };
    props.profile.co_applicants = [{ international: true }];

    const wrapper = shallow(<AppApprovedView {...props} />);
    wrapper.find(LinkButton).simulate('click');
    expect(wrapper.find(AppAdverseActions)).toBeTruthy();
    expect(wrapper.find(AppAdverseActions).prop('hasInternationalApplicant')).toBe(true);
});
