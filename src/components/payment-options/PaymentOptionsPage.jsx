import React, { Fragment } from 'react';
import styled from '@emotion/styled';
import { connect } from 'react-redux';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';


import { ROUTES } from 'app/constants';
import withRelativeRoutes from 'app/withRelativeRoutes';
import paymentWallet from 'assets/images/payment-wallet.png';
import { Card, CardSection, CardRow, H1, P } from 'assets/styles';
import ActionButton from 'components/common/ActionButton/ActionButton';
import { BackLink } from 'components/common/BackLink';
import { formatCurrency } from 'utils/misc';


const SpacedH1 = styled(H1)`
    margin: 15px 10% 0 10%;
`

const SpacedImg = styled.img`
    margin: 15px 0;
`

const CardRowNoFlex = styled.div`
    padding: 10px 0;
    border-bottom: 1px solid #EEEEEE;
`

const OtherApplicant = styled.div`
    margin: -2px 0 10px 32px;
`

export const PaymentOptionsPage = ({configuration, _nextRoute, _prev, profile}) => {
    const [value, setValue] = React.useState('self');

    function handleChange(event) {
        setValue(event.target.value);
    }

    if (!configuration || !profile)  return <div/>;
    const otherApplicants = [];
    const reduceFunction = (acc, current) => {
        acc.push(`${current.first_name} ${current.last_name}`);
        return acc
    }
    profile.primary_applicant.guarantors && 
        profile.primary_applicant.guarantors.reduce(reduceFunction, otherApplicants);
    profile.co_applicants && 
        profile.co_applicants.reduce(reduceFunction, otherApplicants);

    return (
        <Fragment>
            <SpacedH1>Application Fees and Holding Deposit</SpacedH1>
            <SpacedImg src={paymentWallet} alt="wallet"/>
            <Card>
                <CardSection>
                    <CardRow>
                        <P bold>Application Fee</P>
                        <P bold>{formatCurrency(configuration.application_fee)}</P>
                    </CardRow>
                    <CardRowNoFlex>
                        <FormControl component="fieldset">
                            <RadioGroup
                                aria-label="payment-options"
                                name="payment-options"
                                value={value}
                                onChange={handleChange}
                            >
                                <FormControlLabel value="self" control={<Radio />} label="Just Myself" />
                                <FormControlLabel value="everyone" control={<Radio />} label="Everyone" />
                            </RadioGroup>
                        </FormControl>
                        {otherApplicants && otherApplicants.map((name, index) => <OtherApplicant key={`${name}${index}`}>{name}</OtherApplicant>)}
                    </CardRowNoFlex>                    
                </CardSection>
            </Card>
            <ActionButton onClick={_nextRoute} marginTop={30} marginBottom={20}>Continue</ActionButton>
            <BackLink to={_prev}/>
        </Fragment>
    )
}

const mapStateToProps = state => ({
    configuration: state.configuration,
    profile: state.renterProfile,
});


export default connect(mapStateToProps)(withRelativeRoutes(PaymentOptionsPage, ROUTES.PAYMENT_OPTIONS));
