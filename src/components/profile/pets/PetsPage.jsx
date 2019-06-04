import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Formik, FieldArray, Field, getIn } from 'formik';
import * as Yup from 'yup';


import { H1, H3, P, ErrorDetail } from 'assets/styles';
import { petPolicy, petsImageMargin, policyDiv } from './styles'
import PetTypeSelect from './PetTypeSelect';
import petsImage from 'assets/images/pets.png';
import PetPolicy from 'components/profile/pets/PetPolicy';
import AddAnotherButton from 'components/common/AddAnotherButton';
import ActionButton from 'components/common/ActionButton/ActionButton';
import { ROUTES } from 'app/constants';
import API from 'app/api';
import withRelativeRoutes from 'app/withRelativeRoutes';
import { selectors } from 'reducers/configuration';
import Cancel from '@material-ui/icons/Cancel';
import { css } from 'emotion';


const cancelButton = css`
    color: #828796;
`

// taken from here: https://jaredpalmer.com/formik/docs/api/fieldarray
const ErrorMessage = ({ name }) => (
    <Field
        name={name}
        render={({ form }) => {
            const error = getIn(form.errors, name);
            const touch = getIn(form.touched, name);
            return <ErrorDetail>{touch && error ? error : null}</ErrorDetail>
        }}
    />
);

export class PetsPage extends React.Component {
    state = {
        viewPetPolicy: false, 
        errors: null};

    toggleViewPetPolicy = () => {
        this.setState({viewPetPolicy: !this.state.viewPetPolicy})
    }

    onSubmit = (values, { setSubmitting }) => {
        API.addPets(values).then((res) => {
            setSubmitting(false);
        }).catch((res) => {
            this.setState({errors: res.errors});
            setSubmitting(false);
        });
    }

    render () {
        if (this.state.viewPetPolicy) {
            return <PetPolicy date="April 2019" policy="no poopy doggies" onAgree={this.toggleViewPetPolicy}/>
        }
        const selectedPetOptions = [{}];
        return (
            <Fragment>
                <H1>Tell Us About Your Pets</H1>
                <H3>Now is the time to gush about your pets, we are all ears.</H3>
                <img className={petsImageMargin} src={petsImage} alt="cartoon of a person playing with a dog"/>
                <div className={policyDiv}>
                    <P>Have you read the pet policy? <span onClick={this.toggleViewPetPolicy} className={petPolicy}>Read it now!</span></P>
                </div>
                <Formik
                    validationSchema={Yup.object().shape({
                        petOptions: Yup.array()
                            .of(
                                Yup.object().shape({
                                    petType: Yup.string()
                                        .required('Required'),
                                })
                            )
                            .required('Select a Pet')
                    })}
                    onSubmit={this.onSubmit}
                    initialValues={{petOptions: selectedPetOptions}}
                >
                    {({
                        values,
                        setFieldValue,
                        isSubmitting,
                        handleSubmit,
                    }) => (
                        <form onSubmit={handleSubmit} autoComplete="off">
                            <FieldArray
                                name="petOptions"
                                render={arrayHelpers => (
                                    <div>
                                        {
                                            values.petOptions.map((petOption, index) => (
                                                <div key={index}>
                                                    <PetTypeSelect
                                                        topAdornment={index > 0 && <Cancel style={{fontSize: 17}} className={cancelButton} onClick={() => arrayHelpers.remove(index)}/>}
                                                        onChange={(value) => setFieldValue(`petOptions[${index}].petType`, value)}
                                                        value={petOption.petType}
                                                    />
                                                    <ErrorMessage name={`petOptions[${index}].petType`} />
                                                </div>)
                                            )
                                        }
                                        <AddAnotherButton
                                            thing="Pet"
                                            onClick={() => arrayHelpers.push({})}
                                        />
                                    </div>
                                )}
                            />
                            <ActionButton disabled={isSubmitting || !values.petOptions[0].petType} marginTop="55px" marginBottom="20px">Next</ActionButton>
                        </form>
                    )}
                </Formik>
                <Link to={this.props._prev || '/'}>Go Back</Link>
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    theme: selectors.selectTheme(state)
})

const connectedPetsPage = connect(mapStateToProps, null)(PetsPage);
export default withRelativeRoutes(connectedPetsPage, ROUTES.PETS);
