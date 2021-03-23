import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import clsx from 'clsx';
import { FieldArray, Formik } from 'formik';
import * as Yup from 'yup';
import uuidv4 from 'uuid/v4';
import groupBy from 'lodash/groupBy';

import {
    RENTAL_OPTIONS_PETS_CATS,
    RENTAL_OPTIONS_PETS_DOGS,
    RENTAL_OPTIONS_PETS_OTHER,
    RENTER_PROFILE_TYPE_PETS,
    ROUTES,
} from 'constants/constants';
import { rentalOptionsInitialValues } from 'utils/misc';

import { updateRenterProfile } from 'reducers/renter-profile';
import { actions as modalActions } from 'reducers/loader';

import AddAnotherButton from 'common-components/AddAnotherButton/AddAnotherButton';
import ActionButton from 'common-components/ActionButton/ActionButton';
import BackLink from 'common-components/BackLink/BackLink';
import PriceBreakdown from 'common-components/PriceBreakdown/PriceBreakdown';
import PetItem from 'pages/RenterProfile/components/PetItem';
import PetPolicy from 'pages/RenterProfile/components/PetPolicy';
import PetRestrictions from 'pages/RenterProfile/components/PetRestrictions';
import { H1, P, SpacedH3 } from 'assets/styles';
import { petsImageMargin, policyDiv, viewPetPolicy as viewPetPolicyClassName } from './PetsPageStyles';
import petsImage from 'assets/images/pets.png';
import { generatePath } from 'react-router';

export const petsSchema = (config) =>
    Yup.object().shape({
        petOptions: Yup.array().of(
            Yup.object({
                name: Yup.string().when('pet_type', {
                    is: (value) => [RENTAL_OPTIONS_PETS_DOGS, RENTAL_OPTIONS_PETS_CATS].includes(value),
                    then: Yup.string().required('Required'),
                    otherwise: Yup.string().notRequired(),
                }),
                weight: Yup.number().when('pet_type', {
                    is: (value) => [RENTAL_OPTIONS_PETS_DOGS, RENTAL_OPTIONS_PETS_CATS].includes(value),
                    then: Yup.number()
                        .typeError('Please enter numbers only')
                        .required('Required')
                        .max(
                            config.petMaxWeight,
                            `Your pet exceeds the maximum allowed weight of ${config.petMaxWeight} lb. Please call us at ${config.communityPhoneNumber} before continuing your application.`
                        ),
                    otherwise: Yup.number().notRequired(),
                }),
                breed: Yup.string().when('pet_type', {
                    is: RENTAL_OPTIONS_PETS_DOGS,
                    then: Yup.string().required('Required'),
                    otherwise: Yup.string().notRequired(),
                }),
                description: Yup.string().when('pet_type', {
                    is: RENTAL_OPTIONS_PETS_OTHER,
                    then: Yup.string().required('Required'),
                    otherwise: Yup.string().notRequired(),
                }),
            })
        ),
    });

const FIRST_PET = { key: 'first-pet', service_animal: 'false' };
const PET_PLACEHOLDER = { key: 'pet-placeholder', service_animal: 'false' };

export class PetsPage extends Component {
    state = {
        viewPetPolicy: false,
        viewPetRestrictions: false,
        errors: null,
    };

    getUrl = () => {
        return generatePath(`${ROUTES.PROFILE_OPTIONS}#${RENTER_PROFILE_TYPE_PETS}`, {
            application_id: this.props.application.id,
        });
    };

    emptyPetFilter = (petOption) => {
        const keys = Object.keys(petOption);

        return !(
            keys.length === 2 &&
            petOption[keys[0]] === PET_PLACEHOLDER.key &&
            petOption[keys[1]] === PET_PLACEHOLDER.service_animal
        );
    };

    isFirstPetEmpty = (pets) => {
        const [firstPet] = pets;
        const keys = Object.keys(firstPet);

        if (
            keys.length === 2 &&
            (firstPet[keys[0]] === FIRST_PET.key || firstPet[keys[0]] === PET_PLACEHOLDER.key) &&
            (firstPet[keys[1]] === FIRST_PET.service_animal || firstPet[keys[1]] === PET_PLACEHOLDER.service_animal)
        ) {
            return true;
        }

        return false;
    };

