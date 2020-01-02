import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import clsx from  'clsx';
import { Formik, FieldArray } from 'formik';
import * as Yup from 'yup';
import uuidv4 from 'uuid/v4';
import groupBy from 'lodash/groupBy';

import { H1, P, SpacedH3 } from 'assets/styles';
import { viewPetPolicy as viewPetPolicyClassName, petsImageMargin, policyDiv } from './styles';
import { updateRenterProfile } from 'reducers/renter-profile';
import PetItem from './PetItem';
import petsImage from 'assets/images/pets.png';
import PetPolicy from 'components/profile/pets/PetPolicy';
import PetRestrictions from 'components/profile/pets/PetRestrictions';
import AddAnotherButton from 'components/common/AddAnotherButton';
import ActionButton from 'components/common/ActionButton/ActionButton';
import BackLink from 'components/common/BackLink';
import { ROUTES } from 'app/constants';
import withRelativeRoutes from 'app/withRelativeRoutes';

const RENTAL_OPTIONS_PETS_DOGS = 'pets-dogs';
const RENTAL_OPTIONS_PETS_CATS = 'pets-cats';
const RENTAL_OPTIONS_PETS_OTHER = 'pets-other';
const rentalOptiontoLabelMap = {
    [RENTAL_OPTIONS_PETS_DOGS]: "Dog",
    [RENTAL_OPTIONS_PETS_CATS]: "Cat",
    [RENTAL_OPTIONS_PETS_OTHER]: "Other",
};
const labeltoRentalOptionMap = {
    "Dog": RENTAL_OPTIONS_PETS_DOGS,
    "Cat": RENTAL_OPTIONS_PETS_CATS,
    "Other": RENTAL_OPTIONS_PETS_OTHER,
};

export const petsSchema = (config) => Yup.object().shape({
    petOptions: Yup.array()
        .of(
            Yup.object({
                pet_type: Yup.string()
                    .required('Required'),
                name: Yup.string().when('pet_type', {
                    is: (value) => ['Dog', 'Cat'].includes(value),
                    then: Yup.string()
                        .required('Required'),
                    otherwise: Yup.string().notRequired()
                }),
                weight: Yup.number().when('pet_type', {
                    is: (value) => ['Dog', 'Cat'].includes(value),
                    then: Yup.number().typeError('Please enter numbers only')
                        .required('Required').max(config.petMaxWeight, `Your pet exceeds the maximum allowed weight of ${config.petMaxWeight} lb. Please call us at ${config.communityPhoneNumber} before continuing your application.`),
                    otherwise: Yup.number().notRequired()
                }),
                breed: Yup.string().when('pet_type', {
                    is: 'Dog',
                    then: Yup.string()
                        .required('Required'),
                    otherwise: Yup.string().notRequired()
                }),
                description: Yup.string().when('pet_type', {
                    is: 'Other',
                    then: Yup.string()
                        .required('Required'),
                    otherwise: Yup.string().notRequired()
                })
            })
        )
        .required('Select a Pet')
});


export class PetsPage extends React.Component {
    state = {
        viewPetPolicy: false,
        viewPetRestrictions: false,
        errors: null
    }

    serializePetsForPost = (petOptions) => {
        const petRentalOptions = this.props.configuration.options.pets;
        const cleanedPetOptions = petOptions.reduce((options, petOption) => {
            const { pet_type } = petOption;
            if (pet_type) {
                const service_animal = petOption.service_animal ?
                    petOption.service_animal :
                    'false';

                const newPetOption = {
                    ...petOption,
                    service_animal
                };
                return [...options, newPetOption];
            }
            return options;
        }, []);

        const groupedPets = groupBy(cleanedPetOptions, 'pet_type');
        const selectedOptionsArray = Object.entries(groupedPets).reduce((selectdOptions, petType) => {
            const petLabel = petType[0];
            const petsObject = petType[1];
            const rentalOptionId = petRentalOptions.find(option => option.leasing_category === labeltoRentalOptionMap[petLabel]).id;
            const formattedSelectedOption = { rental_option: {id: parseInt(rentalOptionId)}, quantity: petsObject.length, leasing_context: {pets: petsObject}};
            return [...selectdOptions, formattedSelectedOption];
        }, []);

        // need to add a selected option with zero if none are selected to handle removal
        petRentalOptions.forEach(rentalOption => {
            const rentalOptionId = parseInt(rentalOption.id);
            if (!selectedOptionsArray.find(option => option.rental_option.id === rentalOptionId)) {
                selectedOptionsArray.push({ rental_option: {id: rentalOptionId}, quantity: 0, leasing_context: {pets: []}});
            }
        });

        return selectedOptionsArray;
    }

