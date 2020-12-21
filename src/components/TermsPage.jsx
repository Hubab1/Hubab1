import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import captureRoute from 'app/captureRoute';
import { ROUTES } from 'app/constants';
import ActionButton from 'components/common/ActionButton/ActionButton';
import { H1, Card, ScrollableTermsCardSection } from 'assets/styles';
import UnauthenticatedPage from 'components/common/Page/UnauthenticatedPage';
import { sessionIsValidForCommunityId } from 'utils/misc';
import { TOS_TYPE_NESTIO } from 'app/constants';
import Checkbox from 'components/common/Checkbox';

const AgreementCheckboxContainer = styled.div`
    font-size: 14px;
    div {
        padding: 26px 0 0 0;
    }
    div:first-of-type {
        padding: 6px 0 0 0;
    }
    .MuiCheckbox-root {
        height: 14px;
        width: 14px;
    }
    margin-bottom: 47px;
`;

export function TermsPage(props) {
    const [agreeElectronicSignature, setAgreeElectronicSignature] = useState(false);
    const [agreeTermsOfService, setAgreeTermsOfService] = useState(false);

    function onAgree() {
        const generalTerms = {
            type: TOS_TYPE_NESTIO,
            context: {
                time: Date.now(),
            },
        };
        localStorage.setItem(`accepted-platform-terms-${props.leaseSettingsId}`, JSON.stringify(generalTerms));
        props.history.push(ROUTES.SIGNUP);
    }

    const base = (
        <>
            <H1>Consent to Electronic Signature and Terms of Service</H1>
            <br />
            <Card>
                <ScrollableTermsCardSection>
                    <div className="tos-container">
                        <em>Last Updated: November 30, 2020</em>
                        <p>
                            Welcome, and thank you for your interest in Funnel Leasing, Inc. (“<b>Funnel,</b>” “
                            <b>we,</b>” or “<b>us</b>”) and our website at https://funnelleasing.com and other services
                            provided by us (collectively, the “Service”). These Terms of Service are a legally binding
                            contract between you and Funnel regarding your use of the Service for the purpose of
                            conducting a rental application and leasing transaction for Client.
                        </p>
                        <p>
                            <b>Consent to Use Electronic Records.</b> Applicant authorizes the use of Applicant’s
                            electronic signature for all documents, agreements, attachments, addendums including,
                            without limitation, all rental application, lease, co-signor and co-applicant, legal notices
                            and disclosures, and documents related to this application (collectively, the “Documents“)
                            in any way connected to the rental transaction being entered into between Applicant and
                            Client until Applicant closes its account(s) or until such time as consent has been
                            withdrawn, as described below. This consent is specifically to permit an electronic
                            signature (as of the nature then in use by the Client) in lieu of hand-written signatures on
                            any one or more of the Documents. The authorization by any account owner applies to all
                            account owners and any other parties to the account.
                        </p>
                        <p>
                            Applicant agrees that Applicant’s electronic signature will be enforceable as and to the
                            full extent of a hand-written signature as an original for enforcement/enforceability of the
                            Documents containing the electronic signature(s), whether in court (state or federal),
                            arbitration or otherwise. Applicant will not raise any defenses or invoke regulatory or
                            statutory claims attempting to invalidate the enforceability of the Documents to which the
                            electronic signature is affixed. You agree that any notices, agreements, disclosures or
                            other communications that we send to you electronically will satisfy any legal communication
                            requirements, including that those communications be in writing.
                        </p>
                        <p>
                            Your signature indicates that you have access to the Internet, an email account capable of
                            receiving communication from <b>Client</b>, and Adobe Reader or similar software document
                            reading tool. You must also have the necessary minimum hardware, software, and operating
                            systems, as well as access to one of the following web browsers capable of supporting
                            256-bit, SSL encrypted communications: Apple Safari, Google Chrome, Mozilla Firefox, or
                            Internet Explorer.
                        </p>
                        <p>
                            It is a violation of this provision for an individual to sign/e-sign a transaction on behalf
                            of another individual, unless he or she has been granted specific, written and legal
                            authority to do so by that individual or by a court of competent jurisdiction.
                        </p>
                        <p>
                            Your consent remains in effect until you give us notice that you are withdrawing it. You
                            have the right to withdraw your consent at any time. Please read our{' '}
                            <Link to={ROUTES.PRIVACY_POLICY}>Privacy Policy</Link> to learn more about our electronic
                            communications practices.
                        </p>
                        <p>
                            You may communicate a change in your email address or request paper copies of your records
                            by contacting consumer@funnelleasing.com. If you change your e-mail address or other contact
                            information, you must provide us with your new e-mail address or other contact information.
                            The change will not be effective until we receive it and have had a reasonable opportunity
                            to act upon it. You will be deemed to have received an electronic communication from the
                            Client when the communication is sent to you.
                        </p>
                        <p>
                            Any authorized signer, for the account(s) listed on this Agreement, has the right to
                            withdraw at any time the consent to the use of electronic signatures and to have records
                            provided in electronic form, either using the Withdrawal of Consent document or in any
                            notification approved by us. Please be aware, however, that withdrawal of consent may result
                            in the termination of your Service account. To withdraw your consent to receive disclosures
                            electronically, email consumer@funnelleasing.com with the subject line “WITHDRAWAL OF
                            CONSENT TO ELECTRONIC COMMUNICATIONS.” Your withdrawal of consent will not be effective
                            until we receive it and have had a reasonable opportunity to act upon it.
                        </p>
                        <p>
                            <b>
                                ACKNOWLEDGMENT. By clicking agree for this Acknowledgement and Consent for Electronic
                                Signatures, Disclosures and Notices, you acknowledge that you have read, understood and
                                agree to the above provisions, and request and authorize us to use your electronic
                                signature as well as provide you with records for the account(s) indicated above in an
                                electronic form.
                            </b>
                        </p>
                        <p>
                            <b>PLEASE READ THE FOLLOWING TERMS OF SERVICE CAREFULLY.</b>
                            <br />
                            <b>BY CLICKING “I ACCEPT,” OR BY ACCESSING OR USING THE SERVICE</b>, YOU AGREE THAT YOU HAVE
                            READ AND UNDERSTOOD, AND AGREE TO BE BOUND, BY THE FOLLOWING TERMS AND CONDITIONS, INCLUDING
                            FUNNEL’S APPLICABLE PRIVACY STATEMENTS AND POLICIES, INCLUDING WITHOUT LIMITATION THE
                            PRIVACY POLICY (TOGETHER, THE “<b>TERMS</b>”). IF YOU ARE NOT ELIGIBLE, OR DO NOT AGREE TO
                            THE TERMS, THEN YOU DO NOT HAVE OUR PERMISSION TO USE THE SERVICE. REFERENCES TO “YOU” IN
                            THIS AGREEMENT REFER TO ALL INDIVIDUALS AND LEGAL ENTITIES WHO ACCESS OR USE THE SERVICE.
                        </p>

                        <ol>
                            <li>
                                <b>Essex Terms and Conditions.</b>
                                <ol>
                                    <li>
                                        <b>California Consumer Privacy Act Notice</b>
                                        <p>
                                            <b>ATTENTION CALIFORNIA APPLICANTS:</b>
                                        </p>
                                        <p>
                                            For details on what personal information we collect and for what purposes,
                                            and your privacy rights and how to exercise them, visit{' '}
                                            <a
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                href="https://www.essexapartmenthomes.com/privacy-policy"
                                            >
                                                https://www.essexapartmenthomes.com/privacy-policy
                                            </a>{' '}
                                            or contact us at (833) 591-5938.
                                        </p>
                                    </li>
                                    <li>
                                        <b>Fair Credit Reporting Act</b>
                                        <p>I hereby warrant that all statements set forth above are true.</p>
                                        <p>
                                            I authorize Landlord and its agents to verify the information above and to
                                            obtain a rental report that may include credit reports, investigative
                                            consumer reports, unlawful detainer (eviction) reports, bad check searches,
                                            criminal background searches, social security number verification, fraud
                                            warnings, previous tenant history and employment history. I authorize
                                            Landlord and its agents to request and disclose information to previous or
                                            subsequent (actual and prospective) landlords and property management
                                            companies. I agree to provide additional information upon request.
                                        </p>
                                        <p>
                                            While Landlord may obtain criminal history checks on potential residents,
                                            Landlord has no duty to do so, and does not warrant or guarantee the
                                            personal safety of any resident, occupant, guest or other person in the
                                            Landlord Community.
                                        </p>
                                        <p>
                                            I understand that a link to a copy of the rental report will be provided to
                                            me upon my request. I understand that I may need to provide some
                                            identification to authenticate my request and gain access to the report. I
                                            consent to the delivery of all notices or disclosures required by law in
                                            connection with my application via email or any other any medium chosen by
                                            Landlord or its agents, I understand that all notices shall be deemed
                                            received upon being sent.
                                        </p>
                                        <p>
                                            I certify that I have read and fully understand my rights under the FCRA
                                            available at{' '}
                                            <a
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                href="https://www.consumerfinance.gov/policy-compliance/guidance/other-applicable-requirements/fair-credit-reporting-act/model-forms-and-disclosures/"
                                            >
                                                https://www.consumerfinance.gov/policy-compliance/guidance/other-applicable-requirements/fair-credit-reporting-act/model-forms-and-disclosures/
                                            </a>
                                            .
                                        </p>
                                    </li>
                                    <li>
                                        <b>California Investigative Consumer Reporting Agencies Act</b>
                                        <p>
                                            <b>
                                                Summary of Rights Under the California Investigative Consumer Reporting
                                                Agencies Act
                                            </b>
                                        </p>
                                        <p>
                                            <b>California Civil Code § 1786.22</b>
                                        </p>
                                        <p>
                                            You have a right under California law to inspect files maintained on you by
                                            an investigative consumer reporting agency pursuant to any of the following
                                            procedures, during normal business hours and on reasonable notice:
                                        </p>
                                        <ol>
                                            <li>
                                                You may personally inspect the files if you provide proper
                                                identification (e.g., valid driver’s license, social security account
                                                number, military identification card, credit cards), and may receive a
                                                copy of the file for the actual cost of duplication services provided.
                                            </li>
                                            <li>
                                                You may make a written request, by certified mail and with proper
                                                identification, as described above, for copies to be sent to a specified
                                                addressee.
                                            </li>
                                            <li>
                                                You may make a written request, with proper identification as described
                                                above, for telephone disclosure of a summary of information contained in
                                                your files, if any toll charge is prepaid by or charged directly to you.
                                            </li>
                                        </ol>
                                        <p>
                                            If you are unable to provide “proper identification“ through the types of
                                            cards or numbers listed above, the agency may require additional information
                                            concerning your employment and personal or family history in order to verify
                                            your identity.
                                        </p>
                                        <p>
                                            The agency must provide trained personnel to explain to you any information
                                            that the agency is required to furnish to you from your file. The agency
                                            also must provide you with a written explanation of any coded information
                                            contained in your files at the time your file is provided to you for
                                            inspection. You are permitted by law to be accompanied by one other person
                                            of your choosing when inspecting your files. That person must furnish
                                            reasonable identification. The agency may require you to provide the agency
                                            with a written statement granting permission to the agency to discuss your
                                            file in such person’s presence. The agency also is not required by law to
                                            make available to you the sources of information in your files, although
                                            such information would be obtainable through discovery procedures in any
                                            court action brought under the Investigative Consumer Reporting Agencies
                                            Act.
                                        </p>
                                    </li>
                                    <li>
                                        <b>RENTAL QUALIFICATIONS</b>
                                        <p>
                                            All applicants must be of legal age. All parties 18 years of age or older
                                            are required to complete an application and pay any and all applicable fees.
                                            Applications are to be completed in full; applications containing untrue,
                                            incorrect, or misleading information will be denied. The application fee is
                                            non-refundable unless otherwise provided by state or local law.
                                        </p>
                                    </li>
                                    <li>
                                        <b>IDENTITY VERIFICATION</b>
                                        <p>
                                            ALL applicants are REQUIRED to show at least one of any of the following
                                            forms of identification:
                                            <br />- Government issued identification such as military identification,
                                            driver’s license or passport
                                            <br />- Age of majority card
                                            <br />- Birth certificate
                                            <br />- Social security card
                                        </p>
                                    </li>
                                    <li>
                                        <b>RENTAL SCORE</b>
                                        <p>
                                            Applications are submitted to a third-party rental applicant screening
                                            company. Applications are evaluated based on a rental scoring system. Rental
                                            scoring is based on data such as payment history, quantity and type of
                                            accounts, outstanding debt, and age of accounts. Every applicant is treated
                                            objectively because each application is scored statistically in exactly the
                                            same manner.
                                        </p>
                                        <p>
                                            Washington State properties do not accept Comprehensive Reusable Tenant
                                            Screening Reports.
                                        </p>
                                    </li>
                                    <li>
                                        <b>GUARANTORS</b>
                                        <p>
                                            Guarantors may be considered if there is a denial of the application based
                                            on negative credit history or lack of credit or verifiable income.
                                            Guarantors will not be considered, and the application will be automatically
                                            denied in the case of unpaid judgments, unpaid landlord collections or
                                            failure to pass a criminal screening.
                                        </p>
                                        <p>
                                            Proof of legal, verifiable U.S. assets and/or U.S. income in an amount equal
                                            to 3.9 – 5.0 times the monthly rent per household will be required based on
                                            pre-established requirements at the property and in-state residency* is
                                            required in at least one form of the items listed below. Proof of income
                                            includes, but is not limited to, the following:
                                        </p>
                                        <p>
                                            - Proof of current employment (e.g., three most current paystubs within the
                                            last 45 or 90 days, depending on the payment cycle);
                                            <br />- Prior year tax return;
                                            <br />- Proof of receipt of government income (e.g., social security,
                                            disability, welfare, unemployment, etc.);
                                            <br />- Proof of receipt of retirement and/or investment income;
                                            <br />- Proof of US based assets;
                                            <br />- Student loan income*, child and/or spousal support; or,
                                            <br />- Or any other legal, verifiable income.
                                        </p>
                                        <p>
                                            Applications for guarantors and co-signers are also scored, but are
                                            typically held to a more stringent, pre-established screening standard
                                            because guarantors and co-signers are technically responsible for the
                                            payments for this residence, as well as their own place of residence.
                                        </p>
                                        <p>
                                            *If Guarantor is not an in-state resident, but is a resident of the U.S.,
                                            the security deposit shall be increased by one month’s rent. Note there is
                                            an exception in the city of Seattle, Washington requiring that the total
                                            security deposit not exceed one month’s rent.
                                        </p>
                                    </li>
                                    <li>
                                        <b>INCOME VERIFICATION</b>
                                        <p>
                                            Proof of legal, verifiable income in an amount equal to 2.0 – 3.0 times the
                                            monthly rent per household will be required based on pre-established
                                            requirements at the property, along with any necessary supporting documents.
                                        </p>
                                        <p>
                                            Proof of income includes, but is not limited to, the following:
                                            <br />- Proof of current employment (e.g., three most current paystubs
                                            within the last 45 or 90 days, depending on the payment cycle);
                                            <br />- Prior year tax return;
                                            <br />- Proof of receipt of government income (e.g., social security,
                                            disability, welfare, unemployment, etc.);
                                            <br />- Proof of receipt of retirement and/or investment income;
                                            <br />- Proof of US based assets;
                                            <br />- Student loan income*, child and/or spousal support; or,
                                            <br />- Any other legal, verifiable income.
                                            <br />
                                            In no current income, proof of liquid assets (which includes bank statements
                                            with deposits) at 2.0 – 3.0 the net rent for the entire lease term is
                                            required.
                                        </p>
                                    </li>
                                    <li>
                                        <b>RESIDENCE VERIFICATION</b>
                                        <p>
                                            Management reserves the right to verify the applicant’s residence history.
                                        </p>
                                    </li>
                                    <li>
                                        <b>POSITIVE RENTAL HISTORY</b>
                                        <p>
                                            Applicants who have been a party to an eviction proceeding may not be
                                            approved for residency, depending upon the pre-established criteria set by
                                            Management, to the extent permitted by law.
                                            <br />
                                            The following will be considered for all individual applicants and will
                                            result in denial of the application:
                                            <br />- Unpaid judgment to prior landlord; or,
                                            <br />- Unpaid landlord collections.
                                        </p>
                                        <p>
                                            Additionally, the below may result in denial of the application depending on
                                            the facts and information regarding the following:
                                            <br />- Negative landlord reference from previous landlord indicating damage
                                            done to the prior residence;
                                            <br />- Late payments or returned checks;
                                            <br />- Balance owed to previous landlord; or,
                                            <br />- Lease violations.
                                        </p>
                                        <p>
                                            Eviction history occurring during or within six months after the end of the
                                            civil emergency proclaimed by Seattle Mayor Durkan on March 3, 2020 shall
                                            not be used to take an adverse action against applicants for communities
                                            located in Seattle, Washington. The Seattle Office for Civil Rights is the
                                            department that will enforce any violations of this rule.
                                        </p>
                                    </li>
                                    <li>
                                        <b>CRIMINAL CHARGES/CONVICTIONS</b>
                                        <p>
                                            Applicants charged or convicted for certain felony and misdemeanor offenses
                                            may not be approved for residency, depending upon jurisdictional rules and
                                            the pre-established criteria set by Management.
                                            <br />
                                            Tenancy eligibility determinations as a result of criminal screening will be
                                            evaluated on a case-by-case basis, and will be based on the following
                                            factors and information: 1) the facts of the crime you were convicted of; 2)
                                            the actual crime you were convicted of; 3) how much time has passed since
                                            the conviction.
                                            <br />
                                            Note that convictions (felonies within the last 7 years, misdemeanors within
                                            the last 3 years) will be evaluated in regard to the factors set forth
                                            above.
                                            <br />
                                            Management reserves the right to charge additional fees should additional
                                            criminal screening be necessary, which shall be paid in full by the
                                            applicant prior to the additional screening.
                                        </p>
                                        <p>
                                            Criminal screening criteria does not apply to communities located in
                                            Seattle, Washington. Landlords in the City of Seattle are prohibited from
                                            requiring disclosure, asking about, rejecting an applicant, or taking an
                                            adverse action based on any arrest record, conviction record, or criminal
                                            history, except for sex offender registry information as described in
                                            subsections 14.09.025.A.3, 14.09.025.A.4, and 14.09.025.A.5, and subject to
                                            the exclusions and legal requirements in Section 14.09.115. All applicants
                                            will be screened for registry information. Management considers the entire
                                            application and considers prior convictions reportable under the Fair Credit
                                            Reporting Act and rules of Washington, limited to those appearing on a
                                            local, state, or national registry only.
                                        </p>
                                        <p>
                                            Consideration will be given to the following factors relating to the
                                            conviction(s) that requires registry on a local, state, or national sex
                                            offender registry:
                                            <br />- The nature and severity of the conviction;
                                            <br />- The number and types of convictions;
                                            <br />- The time that has elapsed since the date of conviction;
                                            <br />- Age of the individual at the time of convictions;
                                            <br />- Evidence of good tenant history before and/or after the conviction
                                            occurred; and
                                            <br />- Any supplemental information related to the individual’s
                                            rehabilitation, good conduct, and additional facts or explanations provided
                                            by the individual.
                                        </p>
                                    </li>
                                </ol>
                            </li>
                            <li>
                                <b>Funnel TOS</b>
                                <ol>
                                    Your use of this platform is subject to{' '}
                                    <Link to={ROUTES.FUNNEL_TERMS}>Terms of Service</Link>.
                                </ol>
                            </li>
                        </ol>
                    </div>
                </ScrollableTermsCardSection>
            </Card>
        </>
    );
    if (props.isSignedIn) {
        return base;
    } else {
        return (
            <UnauthenticatedPage>
                {base}
                <AgreementCheckboxContainer>
                    <Checkbox
                        onChange={(e) => setAgreeElectronicSignature(e.target.checked)}
                        checked={agreeElectronicSignature}
                        value={agreeElectronicSignature}
                        label="I agree to Consent to Electronic Signature"
                    />
                    <Checkbox
                        onChange={(e) => setAgreeTermsOfService(e.target.checked)}
                        checked={agreeTermsOfService}
                        value={agreeTermsOfService}
                        label="I agree to the Terms of Service"
                    />
                </AgreementCheckboxContainer>
                <ActionButton onClick={onAgree} disabled={!(agreeTermsOfService && agreeElectronicSignature)}>
                    Agree and Continue
                </ActionButton>
            </UnauthenticatedPage>
        );
    }
}

const mapStateToProps = (state) => ({
    leaseSettingsId: state.siteConfig.basename,
    isSignedIn: sessionIsValidForCommunityId(state.siteConfig.basename),
});

export default connect(mapStateToProps)(captureRoute(TermsPage, ROUTES.TERMS));
