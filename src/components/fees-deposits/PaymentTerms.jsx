import React, {Fragment} from 'react';
import { css } from 'emotion';
import styled from '@emotion/styled';
import DoneRoundedIcon from '@material-ui/icons/CheckRounded';
import ArrowBackIos from '@material-ui/icons/ArrowBackIos'

import ActionButton from 'components/common/ActionButton/ActionButton';
import { Card, CardSection, P, H1, LinkButton, blackLinkRoot, arrowIcon } from 'assets/styles';

const SpacedH1 = styled(H1)`
    margin: 15px 10% 15px 10%;
`

const bulletBox = css`
    margin-bottom: 30px
`

export const PaymentTerms = ({handleClickBack, goToPayment}) => {
    return <Fragment>
        <SpacedH1>Application Fees and Holding Deposit</SpacedH1>
        <Card>
            <CardSection style={{maxHeight: '350px', overflow: 'auto', padding: '40px'}}>
                <div className={bulletBox}>
                    <P fontSize={15}>
                        <DoneRoundedIcon style={{color:'#56BA82', width:18, verticalAlign:'top', position:'relative', top:-2}}/>
                        {' '}
                        Applied to the security deposit
                    </P>
                    <P fontSize={15}>
                        <DoneRoundedIcon style={{color:'#56BA82', width:18, verticalAlign:'top', position:'relative', top:-2}}/>
                        {' '}
                        Refundable if cancelled within 24 hours
                    </P>
                    <P fontSize={15}>
                        <DoneRoundedIcon style={{color:'#56BA82', width:18, verticalAlign:'top', position:'relative', top:-2}}/>
                        {' '}
                        Refundable if denied
                    </P>
                </div>
                <P fontSize={12}>Applicant has deposited, with owner’s agent a holding deposit as specified below to secure the rental of the below described residential unit, subject to the following conditions:</P>
                <P fontSize={12}>1) If accepted, the holding deposit shall be applied to the security deposit due at move-in.</P>
                <P fontSize={12}>2) Applicant shall have 24hours following the date of this application to withdraw the application and receive fullrefund  of  said  holding  deposit.  (If  applicant  cancels  rental  after  24  hours  and  was  otherwise  approved,  theholding deposit is forfeited.)</P>
                <P fontSize={12}>3) Holding deposit shall be fully refunded (not application fee) in case of denial of application.</P>
                <P fontSize={12}>4) Applicant agrees to take financial responsibility of the premises onMay1,2018and pay the balance of rentdue and security deposits in full, on that date.</P>
                <P fontSize={12}>5) Applicant  agrees  to  provide  proof  of$100,000.00liability  insurance  by  lease  commencement  date.  Thepreferred provider is: erenterplan.com (888) 205-8118.6)A non-refundable application processing fee is required to prepare the rental agreement documents and toverify applicant’s credit history, rental reference and employment.7)If said premises are not vacated by present resident on proposed move-out date and the present resident isstill  in  possession,  the  holding  deposit  will  be  returned  in  full  to  applicant.  The  holding  deposit  does  notguarantee occupancy.8)Credit  approval  is  based  on:  (1)  one  year  positive  rental  history;  (2)  good  credit  (note:  late  mortgagepayments, foreclosure, or bankruptcy may result in denial); (3) one year current employment history</P>
            </CardSection>
        </Card>
        <ActionButton onClick={goToPayment} marginTop={25} marginBottom={20}>
            Agree and Continue
        </ActionButton>
        <LinkButton className={blackLinkRoot} onClick={handleClickBack}>
            <ArrowBackIos classes={{root: arrowIcon}}/> Go Back
        </LinkButton>

    </Fragment>
}

export default PaymentTerms;