    serializePetsForPost = (petOptions) => {
        const petRentalOptions = this.props.configuration.rental_options.pets;

        const groupedPets = groupBy(petOptions, 'pet_type');
        const selectedRentalOptionsArray = Object.entries(groupedPets).reduce((selectedRentalOptions, petType) => {
            const selectedPetType = petType[0];
            const petsObject = petType[1];
            const rentalOptionId = petRentalOptions.find((option) => option.leasing_category === selectedPetType)?.id;

            if (rentalOptionId) {
                const amountOfAnimals = petsObject.length;
                const amountOfServiceAnimals = petsObject.filter(
                    ({ service_animal }) => service_animal === true || service_animal === 'true'
                ).length;

                const formattedSelectedOption = {
                    rental_option: {
                        id: parseInt(rentalOptionId),
                    },
                    quantity: amountOfAnimals,
                    exempted: amountOfServiceAnimals,
                    leasing_context: {
                        pets: petsObject,
                    },
                };
                return [...selectedRentalOptions, formattedSelectedOption];
            }

            return selectedRentalOptions;
        }, []);

        // need to add a selected rental option with zero if none are selected to handle removal
        petRentalOptions.forEach((rentalOption) => {
            const rentalOptionId = parseInt(rentalOption.id);
            if (!selectedRentalOptionsArray.find((option) => option.rental_option.id === rentalOptionId)) {
                selectedRentalOptionsArray.push({
                    rental_option: {
                        id: rentalOptionId,
                    },
                    quantity: 0,
                    exempted: 0,
                    leasing_context: {
                        pets: [],
                    },
                });
            }
        });

        return selectedRentalOptionsArray;
    };

    toggleViewPetPolicy = () => {
        this.setState({ viewPetPolicy: !this.state.viewPetPolicy });
    };

    toggleViewPetRestrictions = () => {
        this.setState({ viewPetRestrictions: !this.state.viewPetRestrictions });
    };

    onSubmit = (values, { setSubmitting }) => {
        const pets = this.serializePetsForPost(values.petOptions.filter(this.emptyPetFilter));

        this.props.toggleLoader(true);

        this.props
            .updateRenterProfile({ selected_rental_options: pets })
            .then(() => {
                this.props.history.push(this.getUrl());
            })
            .catch((res) => {
                this.setState({ errors: res.errors });
            })
            .finally(() => {
                this.props.toggleLoader(false);
                setSubmitting(false);
            });
    };

    handleDelete = (arrayHelpers, index) => {
        arrayHelpers.remove(index);

        if (index === 0) {
            arrayHelpers.push(PET_PLACEHOLDER);
        }
    };

    getPriceBreakdownSelectedOptions = (values) => {
        const selectedRentalOptionsArray = this.serializePetsForPost(values.petOptions);
        return rentalOptionsInitialValues(
            selectedRentalOptionsArray,
            this.props.configuration.rental_options['pets'] || []
        );
    };

