import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import { css } from 'emotion';
import { Link } from 'react-router-dom';

import padlockImage from 'assets/images/connect-bank/padlock.png';
import creditCardImage from 'assets/images/credit-card.png';
import { H1, H3 } from 'assets/styles';

const SpacedH3 = styled(H3)`
    margin: 15px 10% 30px 10%;
`

const bodyRow = css`
    display: flex;
    color: #828796;
    font-size: 12px;
    margin: 30px;
    font-weight: 300;
    align-items: center;
`

const bodyText = css`
    margin-left: 15px;
    text-align: left;
`

const linkStyle = css`
    color: #828796;
    font-weight: 300;
`

export class ApplicationFeePage extends React.Component {

    render () {
        if (!this.props.profile) return <div/>;
        return (
            <Fragment>
                <H1>Almost There, {this.props.profile.primary_applicant.first_name}!</H1>
                <SpacedH3>The application fee for this apartment is $80. After payment, we’ll collect your SSN for screening.</SpacedH3>
                <img src={creditCardImage} alt="credit card"></img>
                <div className={bodyRow}>
                    <img src={padlockImage} alt="padlock" width="18" height="28"/>
                    <div className={bodyText}>
                        This app will never make any transaction on your behalf. We guard your data and you can read more about our <Link className={linkStyle} to="">privacy policy here.</Link>
                    </div>
                </div>
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    profile: state.renterProfile,
});

export default connect(mapStateToProps, null)(ApplicationFeePage);