    toggleViewPetPolicy = () => {
        this.setState({viewPetPolicy: !this.state.viewPetPolicy});
    }

    toggleViewPetRestrictions = () => {
        this.setState({viewPetRestrictions: !this.state.viewPetRestrictions});
    }

    onSubmit = (values, { setSubmitting }) => {
        const pets = this.serializePetsForPost(values.petOptions);
        this.props.updateRenterProfile({selected_options: pets}).then((res) => {
            setSubmitting(false);
            this.props._nextRoute();
        }).catch((res) => {
            this.setState({errors: res.errors});
            setSubmitting(false);
        });
    }

    render () {
        if (!this.props.profile || !this.props.configuration) return null;
        const { configuration, profile } = this.props;
        const { community, options } = configuration;
        const petTypeOptions = options.pets.map(option => rentalOptiontoLabelMap[option.leasing_category]);
        const { viewPetPolicy, viewPetRestrictions } = this.state;

        const selectedPetOptions = [];
        if (profile.selected_options.pets) {
            profile.selected_options.pets.forEach(item => selectedPetOptions.push(...item.leasing_context.pets));
        }
        const initialOptions = !!selectedPetOptions.length ? selectedPetOptions : [{key:'first-pet', service_animal: 'false'}];
        return (
            <Fragment>
                <div className={clsx({'hide-pets-form': (viewPetPolicy || viewPetRestrictions)})}>
                    <H1>Tell Us About Your Pets</H1>
                    <SpacedH3>Now is the time to gush about your pets, we are all ears.</SpacedH3>
                    <img className={petsImageMargin} src={petsImage} alt="cartoon of a person playing with a dog"/>
                    <div className={policyDiv}>
                        <P fontSize={14}>Have you read the pet policy? <span role="button" onClick={this.toggleViewPetPolicy} className={viewPetPolicyClassName}>Read it now!</span></P>
                    </div>
                    <Formik
                        validationSchema={petsSchema({
                            petMaxWeight: configuration.community.pets_max_weight == null ? Infinity : configuration.community.pets_max_weight,
                            communityPhoneNumber: configuration.community.contact_phone
                        })}
                        onSubmit={this.onSubmit}
                        initialValues={{petOptions: initialOptions}}
                    >
                        {({
                            values,
                            handleChange,
                            handleBlur,
                            isSubmitting,
                            handleSubmit,
                        }) => (
                            <form className="text-left" onSubmit={handleSubmit} autoComplete="off">
                                <FieldArray
                                    name="petOptions"
                                    render={arrayHelpers => (
                                        <div>
                                            {
                                                values.petOptions.map((petOption, index) => (
                                                    <PetItem key={petOption.key}
                                                        arrayHelpers={arrayHelpers}
                                                        index={index}
                                                        petOption={petOption}
                                                        handleChange={handleChange}
                                                        handleBlur={handleBlur}
                                                        toggleViewPetRestrictions={this.toggleViewPetRestrictions}
                                                        petTypeOptions={petTypeOptions}
                                                        totalPets={values.petOptions.length}
                                                    />
                                                ))
                                            }
                                            {/* this does not address limits. i'll do that in a separate pr bc it's gonna suuuuck.
                                            values.petOptions.length < rental_options_config.pets.limit ?
                                                <AddAnotherButton
                                                    thing="Pet"
                                                    onClick={() => arrayHelpers.push({key: uuidv4()})}
                                                />: null
                                            */}
                                            <AddAnotherButton
                                                thing="Pet"
                                                onClick={() => arrayHelpers.push({key: uuidv4()})}
                                            />
                                        </div>
                                    )}
                                />
                                <ActionButton disabled={isSubmitting} marginTop={55} marginBottom={20}>Continue</ActionButton>
                            </form>
                        )}
                    </Formik>
                    <BackLink to={this.props._prev || '/'}/>
                </div>
                { viewPetPolicy &&
                    <PetPolicy
                        date="April 2019"
                        policy={community.pets_notes}
                        onAgree={this.toggleViewPetPolicy}
                    />
                }
                { viewPetRestrictions &&
                    <PetRestrictions
                        breedPolicy={community.pets_restrictions}
                        contactPhone={community.contact_phone}
                        onAgree={this.toggleViewPetRestrictions}
                    />
                }
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    profile: state.renterProfile,
    configuration: state.configuration
});

const connectedPetsPage = connect(mapStateToProps, {updateRenterProfile})(PetsPage);
export default withRelativeRoutes(connectedPetsPage, ROUTES.PETS);
