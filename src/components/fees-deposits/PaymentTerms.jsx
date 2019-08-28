import React, {Fragment} from 'react';
import { css } from 'emotion';
import styled from '@emotion/styled';
import ArrowBackIos from '@material-ui/icons/ArrowBackIos'

import ActionButton from 'components/common/ActionButton/ActionButton';
import GreenCheckIcon from 'components/common/GreenCheckIcon';
import { Card, P, H1, LinkButton, ScrollableTermsCardSection, blackLinkRoot, arrowIcon } from 'assets/styles';

const SpacedH1 = styled(H1)`
    margin: 15px 10% 15px 10%;
`

const bulletBox = css`
    margin-bottom: 30px
`

const BulletP = styled(P)`
    font-size: 15px
`

const BodyP = styled(P)`
    font-size: 14px;
    margin: 0 0 12px 0;
`

// TODO: Make this consistent with TermsPage once we get designs
export const PaymentTerms = ({handleClickBack, goToPayment}) => {
    return <Fragment>
        <SpacedH1>Application Fees and Holding Deposit</SpacedH1>
        <Card>
            <ScrollableTermsCardSection>
                {/*
                    removing these for now, since the mocks removed them
                <div className={bulletBox}>
                    <BulletP>
                        <GreenCheckIcon/>
                        {' '}
                        Applied to the security deposit
                    </BulletP>
                    <BulletP>
                        <GreenCheckIcon/>{' '}
                        Refundable if cancelled within 24 hours
                    </BulletP>
                    <BulletP>
                        <GreenCheckIcon/>
                        {' '}
                        Refundable if denied
                    </BulletP>
                </div>*/}
                <BodyP>Applicant has deposited, with owner’s agent a holding deposit as specified below to secure the rental of the below described residential unit, subject to the following conditions:</BodyP>
                <BodyP>1) If accepted, the holding deposit shall be applied to the security deposit due at move-in.</BodyP>
                <BodyP>2) Applicant shall have 24hours following the date of this application to withdraw the application and receive fullrefund  of  said  holding  deposit.  (If  applicant  cancels  rental  after  24  hours  and  was  otherwise  approved,  theholding deposit is forfeited.)</BodyP>
                <BodyP>3) Holding deposit shall be fully refunded (not application fee) in case of denial of application.</BodyP>
                <BodyP>4) Applicant agrees to take financial responsibility of the premises onMay1,2018and pay the balance of rentdue and security deposits in full, on that date.</BodyP>
                <BodyP>5) Applicant  agrees  to  provide  proof  of$100,000.00liability  insurance  by  lease  commencement  date.  Thepreferred provider is: erenterplan.com (888) 205-8118.6)A non-refundable application processing fee is required to prepare the rental agreement documents and toverify applicant’s credit history, rental reference and employment.7)If said premises are not vacated by present resident on proposed move-out date and the present resident isstill  in  possession,  the  holding  deposit  will  be  returned  in  full  to  applicant.  The  holding  deposit  does  notguarantee occupancy.8)Credit  approval  is  based  on:  (1)  one  year  positive  rental  history;  (2)  good  credit  (note:  late  mortgagepayments, foreclosure, or bankruptcy may result in denial); (3) one year current employment history</BodyP>
            </ScrollableTermsCardSection>
        </Card>
        { !!handleClickBack && 
            <Fragment>
                <ActionButton onClick={goToPayment} marginTop={25} marginBottom={20}>
                    Agree and Continue
                </ActionButton>
                <LinkButton className={blackLinkRoot} onClick={handleClickBack}>
                    <ArrowBackIos classes={{root: arrowIcon}}/> Go Back
                </LinkButton>
            </Fragment>
        }
    </Fragment>
}

export default PaymentTerms;