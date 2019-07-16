import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { connect } from 'react-redux';
import {css} from 'emotion';
import Grid from '@material-ui/core/Grid';
import lightbulb from 'assets/images/lightbulb.png';
import statusFolder from 'assets/images/statusFolder.png';


import { H1, SpacedH3, Card, CardSection, P } from 'assets/styles';

const CardRow = styled.div`
    display: flex;
    padding: 10px 0;
    border-bottom: 1px solid #EEEEEE;
    &:first-of-type {
        padding-top: 0;
    }
    &:last-of-type {
        border-bottom: none;
        padding-bottom: 0;
    }
`

const FolderImage = styled.img`
width: 89px;
height: 85px;
`

const BulbImage = styled.img`
    width: 46px;
    height: 42px;
`

const statusBlurb = css`
    color: #454B57;
    font-size: 14px;
`

const leftText = css`
    text-align: left;
`

const gridContainer = css`
    padding: 20px 0 20px 0;
`


export class AppStatusPage extends React.Component {

    renderPersonRow(person, label) {
        return <CardRow>
            <div>
                <P>{`${person.first_name} ${person.last_name}`}</P>
                <P fontSize={14} color="#828796" margin="5px 0 0 0">{label}</P>
            </div>
            <div>{/* Applicant Status to be added here */}</div>
        </CardRow>
    }

    renderCoApplicants(coApplicants) {
        return coApplicants.map(coApp => {
            return this.renderPersonRow(coApp, 'Roommate')

        })
    }

    render () {
        if (!this.props.profile || ! this.props.configuration) return null;       
        const { profile, configuration } = this.props;
        const { unit, primary_applicant, co_applicants, guarantor } = profile;
        const buildingName = configuration.community.building_name || configuration.community.normalized_street_address;
        return (
            <Fragment>
                <H1>Hooray! You're done.</H1>
                <SpacedH3>We'll notify you about your application status, but you can always come back here to check the progress!</SpacedH3>
                <FolderImage src={statusFolder}/>
                <div className={gridContainer}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={2}>
                            <BulbImage alt="light bulb" src={lightbulb} />
                        </Grid>
                        <Grid item xs={9} classes={{ root: leftText }}>
                            <span className={statusBlurb}>Once the application’s reviewed, you’ll get an email detailing next steps.</span>
                        </Grid>
                    </Grid>
                </div>
                <Card>
                    <CardSection>
                        <CardRow>
                            <P bold>Application Status</P>
                        </CardRow>
                        <CardRow>
                            <div>
                                <P>{buildingName}</P>
                                <P fontSize={14} color="#828796">{unit && `Unit ${unit}`}</P>
                            </div>
                            <div>{/* Application Status to be added here */}</div>
                        </CardRow>
                    </CardSection>
                </Card>
                <Card>
                    <CardSection>
                        <CardRow>
                            <P bold>Applicant Status</P>
                        </CardRow>
                        { primary_applicant && this.renderPersonRow(primary_applicant, 'Main Applicant')}
                        { 
                            co_applicants && co_applicants.map(coApp => {
                                return this.renderPersonRow(coApp, 'Roommate')
                            })
                        }
                    </CardSection>
                </Card>
                { 
                    guarantor && 
                        <Card>
                            <CardSection>
                                <CardRow>
                                    <P bold>Guarantor Status</P>
                                </CardRow> 
                                {this.renderPersonRow(guarantor, 'Guarantor')}
                            </CardSection>
                        </Card>
                }
            </Fragment>
        )
    }
}

AppStatusPage.propTypes = {
    profile: PropTypes.object,
    configuration: PropTypes.object,
}


const mapStateToProps = state => ({
    profile: state.renterProfile,
    configuration: state.configuration,    
})

export default connect(mapStateToProps, null)(AppStatusPage);