import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';

import { ROUTES } from 'constants/constants';
import captureRoute from 'utils/captureRoute';
import ResendLinkForm from 'common-components/ResendLinkForm/ResendLinkForm';
import { PersonRow } from 'pages/ApplicationComplete/components/PersonRow';

import { FolderImage, BulbImage, statusBlurb, gridContainer } from './ApplicationCompletePageStyles';
import { H1, SpacedH3, Card, CardSection, P, leftText, CardRow } from 'assets/styles';
import lightbulb from 'assets/images/lightbulb.png';
import statusFolder from 'assets/images/statusFolder.png';

export const ApplicationCompletePage = ({ profile, configuration, applicant }) => {
    const [resendFormValues, setResendFormValues] = useState();

    if (!profile || !configuration) return null;
    if (resendFormValues) {
        return (
            <ResendLinkForm
                initialValues={resendFormValues}
                handleConfirmationClick={setResendFormValues}
                confirmationButtonText="Back to Application Status"
            />
        );
    }
    const { unit, primary_applicant, co_applicants, occupants } = profile;
    const { guarantors } = primary_applicant;
    const buildingName = configuration.community.building_name || configuration.community.normalized_street_address;
    const role = applicant.role;

    return (
        <Fragment>
            <H1>Hooray! You&apos;re done.</H1>
            <SpacedH3>
                We&apos;ll notify you about your application status, but you can always come back here to check the
                progress!
            </SpacedH3>
            <FolderImage src={statusFolder} />
            <div className={gridContainer}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={2}>
                        <BulbImage alt="light bulb" src={lightbulb} />
                    </Grid>
                    <Grid item xs={9} classes={{ root: leftText }}>
                        <span className={statusBlurb}>
                            Once the application is reviewed, you’ll get an email detailing next steps.
                        </span>
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
                            <P fontSize={14} color="#828796">
                                {unit && unit.unit_number && `Unit ${unit.unit_number}`}
                            </P>
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
                    {primary_applicant && (
                        <PersonRow
                            person={primary_applicant}
                            label="Main Applicant"
                            role={role}
                            handleClickLink={setResendFormValues}
                        />
                    )}
                    {co_applicants?.map((coApp) => (
                        <PersonRow
                            key={coApp.id}
                            person={coApp}
                            label="Roommate"
                            role={role}
                            handleClickLink={setResendFormValues}
                        />
                    ))}
                    {occupants?.map((occupant) => (
                        <PersonRow
                            key={occupant.id}
                            person={occupant}
                            label="Occupant"
                            role={role}
                            handleClickLink={setResendFormValues}
                        />
                    ))}
                </CardSection>
            </Card>
            {guarantors?.length > 0 && (
                <Card>
                    <CardSection>
                        <CardRow>
                            <P bold>Guarantor Status</P>
                        </CardRow>
                        {guarantors.map((guarantor) => (
                            <PersonRow
                                key={guarantor.id}
                                person={guarantor}
                                label="Guarantor"
                                role={role}
                                handleClickLink={setResendFormValues}
                            />
                        ))}
                    </CardSection>
                </Card>
            )}
        </Fragment>
    );
};

ApplicationCompletePage.propTypes = {
    profile: PropTypes.object,
    configuration: PropTypes.object,
    applicant: PropTypes.object,
};

const mapStateToProps = (state) => ({
    profile: state.renterProfile,
    configuration: state.configuration,
    applicant: state.applicant,
});

export default connect(mapStateToProps, null)(captureRoute(ApplicationCompletePage, ROUTES.APP_COMPLETE));
