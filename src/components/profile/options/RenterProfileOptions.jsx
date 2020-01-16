import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { connect } from 'react-redux';

import ActionButton from 'components/common/ActionButton/ActionButton';
import { ROUTES, SORTED_CONFIG_OPTIONS, RENTER_PROFILE_IDENTIFIER } from 'app/constants';
import {    updateRenterProfile, pageComplete } from 'reducers/renter-profile';
import ExistingRoommate from './ExistingRoommate';
import RenterProfileListItem from './RenterProfileListItem';
import { H1, H3 } from 'assets/styles';
import withRelativeRoutes from 'app/withRelativeRoutes';
import guarantor from 'assets/images/guarantor.png';
import coapplicants from 'assets/images/coapplicants.png';
import doggie from 'assets/images/doggie.png';
import { BackLink } from 'components/common/BackLink';


const SkinnyH1 = styled(H1)`
    width: 70%;
`

const SpacedH3 = styled(H3)`
    margin-top: 15px;
    margin-bottom: 30px;
`

const getOptionConfig = (option, profile) => {
    const optionConfigObj = {
        co_applicants: {
            prefix: <img alt="coapplicants" src={coapplicants}></img>,
            name: 'co_applicants',
            label: 'I\'ll be living with roommates',
            buttonLabel: (!!profile.co_applicants.length ? 'Invite another roommate' : 'Invite a roommate'),
            route: ROUTES.CO_APPLICANTS,
            existingItems: profile.co_applicants,
            existingItemsLabel: 'Roommates',
            existingItemComponent: ExistingRoommate
        },
        pets: {
            prefix: <img alt="dog" src={doggie}></img>,
            name: 'pets',
            label: 'I\'ll be living with pets',
            buttonLabel: 'Add a pet',
            route: ROUTES.PETS
        },
        guarantor: {
            prefix: <img alt="coins" src={guarantor}></img>,
            name: 'guarantor',
            label: 'I\'ll need a guarantor',
            buttonLabel: 'Invite a guarantor',
            route: ROUTES.GUARANTOR,
            tip: 'This is a person that agrees to be legally responsible for the apartment, its condition, and the money owed for rent if you are unable to pay.'
        },
        parking: {
            prefix: '🚗',
            name: 'parking',
            label: 'I\'ll need parking',
            buttonLabel: 'Add parking',
            route: ROUTES.PARKING
        },
        storage: {
            prefix: '🛍️',
            name: 'storage',
            label: 'I\'ll need storage',
            buttonLabel: 'Add storage',
            route: ROUTES.STORAGE
        }
    };
    return optionConfigObj[option];
}

export class RentalProfileOptions extends React.Component {
    state = { submitting: false }
    onContinue = async () => {
        try {
            this.setState({submitting: true});
            await this.props.pageComplete(RENTER_PROFILE_IDENTIFIER);
        } finally {
            this.setState({submitting: false});
        }
        this.props._nextRoute();
    }



    render () {
        if (this.props.config == null || this.props.profile == null) return null;
        const unsortedOptionsSet = new Set(Object.keys(this.props.config.options).map(key => key.toLowerCase()));
        // for now we assume all require co_appplicants and guarantor... might want to do something smarter with RentalOptions in the future, but okie for now
        const sortedRentalOptions = ['co_applicants', 'guarantor'].concat(SORTED_CONFIG_OPTIONS.filter(option => unsortedOptionsSet.has(option))
        );

        return (
            <Fragment>
                <SkinnyH1>Let's Set Up Your Rental Profile</SkinnyH1>
                <SpacedH3>Complete the sections that apply to you and skip the ones that don't.</SpacedH3>
                <div>
                    {sortedRentalOptions.map(option => (
                        <RenterProfileListItem
                            key={option}
                            {...getOptionConfig(option, this.props.profile)}
                        />
                    ))}
                </div>
                <ActionButton disabled={this.state.submitting} onClick={this.onContinue} marginTop={60} marginBottom={27}>Continue</ActionButton>
                <BackLink to={this.props._prev}/>
            </Fragment>
        );
    }
}

RentalProfileOptions.propTypes = {
    updateRenterProfile: PropTypes.func.isRequired,
    pageComplete: PropTypes.func,
    config: PropTypes.object,
    profile: PropTypes.object,
};

const mapStateToProps = state => ({
    config: state.configuration,
    profile: state.renterProfile,
});

const mapDispatchToProps = {
    updateRenterProfile, 
    pageComplete,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRelativeRoutes(RentalProfileOptions, ROUTES.PROFILE_OPTIONS));
