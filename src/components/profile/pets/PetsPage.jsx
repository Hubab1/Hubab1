import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { H1, H3, P } from 'assets/styles';
import { petPolicy, petTypeContainer, petTypeUnselected, PetTypeSelected, 
    petsImageMargin, policyDiv, petTypeLabel } from './styles'
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
        petSelected: '',
        errors: null};

    toggleViewPetPolicy = () => {
        this.setState({viewPetPolicy: !this.state.viewPetPolicy})
    }

    handlePetClick = (type) => {
        if (this.state.petSelected === type) {
            this.setState({petSelected: ''});
        } else {
            this.setState({petSelected: type});
        }
    }

    onSubmit = (values, { setSubmitting, setErrors }) => {
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
                <div className={petTypeLabel}>Type</div>
                <div className={petTypeContainer}>
                    {['Dog', 'Cat', 'Other'].map(type => {
                        if (this.state.petSelected === type) {
                            return <PetTypeSelected 
                                key={type}
                                color={this.props.theme.palette.primary.main}
                                onClick={() => this.handlePetClick(type)}
                            >
                                {type}
                            </PetTypeSelected>
                        } else {
                            return <div 
                                key={type} 
                                className={ petTypeUnselected}
                                onClick={() => this.handlePetClick(type)}
                            >
                                {type}
                            </div>
                        }
                    })}
                </div>
                <ActionButton disabled={!this.state.petSelected} marginTop="55px" marginBottom="20px">Next</ActionButton>
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
