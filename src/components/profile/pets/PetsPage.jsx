import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Formik, FieldArray } from 'formik';
import * as Yup from 'yup';
import uuidv4 from 'uuid/v4';

import { H1, H3, P } from 'assets/styles';
import { viewPetPolicy, petsImageMargin, policyDiv } from './styles';
import { updateRenterProfile } from 'reducers/renter-profile';
import PetItem from './PetItem';
import FormTextInput from 'components/common/FormTextInput/FormTextInput';
import petsImage from 'assets/images/pets.png';
import PetPolicy from 'components/profile/pets/PetPolicy';
import AddAnotherButton from 'components/common/AddAnotherButton';
import ActionButton from 'components/common/ActionButton/ActionButton';
import BackLink from 'components/common/BackLink';
import { ROUTES } from 'app/constants';
import withRelativeRoutes from 'app/withRelativeRoutes';

export class PetsPage extends React.Component {
    state = {
        viewPetPolicy: false,
        errors: null
    }

    toggleViewPetPolicy = () => {
        this.setState({viewPetPolicy: !this.state.viewPetPolicy})
    }

    onSubmit = (values, { setSubmitting }) => {
        // ignore form values without pet type
        const payload = values.petOptions.filter(option => !!option.pet_type);
        this.props.updateRenterProfile({pets: payload}).then((res) => {
            setSubmitting(false);
        }).catch((res) => {
            this.setState({errors: res.errors});
            setSubmitting(false);
        });
    }

    renderDogFields (petOption, handleChange, handleBlur, index) {
        return (
            <Fragment>
                <FormTextInput
                    label="Dog Name"
                    name={`petOptions[${index}].name`}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    value={petOption.name}
                />
                <FormTextInput
                    label="Breed"
                    name={`petOptions[${index}].breed`}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    value={petOption.breed}
                />
                <FormTextInput
                    label="Weight"
                    name={`petOptions[${index}].weight`}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    value={petOption.weight}
                    endAdornment={<span style={{color: '#828796'}}>Lb</span>}
                />
            </Fragment>
        );
    }

    renderCatFields (petOption, handleChange, handleBlur, index) {
        return (
            <Fragment>
                <FormTextInput
                    label="Cat Name"
                    name={`petOptions[${index}].name`}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    value={petOption.name}
                />
                <FormTextInput
                    label="Weight"
                    name={`petOptions[${index}].weight`}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    value={petOption.weight}
                    endAdornment={<span style={{color: '#828796'}}>Lb</span>}
                />
            </Fragment>
        );
    }

    renderOtherFields (petOption, handleChange, handleBlur, index) {
        return (
            <Fragment>
                <FormTextInput
                    label="Description"
                    name={`petOptions[${index}].description`}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    value={petOption.description}
                    helperText="Please share a bit about your pet"
                />
            </Fragment>
        );
    }

    render () {
        if (!this.props.profile) return null;
        if (this.state.viewPetPolicy) {
            return <PetPolicy date="April 2019" policy="no poopy doggies" onAgree={this.toggleViewPetPolicy}/>
        }
        const selectedPetOptions = this.props.profile.pets || [{}];
        return (
            <Fragment>
                <H1>Tell Us About Your Pets</H1>
                <H3>Now is the time to gush about your pets, we are all ears.</H3>
                <img className={petsImageMargin} src={petsImage} alt="cartoon of a person playing with a dog"/>
                <div className={policyDiv}>
                    <P>Have you read the pet policy? <span role="button" onClick={this.toggleViewPetPolicy} className={viewPetPolicy}>Read it now!</span></P>
                </div>
                <Formik
                    validationSchema={Yup.object().shape({
                        petOptions: Yup.array()
                            // .of(
                            //     Yup.object().shape({
                            //         petType: Yup.string()
                            //             .required('Required'),
                            //     })
                            // )
                            .required('Select a Pet')
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
                                                />
                                            ))
                                        }
                                        <AddAnotherButton
                                            thing="Pet"
                                            onClick={() => arrayHelpers.push({key: uuidv4()})}
                                        />
                                    </div>
                                )}
                            />
                            <ActionButton disabled={isSubmitting} marginTop="55px" marginBottom="20px">Next</ActionButton>
                        </form>
                    )}
                </Formik>
                <BackLink to={this.props._prev || '/'}/>
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    profile: state.renterProfile
})

const connectedPetsPage = connect(mapStateToProps, {updateRenterProfile})(PetsPage);
export default withRelativeRoutes(connectedPetsPage, ROUTES.PETS);