    render() {
        if (!this.props.profile || !this.props.configuration) return null;
        const { configuration, profile } = this.props;
        const { community, rental_options } = configuration;
        const petTypeOptions = (rental_options.pets || []).map((option) => option.leasing_category);
        const { viewPetPolicy, viewPetRestrictions } = this.state;

        const selectedPetOptions = [];
        if (profile.selected_rental_options.pets) {
            profile.selected_rental_options.pets.forEach((item) =>
                selectedPetOptions.push(...item.leasing_context.pets)
            );
        }

        const initialOptions = !!selectedPetOptions.length ? selectedPetOptions : [FIRST_PET];

        return (
            <>
                <div className={clsx({ 'hide-element': viewPetPolicy || viewPetRestrictions })}>
                    <H1>Tell Us About Your Pets</H1>
                    <SpacedH3>Now is the time to gush about your pets, we are all ears.</SpacedH3>
                    <img className={petsImageMargin} src={petsImage} alt="cartoon of a person playing with a dog" />
                    <div className={policyDiv}>
                        <P fontSize={14}>
                            Have you read the pet policy?{' '}
                            <span role="button" onClick={this.toggleViewPetPolicy} className={viewPetPolicyClassName}>
                                Read it now!
                            </span>
                        </P>
                    </div>
                    <Formik
                        validationSchema={petsSchema({
                            petMaxWeight:
                                configuration.community.pets_max_weight == null
                                    ? Infinity
                                    : configuration.community.pets_max_weight,
                            communityPhoneNumber: configuration.community.contact_phone,
                        })}
                        onSubmit={this.onSubmit}
                        initialValues={{ petOptions: initialOptions }}
                    >
                        {({ values, handleChange, handleBlur, isSubmitting, handleSubmit, dirty }) => {
                            const disableSubmit = !dirty || isSubmitting;
                            const isFirstPetEmpty = this.isFirstPetEmpty(values.petOptions);
                            const submitLabel =
                                values.petOptions.length === 1 && values.petOptions[0].key === 'first-pet'
                                    ? 'Add Pet'
                                    : 'Save Changes';
                            const showPaymentBreakdown = values.petOptions.length > 0 && !isFirstPetEmpty;

                            return (
                                <form className="text-left" onSubmit={handleSubmit} autoComplete="off">
                                    <FieldArray
                                        name="petOptions"
                                        render={(arrayHelpers) => (
                                            <div>
                                                {values.petOptions.map((petOption, index) => {
                                                    return (
                                                        <PetItem
                                                            key={index}
                                                            arrayHelpers={arrayHelpers}
                                                            index={index}
                                                            petOption={petOption}
                                                            handleChange={handleChange}
                                                            handleDelete={this.handleDelete}
                                                            handleBlur={handleBlur}
                                                            toggleViewPetRestrictions={this.toggleViewPetRestrictions}
                                                            petTypeOptions={petTypeOptions}
                                                        />
                                                    );
                                                })}
                                                {/* we do not currently address limits. we will need to get limit for each type of pet.
                                                    values.petOptions.length < rental_options_config.pets.limit ?
                                                    <AddAnotherButton
                                                        thing="Pet"
                                                        onClick={() => arrayHelpers.push({key: uuidv4()})}
                                                    />: null
                                                    */}
                                                <AddAnotherButton
                                                    thing="Pet"
                                                    onClick={() => arrayHelpers.push({ key: uuidv4() })}
                                                />
                                                <br />
                                                <br />
                                                {showPaymentBreakdown && (
                                                    <PriceBreakdown
                                                        category={'Pets'}
                                                        categoryHelperText={'pets'}
                                                        application={this.props.application}
                                                        selectedOptions={this.getPriceBreakdownSelectedOptions(values)}
                                                        moveInDate={this.props.application.lease_start_date}
                                                    />
                                                )}
                                            </div>
                                        )}
                                    />
                                    <ActionButton disabled={disableSubmit} marginTop={55} marginBottom={20}>
                                        {submitLabel}
                                    </ActionButton>
                                </form>
                            );
                        }}
                    </Formik>
                    <BackLink to={this.getUrl()} />
                </div>
                {viewPetPolicy && (
                    <PetPolicy date="April 2019" policy={community.pets_notes} onAgree={this.toggleViewPetPolicy} />
                )}
                {viewPetRestrictions && (
                    <PetRestrictions
                        breedPolicy={community.pets_restrictions}
                        contactPhone={community.contact_phone}
                        onAgree={this.toggleViewPetRestrictions}
                    />
                )}
            </>
        );
    }
}

PetsPage.propTypes = {
    profile: PropTypes.object,
    application: PropTypes.object,
    configuration: PropTypes.object,
    history: PropTypes.object,
    toggleLoader: PropTypes.func,
    updateRenterProfile: PropTypes.func,
};

const mapStateToProps = (state) => ({
    profile: state.renterProfile,
    configuration: state.configuration,
    application: state.renterProfile,
});

const mapDispatchToProps = {
    updateRenterProfile,
    toggleLoader: modalActions.toggleLoader,
};

export default connect(mapStateToProps, mapDispatchToProps)(PetsPage);
