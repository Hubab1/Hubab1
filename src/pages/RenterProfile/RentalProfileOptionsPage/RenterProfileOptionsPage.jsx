import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { connect } from 'react-redux';

import {
    ROUTES,
    RENTER_PROFILE_IDENTIFIER,
    RENTER_PROFILE_TYPE_CO_APPLICANTS,
    RENTER_PROFILE_TYPE_GUARANTOR,
    RENTER_PROFILE_TYPE_PETS,
    RENTER_PROFILE_TYPE_PARKING,
    RENTER_PROFILE_TYPE_STORAGE,
    RENTER_PROFILE_TYPE_DEPENDENT,
    RENTER_PROFILE_TYPE_OCCUPANT,
    RENTER_PROFILE_TYPE_WINE_COOLER,
} from 'constants/constants';
import withRelativeRoutes from 'utils/withRelativeRoutes';

import { updateRenterProfile, pageComplete } from 'reducers/renter-profile';
import { actions as modalActions } from 'reducers/loader';

import ActionButton from 'common-components/ActionButton/ActionButton';
import { BackLink } from 'common-components/BackLink/BackLink';

import GenericFormMessage from 'common-components/GenericFormMessage/GenericFormMessage';
import Capsule from 'common-components/Capsule/Capsule';
import ExistingItemsExpansionPanel from 'common-components/ExistingItemsExpansionPanel/ExistingItemsExpansionPanel';
import ExistingGenericRentalOption from 'pages/RenterProfile/components/ExistingGenericRentalOption/ExistingGenericRentalOption';
import ExistingPet from 'pages/RenterProfile/components/ExistingPet/ExistingPet';
import ExistingRoommate from 'pages/RenterProfile/components/ExistingRoommate/ExistingRoommate';

import { H1, H3 } from 'assets/styles';
import guarantor from 'assets/images/guarantor.png';
import coapplicants from 'assets/images/coapplicants.png';
import cat from 'assets/images/cat.svg';
import addparking from 'assets/images/addparking.svg';
import addstorage from 'assets/images/addstorage.svg';
import addwinecooler from 'assets/images/wine.png';

const SkinnyH1 = styled(H1)`
    width: 70%;
`;

const SpacedH3 = styled(H3)`
    margin-top: 15px;
    margin-bottom: 30px;
`;

export class RentalProfileOptions extends React.Component {
    state = { submitting: false, hasError: false };

    setScrollPosition = () => {
        // taken from https://github.com/ReactTraining/react-router/issues/394#issuecomment-128148470
        window.location.hash = window.decodeURIComponent(window.location.hash);
        const scrollToAnchor = () => {
            const hashParts = window.location.hash.split('#');
            if (hashParts.length > 1) {
                const hash = hashParts[1];
                const hashElement = document.querySelector(`#${hash}`);
                if (!!hashElement) {
                    hashElement.scrollIntoView();
                }
            }
        };
        scrollToAnchor();
        window.onhashchange = scrollToAnchor;
    };

