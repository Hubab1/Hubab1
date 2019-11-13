import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Formik, FieldArray } from 'formik';
import * as Yup from 'yup';
import uuidv4 from 'uuid/v4';

import { H1, P, SpacedH3 } from 'assets/styles';
import { viewPetPolicy, petsImageMargin, policyDiv } from './styles';
import { updateRenterProfile } from 'reducers/renter-profile';
import PetItem from './PetItem';
import petsImage from 'assets/images/pets.png';
import PetPolicy from 'components/profile/pets/PetPolicy';
import PetBreedPolicy from 'components/profile/pets/PetBreedPolicy';
import AddAnotherButton from 'components/common/AddAnotherButton';
import ActionButton from 'components/common/ActionButton/ActionButton';
import BackLink from 'components/common/BackLink';
import { ROUTES } from 'app/constants';
import withRelativeRoutes from 'app/withRelativeRoutes';

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
                        .required('Required').max(config.petMaxWeight, `This exceeds the maximum allowed weight of ${config.petMaxWeight}.`),
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
        viewBreedPolicy: false,
        errors: null
    }

    toggleViewPetPolicy = () => {
        this.setState({viewPetPolicy: !this.state.viewPetPolicy})
    }

    toggleViewBreedPolicy = () => {
        this.setState({viewBreedPolicy: !this.state.viewBreedPolicy})
    }

    onSubmit = (values, { setSubmitting }) => {
        // ignore form values without pet type
        const payload = values.petOptions.filter(option => !!option.pet_type);
        this.props.updateRenterProfile({pets: payload}).then((res) => {
            setSubmitting(false);
            this.props._nextRoute();
        }).catch((res) => {
            this.setState({errors: res.errors});
            setSubmitting(false);
        });
    }

    render () {
        if (!this.props.profile || !this.props.configuration) return null;
        const { configuration } = this.props;
        const { community, rental_options_config } = configuration;
        if (this.state.viewPetPolicy) {
            return <PetPolicy date="April 2019" policy={rental_options_config.pets.pet_policy_details} onAgree={this.toggleViewPetPolicy}/>
        } else if (this.state.viewBreedPolicy) {
            return <PetBreedPolicy breedPolicy={community.pets_restrictions} contactPhone={community.contact_phone} onAgree={this.toggleViewBreedPolicy}/>
        }
        const selectedPetOptions = this.props.profile.pets || [{key:'first-pet'}];
        return (
            <Fragment>
                <H1>Tell Us About Your Pets</H1>
                <SpacedH3>Now is the time to gush about your pets, we are all ears.</SpacedH3>
                <img className={petsImageMargin} src={petsImage} alt="cartoon of a person playing with a dog"/>
                <div className={policyDiv}>
                    <P fontSize={14}>Have you read the pet policy? <span role="button" onClick={this.toggleViewPetPolicy} className={viewPetPolicy}>Read it now!</span></P>
                </div>
                <Formik
                    validationSchema={petsSchema({
                        petMaxWeight: community.pets_max_weight == null ? Infinity : community.pets_max_weight
                    })}
                    onSubmit={this.onSubmit}
                    initialValues={{petOptions: selectedPetOptions}}
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
                                                    toggleViewBreedPolicy={this.toggleViewBreedPolicy}
                                                />
                                            ))
                                        }
                                        {values.petOptions.length < rental_options_config.pets.limit ?
                                            <AddAnotherButton
                                                thing="Pet"
                                                onClick={() => arrayHelpers.push({key: uuidv4()})}
                                            />: null
                                        }
                                    </div>
                                )}
                            />
                            <ActionButton disabled={isSubmitting} marginTop={55} marginBottom={20}>Continue</ActionButton>
                        </form>
                    )}
                </Formik>
                <BackLink to={this.props._prev || '/'}/>
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    profile: state.renterProfile,
    configuration: state.configuration
})

const connectedPetsPage = connect(mapStateToProps, {updateRenterProfile})(PetsPage);
export default withRelativeRoutes(connectedPetsPage, ROUTES.PETS);
