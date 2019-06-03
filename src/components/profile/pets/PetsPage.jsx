import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Formik } from 'formik';


import { H1, H3, P } from 'assets/styles';
import { petPolicy, petsImageMargin, policyDiv } from './styles'
import PetTypeSelect from './PetTypeSelect';
import petsImage from 'assets/images/pets.png';
import PetPolicy from 'components/profile/pets/PetPolicy';
import ActionButton from 'components/common/ActionButton/ActionButton';
import { ROUTES } from 'app/constants';
import API from 'app/api';
import withRelativeRoutes from 'app/withRelativeRoutes';
import { selectors } from 'reducers/configuration';


export class PetsPage extends React.Component {
    state = {
        viewPetPolicy: false, 
        errors: null};

    toggleViewPetPolicy = () => {
        this.setState({viewPetPolicy: !this.state.viewPetPolicy})
    }

    onSubmit = (values, { setSubmitting }) => {
        debugger;
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
        return (
            <Fragment>
                <H1>Tell Us About Your Pets</H1>
                <H3>Now is the time to gush about your pets, we are all ears.</H3>
                <img className={petsImageMargin} src={petsImage} alt="cartoon of a person playing with a dog"/>
                <div className={policyDiv}>
                    <P>Have you read the pet policy? <span onClick={this.toggleViewPetPolicy} className={petPolicy}>Read it now!</span></P>
                </div>
                <Formik onSubmit={this.onSubmit} initalValues={{petType:''}}>
                    {({
                        values,
                        setFieldValue,
                        isSubmitting,
                        handleSubmit,
                    }) => (
                        <form onSubmit={handleSubmit} autoComplete="off">
                            <PetTypeSelect
                                onChange={(value) => setFieldValue('petType', value)}
                                value={values.petType}
                            />
                            <ActionButton disabled={isSubmitting || !values.petType} marginTop="55px" marginBottom="20px">Next</ActionButton>
                        </form>
                    )}
                </Formik>
                    <Link to={this.props._prev}>Go Back</Link>
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    theme: selectors.selectTheme(state)
})

const connectedPetsPage = connect(mapStateToProps, null)(PetsPage);
export default withRelativeRoutes(connectedPetsPage, ROUTES.PETS);