    componentDidMount() {
        if (!this.props.profile) return null;
        this.setScrollPosition();
        return null;
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.profile && !!this.props.profile) {
            this.setScrollPosition();
        }
    }

    onContinue = async () => {
        this.props.toggleLoader(true);
        this.setState({ submitting: true });

        try {
            await this.props.pageComplete(RENTER_PROFILE_IDENTIFIER);
        } catch {
            this.setState({ hasError: true });
        } finally {
            this.props.toggleLoader(false);
            this.setState({ submitting: false });
        }
        this.props._nextRoute();
    };

    get configurableRentalOptions() {
        const activeRentalOptions = new Set([RENTER_PROFILE_TYPE_CO_APPLICANTS]);
        Object.keys(this.props.config.rental_options).forEach((key) => activeRentalOptions.add(key.toLowerCase()));
        if (this.props.config.allow_guarantors) {
            activeRentalOptions.add(RENTER_PROFILE_TYPE_GUARANTOR);
        }
        return activeRentalOptions;
    }

    get existingPets() {
        const existingPets = [];
        if (this.props.profile.selected_rental_options.pets) {
            this.props.profile.selected_rental_options.pets.forEach((item) =>
                existingPets.push(...item.leasing_context.pets)
            );
        }
        return existingPets;
    }

    filterOptions = (option) =>
        this.props.profile.selected_rental_options[option]
            ? this.props.profile.selected_rental_options[option].filter((option) => option.quantity > 0)
            : [];

    render() {
        if (this.props.profile == null) return null;
        const hashValue = !!this.props.location.hash ? this.props.location.hash.substring(1) : '';
        const filteredParking = this.filterOptions(RENTER_PROFILE_TYPE_PARKING);
        const filteredStorage = this.filterOptions(RENTER_PROFILE_TYPE_STORAGE);
        const filteredWineCooler = this.filterOptions(RENTER_PROFILE_TYPE_WINE_COOLER);
        const options = this.configurableRentalOptions;
        const people = this.props.profile.co_applicants
            .concat(this.props.profile.occupants)
            .concat(this.props.profile.dependents);

        return (
            <Fragment>
                <SkinnyH1>Let&apos;s Set Up Your Rental Profile</SkinnyH1>
                <SpacedH3>Complete the sections that apply to you and skip the ones that don&apos;t.</SpacedH3>
                {this.state.hasError && (
                    <GenericFormMessage type="error" messages="Oops, something went wrong. Try again." />
                )}
                <div>
                    {options.has(RENTER_PROFILE_TYPE_CO_APPLICANTS) && (
                        <Capsule
                            prefix={<img alt="coapplicants" src={coapplicants}></img>}
                            name={RENTER_PROFILE_TYPE_CO_APPLICANTS}
                            label="I'll be living with other people"
                            buttonLabel={!!people.length ? 'Add Another Person' : 'Add a Person'}
                            route={ROUTES.CO_APPLICANTS}
                            expansionPanel={
                                !!people.length && (
                                    <ExistingItemsExpansionPanel
                                        label="Roommates"
                                        labelQuantity={people.length}
                                        defaultExpanded={hashValue === RENTER_PROFILE_TYPE_CO_APPLICANTS}
                                    >
                                        {this.props.profile.co_applicants.map((item) => (
                                            <ExistingRoommate
                                                key={`co_applicant-${item.id}`}
                                                item={item}
                                                type={RENTER_PROFILE_TYPE_CO_APPLICANTS}
                                            />
                                        ))}
                                        {this.props.profile.occupants.map((item) => (
                                            <ExistingRoommate
                                                key={`occupant-${item.id}`}
                                                item={item}
                                                type={RENTER_PROFILE_TYPE_OCCUPANT}
                                            />
                                        ))}
                                        {this.props.profile.dependents.map((item) => (
                                            <ExistingRoommate
                                                key={`dependent-${item.id}`}
                                                item={item}
                                                type={RENTER_PROFILE_TYPE_DEPENDENT}
                                            />
                                        ))}
                                    </ExistingItemsExpansionPanel>
                                )
                            }
                        />
                    )}
                    {options.has(RENTER_PROFILE_TYPE_GUARANTOR) && (
                        <Capsule
                            prefix={<img alt="coins" src={guarantor}></img>}
                            name={RENTER_PROFILE_TYPE_GUARANTOR}
                            label="I'll need a guarantor"
                            buttonLabel="Invite a guarantor"
                            route={ROUTES.GUARANTOR}
                            tip="This is a person that agrees to be legally responsible for the apartment, its condition, and the money owed for rent if you are unable to pay."
                            limitReached={!!this.props.profile.primary_applicant.guarantors.length}
                            expansionPanel={
                                !!this.props.profile.primary_applicant.guarantors.length && (
                                    <ExistingItemsExpansionPanel
                                        label="Guarantor"
                                        labelQuantity={this.props.profile.primary_applicant.guarantors.length}
                                        defaultExpanded={hashValue === RENTER_PROFILE_TYPE_GUARANTOR}
                                    >
                                        {this.props.profile.primary_applicant.guarantors.map((item) => (
                                            <ExistingRoommate
                                                key={`guarantor-${item.id}`}
                                                item={item}
                                                type={RENTER_PROFILE_TYPE_GUARANTOR}
                                            />
                                        ))}
                                    </ExistingItemsExpansionPanel>
                                )
                            }
                        />
                    )}
                    {options.has(RENTER_PROFILE_TYPE_PETS) && (
                        <Capsule
                            prefix={<img alt="dog" src={cat} />}
                            name={RENTER_PROFILE_TYPE_PETS}
                            label="I'll be living with pets"
                            buttonLabel={this.existingPets.length ? 'Manage pets' : 'Add a pet'}
                            route={ROUTES.PETS}
                            expansionPanel={
                                !!this.existingPets.length && (
                                    <ExistingItemsExpansionPanel
                                        label="Pets"
                                        labelQuantity={this.existingPets.length}
                                        defaultExpanded={hashValue === RENTER_PROFILE_TYPE_PETS}
                                    >
                                        {this.existingPets.map((item, index) => (
                                            <ExistingPet key={index} item={item} />
                                        ))}
                                    </ExistingItemsExpansionPanel>
                                )
                            }
                        />
                    )}
                    {options.has(RENTER_PROFILE_TYPE_PARKING) && (
                        <Capsule
                            prefix={<img src={addparking} alt="car parking" />}
                            name={RENTER_PROFILE_TYPE_PARKING}
                            label="I'll need parking"
                            buttonLabel={filteredParking.length > 0 ? 'Manage Parking' : 'Add Parking'}
                            route={ROUTES.PARKING}
                            expansionPanel={
                                filteredParking.length > 0 && (
                                    <ExistingItemsExpansionPanel
                                        label="Parking Space"
                                        labelQuantity={this.props.profile.selected_rental_options.parking.reduce(
                                            (totalSelected, selectedOption) => {
                                                return (totalSelected += selectedOption.quantity);
                                            },
                                            0
                                        )}
                                        defaultExpanded={hashValue === RENTER_PROFILE_TYPE_PARKING}
                                    >
                                        {filteredParking.map((item) => (
                                            <ExistingGenericRentalOption
                                                key={item.id}
                                                quantity={item.quantity}
                                                rentalOption={item.rental_option}
                                            />
                                        ))}
                                    </ExistingItemsExpansionPanel>
                                )
                            }
                        />
                    )}
                    {options.has(RENTER_PROFILE_TYPE_STORAGE) && (
                        <Capsule
                            prefix={<img src={addstorage} alt="storage" />}
                            name={RENTER_PROFILE_TYPE_STORAGE}
                            label="I'll need storage"
                            buttonLabel={filteredStorage.length > 0 ? 'Manage Storage' : 'Add Storage'}
                            route={ROUTES.STORAGE}
                            expansionPanel={
                                filteredStorage.length > 0 && (
                                    <ExistingItemsExpansionPanel
                                        label="Storage Space"
                                        labelQuantity={this.props.profile.selected_rental_options.storage.reduce(
                                            (totalSelected, selectedOption) => {
                                                return (totalSelected += selectedOption.quantity);
                                            },
                                            0
                                        )}
                                        defaultExpanded={hashValue === RENTER_PROFILE_TYPE_STORAGE}
                                    >
                                        {filteredStorage.map((item) => (
                                            <ExistingGenericRentalOption
                                                key={item.id}
                                                quantity={item.quantity}
                                                rentalOption={item.rental_option}
                                            />
                                        ))}
                                    </ExistingItemsExpansionPanel>
                                )
                            }
                        />
                    )}
                    {options.has(RENTER_PROFILE_TYPE_WINE_COOLER) && (
                        <Capsule
                            prefix={<img src={addwinecooler} alt="wine_cooler" />}
                            name={RENTER_PROFILE_TYPE_WINE_COOLER}
                            label="I'll need a cooler to store wine"
                            buttonLabel={filteredWineCooler.length > 0 ? 'Manage Wine Coolers' : 'Add Wine Cooler'}
                            route={ROUTES.WINE_COOLER}
                            expansionPanel={
                                filteredWineCooler.length > 0 && (
                                    <ExistingItemsExpansionPanel
                                        label="Wine Cooler"
                                        labelQuantity={this.props.profile.selected_rental_options['wine-cooler'].reduce(
                                            (totalSelected, selectedOption) => {
                                                return (totalSelected += selectedOption.quantity);
                                            },
                                            0
                                        )}
                                        defaultExpanded={hashValue === RENTER_PROFILE_TYPE_WINE_COOLER}
                                    >
                                        {filteredWineCooler.map((item) => (
                                            <ExistingGenericRentalOption
                                                key={item.id}
                                                quantity={item.quantity}
                                                rentalOption={item.rental_option}
                                            />
                                        ))}
                                    </ExistingItemsExpansionPanel>
                                )
                            }
                        />
                    )}
                </div>
                <ActionButton
                    disabled={this.state.submitting}
                    onClick={this.onContinue}
                    marginTop={60}
                    marginBottom={27}
                >
                    Continue
                </ActionButton>
                <BackLink to={this.props._prev} />
            </Fragment>
        );
    }
}

RentalProfileOptions.propTypes = {
    updateRenterProfile: PropTypes.func.isRequired,
    pageComplete: PropTypes.func,
    config: PropTypes.object,
    profile: PropTypes.object,
    location: PropTypes.object,
    toggleLoader: PropTypes.func,
    _nextRoute: PropTypes.func,
    _prev: PropTypes.string,
};

const mapStateToProps = (state) => ({
    config: state.configuration,
    profile: state.renterProfile,
});

const mapDispatchToProps = {
    updateRenterProfile,
    pageComplete,
    toggleLoader: modalActions.toggleLoader,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRelativeRoutes(RentalProfileOptions, ROUTES.PROFILE_OPTIONS));
