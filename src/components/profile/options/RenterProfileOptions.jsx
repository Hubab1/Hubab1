import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { connect } from 'react-redux';

import ActionButton from 'components/common/ActionButton/ActionButton';
import { ROUTES, SORTED_CONFIG_OPTIONS } from 'app/constants';
import { updateRenterProfile } from 'reducers/renter-profile';
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

const optionConfig = {
    co_applicants: {
        prefix: <img alt="coapplicants" src={coapplicants}></img>,
        name: 'co_applicants',
        label: 'Other adults will live here',
        buttonLabel: 'Invite a roommate',
        route: ROUTES.CO_APPLICANTS
    },
    pets: {
        prefix: <img alt="dog" src={doggie}></img>,
        name: 'pets',
        label: 'Pets will live here',
        buttonLabel: 'Add a pet',
        route: ROUTES.PETS
    },
    guarantor: {
        prefix: <img alt="coins" src={guarantor}></img>,
        name: 'guarantor',
        label: 'I\'ll need a guarantor',
        buttonLabel: 'Invite a guarantor',
        route: ROUTES.GUARANTOR
    },
    parking: {
        prefix: '🚗',
        name: 'parking',
        label: 'I\'d like a parking space',
        buttonLabel: 'Add parking',
        route: ROUTES.PARKING
    },
    storage: {
        prefix: '🛍️',
        name: 'storage',
        label: 'I\'ll need extra storage',
        buttonLabel: 'Add storage',
        route: ROUTES.STORAGE
    }
}

export class RentalProfileOptions extends React.Component {
    onContinue = () => {
        // TODO: API call that makes some milestone?
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
                            {...optionConfig[option]}
                        />
                    ))}
                </div>
                <ActionButton onClick={this.onContinue} marginTop={60} marginBottom={27}>Continue</ActionButton>
                <BackLink to={this.props._prev}/>
            </Fragment>
        );
    }
}

RentalProfileOptions.propTypes = {
    updateRenterProfile: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    config: state.configuration,
    profile: state.renterProfile,
})

export default connect(mapStateToProps, {updateRenterProfile})(withRelativeRoutes(RentalProfileOptions, ROUTES.PROFILE_OPTIONS));
