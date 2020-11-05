import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { ScrollableTermsCardSection, Card, H1 } from 'assets/styles';

const Section = styled.div`
    font-size: 14px;
    margin-top: 26px;

    h1 {
        font-size: 20px;
        text-align: center;
    }

    h2 {
        font-size: 16px;
    }
`;

const Table = styled.table`
    border: none;
    border-collapse: collapse;
    width: 100%;

    thead,
    tbody {
        width: 100%;
    }

    td,
    th {
        width: 50%;
        padding: 10px;
        border: 1px solid black;
        vertical-align: top;

        p {
            margin-top: 0;
        }
    }

    th {
        text-align: center;
        text-transform: capitalize;
        font-weight: bold;
    }

    td {
        padding-bottom: 0;
    }
`;

const Tab = () => {
    return <span>&nbsp;&nbsp;&nbsp;</span>;
};

export function FAQ({ community }) {
    return (
        <>
            <H1>Frequently Asked Questions</H1>
            <br />
            <Card>
                <ScrollableTermsCardSection>
                    <Section>
                        <h1>Funnel - Consumer Assistance - Frequently Asked Questions</h1>

                        <h2>
                            How do I find out if my apartment application has been received or when I can expect a
                            decision?
                        </h2>
                        <p>
                            Funnel provides data to property management clients for them to determine whether you
                            qualify to lease with their company. Unfortunately, we are unable to provide the application
                            status. You will need to speak with {`${community.building_name}`} to determine if they’ve
                            received your application and when they expect to provide a decision.
                        </p>

                        <h2>Will you be able to tell me why my application was denied?</h2>
                        <p>
                            The criteria to accept or decline an applicant are established by the property and/or its
                            corporate headquarters, not Funnel. Funnel provides our clients with consumer reports from
                            consumer reporting agencies (CRAs) that clients use as a tool in making their decisions to
                            accept or decline applicants.
                        </p>
                        <p>
                            The client may decline a rental application for one or more reasons, including the
                            applicant’s credit history, credit score, criminal records history, and/or a reference check
                            to an applicant’s prior landlord.
                        </p>
                        <p>
                            Some properties use a scoring model and will receive a TransUnion score for rental
                            screening. This score is unique to each individual or lease. A score which results in a
                            decline at one property may generate an approval at another property. Please note, this
                            score, while incorporating credit as a factor, is not the same as a FICO™ score. It is
                            generally much lower than a credit bureau score. The Adverse Action Notice you receive will
                            indicate what factors, if improved, would also most improve your score.
                        </p>

                        <h2>
                            What are my rights under the Fair Credit Reporting Act? What if I suspect I have been a
                            victim of identity theft?
                        </h2>
                        <p>
                            For a detailed description of your rights as a consumer under the FCRA, and steps you can
                            take to remedy the effects of suspected identity theft, the federal Consumer Financial
                            Protection Bureau (CFPB) has provided detailed disclosures in Spanish and English at:{' '}
                            <a
                                href="https://www.consumerfinance.gov/policy-compliance/guidance/other-applicable-requirements/fair-credit-reporting-act/model-forms-and-disclosures"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                https://www.consumerfinance.gov/policy-compliance/guidance/other-applicable-requirements/fair-credit-reporting-act/model-forms-and-disclosures
                            </a>
                        </p>
                    </Section>

                    <Section>
                        <p style={{ textAlign: 'center' }}>
                            <i>
                                Para información en español, visite{' '}
                                <a href="www.consumerfinance.gov/learnmore" target="_blank" rel="noopener noreferrer">
                                    www.consumerfinance.gov/learnmore
                                </a>{' '}
                                o escribe a la Consumer Financial Protection Bureau, 1700 G Street N.W., Washington, DC
                                20552.
                            </i>
                        </p>
                        <h2 style={{ textAlign: 'center' }}>
                            A Summary of Your Rights Under the Fair Credit Reporting Act
                        </h2>
                        <p>
                            <Tab />
                            <Tab />
                            The federal Fair Credit Reporting Act (FCRA) promotes the accuracy, fairness, and privacy of
                            information in the files of consumer reporting agencies. There are many types of consumer
                            reporting agencies, including credit bureaus and specialty agencies (such as agencies that
                            sell information about check writing histories, medical records, and rental history
                            records). Here is a summary of your major rights under FCRA.
                            <br />
                            <b>
                                For more information, including information about additional rights, go to{' '}
                                <a href="www.consumerfinance.gov/learnmore" target="_blank" rel="noopener noreferrer">
                                    www.consumerfinance.gov/learnmore
                                </a>{' '}
                                or write to: Consumer Financial Protection Bureau, 1700 G Street N.W., Washington, DC
                                20552.
                            </b>
                        </p>

                        <ul>
                            <li>
                                <b>You must be told if information in your file has been used against you.</b>
                                <br />
                                Anyone who uses a credit report or another type of consumer report to deny your
                                application for credit, insurance, or employment – or to take another adverse action
                                against you – must tell you, and must give you the name, address, and phone number of
                                the agency that provided the information.
                            </li>
                            <li>
                                <b>You have the right to know what is in your file.</b>
                                <br />
                                You may request and obtain all the information about you in the files of a consumer
                                reporting agency (your “file disclosure”). You will be required to provide proper
                                identification, which may include your Social Security number. In many cases, the
                                disclosure will be free. You are entitled to a free file disclosure if:
                                <ul>
                                    <li>
                                        a person has taken adverse action against you because of information in your
                                        credit report;
                                    </li>
                                    <li>you are the victim of identity theft and place a fraud alert in your file;</li>
                                    <li>your file contains inaccurate information as a result of fraud;</li>
                                    <li>you are on public assistance;</li>
                                    <li>you are unemployed but expect to apply for employment within 60 days.</li>
                                </ul>
                                <br />
                                In addition, all consumers are entitled to one free disclosure every 12 months upon
                                request from each nationwide credit bureau and from nationwide specialty consumer
                                reporting agencies. See{' '}
                                <a href="www.consumerfinance.gov/learnmore" target="_blank" rel="noopener noreferrer">
                                    www.consumerfinance.gov/learnmore
                                </a>{' '}
                                for additional information.
                            </li>
                            <li>
                                <b>You have the right to ask for a credit score.</b>
                                <br />
                                Credit scores are numerical summaries of your credit-worthiness based on information
                                from credit bureaus. You may request a credit score from consumer reporting agencies
                                that create scores or distribute scores used in residential real property loans, but you
                                will have to pay for it. In some mortgage transactions, you will receive credit score
                                information for free from the mortgage lender.
                            </li>
                            <li>
                                <b>You have the right to dispute incomplete or inaccurate information.</b>
                                <br />
                                If you identify information in your file that is incomplete or inaccurate, and report it
                                to the consumer reporting agency, the agency must investigate unless your dispute is
                                frivolous. See{' '}
                                <a href="www.consumerfinance.gov/learnmore" target="_blank" rel="noopener noreferrer">
                                    www.consumerfinance.gov/learnmore
                                </a>{' '}
                                for an explanation of dispute procedures.
                            </li>
                            <li>
                                <b>
                                    Consumer reporting agencies must correct or delete inaccurate, incomplete, or
                                    unverifiable information.
                                </b>
                                <br />
                                Inaccurate, incomplete, or unverifiable information must be removed or corrected,
                                usually within 30 days. However, a consumer reporting agency may continue to report
                                information it has verified as accurate.
                            </li>
                            <li>
                                <b>Consumer reporting agencies may not report outdated negative information.</b>
                                <br />
                                In most cases, a consumer reporting agency may not report negative information that is
                                more than seven years old, or bankruptcies that are more than 10 years old.
                            </li>
                            <li>
                                <b>Access to your file is limited.</b>
                                <br />A consumer reporting agency may provide information about you only to people with
                                a valid need – usually to consider an application with a creditor, insurer, employer,
                                landlord, or other business. The FCRA specifies those with a valid need for access.
                            </li>
                            <li>
                                <b>You must give your consent for reports to be provided to employers.</b>
                                <br />A consumer reporting agency may not give out information about you to your
                                employer, or a potential employer, without your written consent given to the employer.
                                Written consent generally is not required in the trucking industry. For more
                                information, go to{' '}
                                <a href="www.consumerfinance.gov/learnmore" target="_blank" rel="noopener noreferrer">
                                    www.consumerfinance.gov/learnmore
                                </a>
                                .
                            </li>
                            <li>
                                <b>
                                    You may limit “prescreened” offers of credit and insurance you get based on
                                    information in your credit report.
                                </b>
                                <br />
                                Unsolicited “prescreened” offers for credit and insurance must include a toll-free phone
                                number you can call if you choose to remove your name and address form the lists these
                                offers are based on. You may opt out with the nationwide credit bureaus at
                                1-888-5-OPTOUT (1-888-567-8688).
                            </li>
                            <li>
                                The following FCRA right applies with respect to nationwide consumer reporting agencies:
                                <br />
                                <br />
                                <b>Consumers Have the Right To Obtain a Security Freeze</b>
                                <br />
                                <br />
                                <b>
                                    You have a right to place a “security freeze” on your credit report, which will
                                    prohibit a consumer reporting agency from releasing information in your credit
                                    report without your express authorization.
                                </b>{' '}
                                The security freeze is designed to prevent credit, loans, and services from being
                                approved in your name without your consent. However, you should be aware that using a
                                security freeze to take control over who gets access to the personal and financial
                                information in your credit report may delay, interfere with, or prohibit the timely
                                approval of any subsequent request or application you make regarding a new loan, credit,
                                mortgage, or any other account involving the extension of credit.
                                <br />
                                <br />
                                As an alternative to a security freeze, you have the right to place an initial or
                                extended fraud alert on your credit file at no cost. An initial fraud alert is a 1-year
                                alert that is placed on a consumer’s credit file. Upon seeing a fraud alert display on a
                                consumer’s credit file, a business is required to take steps to verify the consumer’s
                                identity before extending new credit. If you are a victim of identity theft, you are
                                entitled to an extended fraud alert, which is a fraud alert lasting 7 years.
                                <br />
                                <br />A security freeze does not apply to a person or entity, or its affiliates, or
                                collection agencies acting on behalf of the person or entity, with which you have an
                                existing account that requests information in your credit report for the purposes of
                                reviewing or collecting the account. Reviewing the account includes activities related
                                to account maintenance, monitoring, credit line increases, and account upgrades and
                                enhancements.
                            </li>
                            <li>
                                <b>You may seek damages from violators.</b>
                                <br />
                                If a consumer reporting agency, or, in some cases, a user of consumer reports or a
                                furnisher of information to a consumer reporting agency violates the FCRA, you may be
                                able to sue in state or federal court.
                            </li>
                            <li>
                                <b>Identity theft victims and active duty military personnel have additional rights.</b>
                                <br />
                                For more information, visit{' '}
                                <a href="www.consumerfinance.gov/learnmore" target="_blank" rel="noopener noreferrer">
                                    www.consumerfinance.gov/learnmore
                                </a>
                                .
                            </li>
                        </ul>

                        <p>
                            <b>
                                States may enforce the FCRA, and many states have their own consumer reporting laws. In
                                some cases, you may have more rights under state law. For more information, contact your
                                state or local consumer protection agency or your state Attorney General. For
                                information about your federal rights, contact:
                            </b>
                        </p>

                        <Table>
                            <thead>
                                <tr>
                                    <th>TYPE OF BUSINESS:</th>
                                    <th>CONTACT:</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <p>
                                            1.a. Banks, savings associations, and credit unions with total assets of
                                            over $10 billion and their affiliates
                                        </p>
                                        <p>
                                            b. Such affiliates that are not banks, savings associations, or credit
                                            unions also should list, in addition to the CFPB:
                                        </p>
                                    </td>
                                    <td>
                                        <p>
                                            a. Consumer Financial Protection Bureau
                                            <br />
                                            1700 G Street, N.W.
                                            <br />
                                            Washington, DC 20552
                                            <br />
                                        </p>

                                        <p>
                                            b. Federal Trade Commission
                                            <br />
                                            Consumer Response Center
                                            <br />
                                            600 Pennsylvania Avenue, N.W.
                                            <br />
                                            Washington, DC 20580
                                            <br />
                                            (877) 382-4357
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <p>2. To the extent not included in item 1 above:</p>
                                        <p>
                                            a. National banks, federal savings associations, and federal branches and
                                            federal agencies of foreign banks
                                        </p>
                                        <p>
                                            b. State member banks, branches and agencies of foreign banks (other than
                                            federal branches, federal agencies, and Insured State Branches of Foreign
                                            Banks), commercial lending companies owned or controlled by foreign banks,
                                            and organizations operating under section 25 or 25A of the Federal Reserve
                                            Act.
                                        </p>
                                        <p>
                                            c. Nonmember Insured Banks, Insured State Branches of Foreign Banks, and
                                            insured state savings associations
                                        </p>
                                        <p>d. Federal Credit Unions</p>
                                    </td>
                                    <td>
                                        <p>
                                            a. Office of the Comptroller of the Currency
                                            <br />
                                            Customer Assistance Group
                                            <br />
                                            1301 McKinney Street, Suite 3450
                                            <br />
                                            Houston, TX 77010-9050
                                        </p>
                                        <p>
                                            b. Federal Reserve Consumer Help Center
                                            <br />
                                            P.O. Box 1200
                                            <br />
                                            Minneapolis, MN 55480
                                        </p>
                                        <p>
                                            c. FDIC Consumer Response Center
                                            <br />
                                            1100 Walnut Street, Box #11
                                            <br />
                                            Kansas City, MO 64106
                                        </p>
                                        <p>
                                            d. National Credit Union Administration
                                            <br />
                                            Office of Consumer Financial Protection (OCFP)
                                            <br />
                                            Division of Consumer Compliance Policy and Outreach
                                            <br />
                                            1775 Duke Street
                                            <br />
                                            Alexandria, VA 22314
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <p>3. Air carriers</p>
                                    </td>
                                    <td>
                                        <p>
                                            Asst. General Counsel for Aviation Enforcement & Proceedings
                                            <br />
                                            Aviation Consumer Protection Division
                                            <br />
                                            Department of Transportation
                                            <br />
                                            1200 New Jersey Avenue, S.E.
                                            <br />
                                            Washington, DC 20590
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <p>4. Creditors Subject to the Surface Transportation Board</p>
                                    </td>
                                    <td>
                                        <p>
                                            Office of Proceedings, Surface Transportation Board
                                            <br />
                                            Department of Transportation
                                            <br />
                                            395 E Street, S.W.
                                            <br />
                                            Washington, DC 20423
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <p>5. Creditors Subject to the Packers and Stockyards Act, 1921</p>
                                    </td>
                                    <td>
                                        <p>Nearest Packers and Stockyards Administration area supervisor</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <p>6. Small Business Investment Companies</p>
                                    </td>
                                    <td>
                                        <p>
                                            Associate Deputy Administrator for Capital Access
                                            <br />
                                            United States Small Business Administration
                                            <br />
                                            409 Third Street, S.W., Suite 8200
                                            <br />
                                            Washington, DC 20416
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <p>7. Brokers and Dealers</p>
                                    </td>
                                    <td>
                                        <p>
                                            Securities and Exchange Commission
                                            <br />
                                            100 F Street, N.E.
                                            <br />
                                            Washington, DC 20549
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <p>
                                            8. Federal Land Banks, Federal Land Bank Associations, Federal Intermediate
                                            Credit Banks, and Production Credit Associations
                                        </p>
                                    </td>
                                    <td>
                                        <p>
                                            Farm Credit Administration
                                            <br />
                                            1501 Farm Credit Drive
                                            <br />
                                            McLean, VA 22102-5090
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <p>9. Retailers, Finance Companies, and All Other Creditors Not Listed Above</p>
                                    </td>
                                    <td>
                                        <p>
                                            Federal Trade Commission
                                            <br />
                                            Consumer Response Center
                                            <br />
                                            600 Pennsylvania Avenue, N.W.
                                            <br />
                                            Washington, DC 20580
                                            <br />
                                            (877) 382-4357
                                        </p>
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                    </Section>

                    <Section>
                        <p style={{ textAlign: 'center' }}>
                            <i>
                                Para información en español,{' '}
                                <a
                                    href="visite www.consumerfinance.gov/learnmore"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    visite www.consumerfinance.gov/learnmore
                                </a>{' '}
                                o escribe a la Consumer Financial Protection Bureau, 1700 G Street N.W., Washington, DC
                                20552.
                            </i>
                        </p>
                        <h2 style={{ textAlign: 'center' }}>Remedying the Effects of Identity Theft</h2>
                        <p>
                            <Tab />
                            <Tab />
                            You are receiving this information because you have notified a consumer reporting agency
                            that you believe that you are a victim of identity theft. Identity theft occurs when someone
                            uses your name, Social Security number, date of birth, or other identifying information,
                            without authority, to commit fraud. For example, someone may have committed identity theft
                            by using your personal information to open a credit card account or get a loan in your name.
                            For more information, visit{' '}
                            <a href="www.consumerfinance.gov/learnmore" target="_blank" rel="noopener noreferrer">
                                www.consumerfinance.gov/learnmore
                            </a>{' '}
                            or write to: Consumer Financial Protection Bureau, 1700 G Street N.W., Washington, DC 20552.
                        </p>
                        <p>
                            <Tab />
                            <Tab />
                            The Fair Credit Reporting Act (FCRA) gives you specific rights when you are, or believe that
                            you are, the victim of identity theft. Here is a brief summary of the rights designed to
                            help you recover from identity theft.
                        </p>

                        <ol type="1">
                            <li>
                                <b>
                                    You have the right to ask that nationwide consumer reporting agencies place “fraud
                                    alerts” in your file to let potential creditors and others know that you may be a
                                    victim of identity theft.
                                </b>{' '}
                                A fraud alert can make it more difficult for someone to get credit in your name because
                                it tells creditors to follow certain procedures to protect you. It also may delay your
                                ability to obtain credit. You may place a fraud alert in your file by calling just one
                                of the three nationwide consumer reporting agencies. As soon as that agency processes
                                your fraud alert, it will notify the other two, which then also must place fraud alerts
                                in your file.
                                <ul>
                                    <li>
                                        Equifax: 1-800-525-6285;{' '}
                                        <a href="www.equifax.com" target="_blank" rel="noopener noreferrer">
                                            www.equifax.com
                                        </a>
                                    </li>
                                    <li>
                                        Experian: 1-888-397-3742;{' '}
                                        <a href="www.experian.com" target="_blank" rel="noopener noreferrer">
                                            www.experian.com
                                        </a>
                                    </li>
                                    <li>
                                        TransUnion: 1-800-680-7289;{' '}
                                        <a href="www.transunion.com" target="_blank" rel="noopener noreferrer">
                                            www.transunion.com
                                        </a>
                                    </li>
                                </ul>
                                <br />
                                An <u>initial fraud alert</u> stays in your file for at least one year. An{' '}
                                <u>extended alert</u> stays in your file for seven years. To place either of these
                                alerts, a consumer reporting agency will require you to provide appropriate proof of
                                your identity, which may include your Social Security number. If you ask for an{' '}
                                <u>extended alert</u>, you will have to provide an <u>identity theft report</u>. An{' '}
                                <u>identity theft report</u> includes a copy of a report you have filed with a federal,
                                state, or local law enforcement agency, and additional information a consumer reporting
                                agency may require you to submit. For more detailed information about the{' '}
                                <u>identity theft report</u>, visit{' '}
                                <a href="www.consumerfinance.gov/learnmore" target="_blank" rel="noopener noreferrer">
                                    www.consumerfinance.gov/learnmore
                                </a>
                                .
                            </li>
                            <li>
                                <b>
                                    You have the right to free copies of the information in your file (your “file
                                    disclosure”).
                                </b>{' '}
                                An <u>initial fraud alert</u> entitles you to a copy of all the information in your file
                                at each of the three nationwide agencies, and an <u>extended alert</u> entitles you to
                                two free file disclosures in a 12-month period following the placing of the alert. These
                                additional disclosures may help you detect signs of fraud, for example, whether
                                fraudulent accounts have been opened in your name or whether someone has reported a
                                change in your address. Once a year, you also have the right to a free copy of the
                                information in your file at any consumer reporting agency, if you believe it has
                                inaccurate information due to fraud, such as identity theft. You also have the ability
                                to obtain additional free file disclosures under other provisions of the FCRA. See{' '}
                                <a href="www.consumerfinance.gov/learnmore" target="_blank" rel="noopener noreferrer">
                                    www.consumerfinance.gov/learnmore
                                </a>
                                .
                            </li>
                            <li>
                                <b>
                                    You have the right to obtain documents relating to fraudulent transactions made or
                                    accounts opened using your personal information.
                                </b>{' '}
                                A creditor or other business must give you copies of applications and other business
                                records relating to transactions and accounts that resulted from the theft of your
                                identity, if you ask for them in writing. A business may ask you for proof of your
                                identity, a police report, and an affidavit before giving you the documents. It may also
                                specify an address for you to send your request. Under certain circumstances a business
                                can refuse to provide you with these documents. See{' '}
                                <a href="www.consumerfinance.gov/learnmore" target="_blank" rel="noopener noreferrer">
                                    www.consumerfinance.gov/learnmore
                                </a>
                                .
                            </li>
                            <li>
                                <b>You have the right to obtain information from a debt collector.</b> If you ask, a
                                debt collector must provide you with certain information about the debt you believe was
                                incurred in your name by an identity thief – like the name of the creditor and the
                                amount of the debt.
                            </li>
                            <li>
                                <b>
                                    If you believe information in your file results from identity theft, you have the
                                    right to ask that a consumer reporting agency block that information from your file.
                                </b>{' '}
                                An identity thief may run up bills in your name and not pay them. Information about the
                                unpaid bills may appear on your consumer report. Should you decide to ask a consumer
                                reporting agency to block the reporting of this information, you must identify the
                                information to block, and provide the consumer reporting agency with proof of your
                                identity and a copy of your <u>identity theft report</u>. The consumer reporting agency
                                can refuse or cancel your request for a block if, for example, you don’t provide the
                                necessary documentation, or where the block results from an error or a material
                                misrepresentation of fact made by you. If the agency declines or rescinds the block, it
                                must notify you. Once a debt resulting from identity theft has been blocked, a person or
                                business with notice of the block may not sell, transfer, or place the debt for
                                collection.
                            </li>
                            <li>
                                <b>
                                    You also may prevent businesses from reporting information about you to consumer
                                    reporting agencies if you believe the information is a result of identity theft.
                                </b>{' '}
                                To do so, you must send your request to the address specified by the business that
                                reports the information to the consumer reporting agency. The business will expect you
                                to identify what information you do not want reported and to provide an{' '}
                                <u>identity theft report</u>.
                            </li>
                            <li>
                                The following FCRA right applies with respect to nationwide consumer reporting agencies:
                                <br />
                                <br />
                                <b>Consumers Have the Right To Obtain a Security Freeze</b>
                                <br />
                                <br />
                                <b>
                                    You have a right to place a “security freeze” on your credit report, which will
                                    prohibit a consumer reporting agency from releasing information in your credit
                                    report without your express authorization.
                                </b>{' '}
                                The security freeze is designed to prevent credit, loans, and services from being
                                approved in your name without your consent. However, you should be aware that using a
                                security freeze to take control over who gets access to the personal and financial
                                information in your credit report may delay, interfere with, or prohibit the timely
                                approval of any subsequent request or application you make regarding a new loan, credit,
                                mortgage, or any other account involving the extension of credit.
                                <br />
                                <br />
                                As an alternative to a security freeze, you have the right to place an initial or
                                extended fraud alert on your credit file at no cost. An initial fraud alert is a 1-year
                                alert that is placed on a consumer's credit file. Upon seeing a fraud alert display on a
                                consumer's credit file, a business is required to take steps to verify the consumer's
                                identity before extending new credit. If you are a victim of identity theft, you are
                                entitled to an extended fraud alert, which is a fraud alert lasting 7 years.
                                <br />
                                <br />
                                A security freeze does not apply to a person or entity, or its affiliates, or collection
                                agencies acting on behalf of the person or entity, with which you have an existing
                                account that requests information in your credit report for the purposes of reviewing or
                                collecting the account. Reviewing the account includes activities related to account
                                maintenance, monitoring, credit line increases, and account upgrades and enhancements.
                                <br />
                                <br />
                                <Tab />
                                <Tab />
                                To learn more about identity theft and how to deal with its consequences, visit
                                <a href="www.consumerfinance.gov/learnmore" target="_blank" rel="noopener noreferrer">
                                    www.consumerfinance.gov/learnmore
                                </a>
                                , or write to the Consumer Financial Protection Bureau. You may have additional rights
                                under state law. For more information, contact your local consumer protection agency or
                                your state Attorney General.
                                <br />
                                <br />
                                <Tab />
                                <Tab />
                                In addition to the new rights and procedures to help consumers deal with the effects of
                                identity theft, the FCRA has many other important consumer protections. They are
                                described in more detail at{' '}
                                <a href="www.consumerfinance.gov/learnmore" target="_blank" rel="noopener noreferrer">
                                    www.consumerfinance.gov/learnmore
                                </a>
                                .
                            </li>
                        </ol>
                    </Section>

                    <Section>
                        <h2>Who is Funnel and why do they have information about me?</h2>
                        <p>
                            Funnel is a reseller of consumer reports and scores generated by consumer reporting agencies
                            (CRAs), such as TransUnion® and Finicity. Funnel provides information to rental housing
                            providers to assist them in making leasing decisions. It is important to understand that
                            information from these CRAs is not maintained by Funnel. As a reseller of credit reports,
                            Funnel only resells consumer reports to its customers, as permitted under the Fair Credit
                            Reporting Act and other applicable law.
                        </p>
                        <h2>What is a consumer report?</h2>
                        <p>
                            A consumer report may contain information from public record sources, creditors, and other
                            data furnishers, which prospective housing providers and employers use to evaluate an
                            applicant. A consumer report may also show whether or not a person has been sued, filed for
                            bankruptcy, or has a criminal or civil court record.
                        </p>

                        <h2>How do I obtain a copy of my Consumer File?</h2>
                        <p>
                            Under the Fair Credit Reporting Act, you are entitled to receive one free copy of your
                            consumer file in any twelve month period from a consumer reporting agency (CRA). You are
                            also entitled to a free copy of your consumer file if you meet the following criteria:
                        </p>
                        <ul>
                            <li>
                                You have been notified of an adverse action or been denied housing or employment based
                                on information in your consumer file within the past 60 days
                            </li>
                            <li>
                                You reside in a state where you are entitled to more than one free copy in any twelve
                                month period
                            </li>
                            <li>
                                You suspect that your file may contain fraudulent information, or you are a victim of
                                identity theft
                            </li>
                            <li>You are unemployed or you currently receive public assistance</li>
                        </ul>
                        <p>
                            A centralized service is available to eligible consumers to request free annual credit file
                            disclosures from nationwide credit bureaus. The three major nationwide credit bureaus
                            (Equifax®, Experian®, and TransUnion®) established access for consumers to this centralized
                            service using one of the following options:
                        </p>
                        <p>
                            Internet: <a href="www.annualcreditreport.com">www.annualcreditreport.com</a>
                            <br />
                            Phone: <a href="tel:877-322-8228">(877) 322-8228</a> (toll-free)
                            <br />
                            Mail: Annual Credit Report Request Service
                            <br />
                            PO Box 105281
                            <br />
                            Atlanta, GA 30348-5281
                        </p>

                        <h2>
                            How do I obtain a copy of the consumer report generated for my rental application through
                            Funnel?
                        </h2>
                        <p>
                            You may obtain a copy of the report generated from our CRA vendor for your rental
                            application through Funnel in one of these ways:
                        </p>
                        <ol type="1">
                            <li>
                                Call our toll-free number <a href="tel:833-979-3074">(833) 979-3074</a> OR
                            </li>
                            <li>
                                Complete Online form (
                                <a href="https://forms.gle/aSk9vRXCecfFYckb9" target="_blank" rel="noopener noreferrer">
                                    https://forms.gle/aSk9vRXCecfFYckb9
                                </a>
                                )
                            </li>
                        </ol>
                        <p>
                            Your report is typically sent to you within [5] business days of Funnel receiving your
                            completed request.
                        </p>

                        <h2>The information in my file is not correct, how do I dispute it?</h2>
                        <p>
                            You may dispute information on your consumer report by contacting the consumer reporting
                            agency directly. Their details are below: Alternatively, you may log a dispute directly with
                            us by calling our toll-free number: [833-979-3074] or by sending email/completing form at{' '}
                            <a href="www.funnel.com/consumer" target="_blank" rel="noopener noreferrer">
                                www.funnel.com/consumer
                            </a>
                        </p>
                        <p>
                            A reinvestigation will be completed within 30 days from the date we receive your request and
                            you will be notified in writing with the results of your consumer dispute. If you are
                            disputing information appearing on a consumer report obtained by a Funnel client in
                            conjunction with your application for housing, we will notify the appropriate credit bureau
                            of your dispute.
                        </p>
                        <p>
                            Alternately, you may wish to contact the consumer reporting agency directly to initiate your
                            credit dispute:
                        </p>
                        <p>
                            <strong>TransUnion Rental Screening Solutions</strong>
                            <br />
                            Attn: Consumer Dispute Team
                            <br />
                            Box 800
                            <br />
                            Woodlyn, PA 19094
                            <br />
                            <a href="tel:800-230-9376">(800) 230-9376</a>
                            <br />
                            <a href="mailto:TURSSDispute@transunion.com">TURSSDispute@transunion.com</a>
                            <br />
                            <a
                                href="https://www.transunion.com/client-support/rental-screening-disputes"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                https://www.transunion.com/client-support/rental-screening-disputes
                            </a>
                        </p>
                        <p>
                            <strong>Finicity Corporation</strong>
                            <br />
                            Attn: Information Dispute Services
                            <br />
                            53rd Center
                            <br />
                            434 Ascension Way, Suite 200
                            <br />
                            Murray, UT 84123
                            <br />
                            <a href="tel:+1-855-263-3072">+1 (855) 263-3072</a>
                            <br />
                            <a href="https://consumer.finicityreports.com" target="_blank" rel="noopener noreferrer">
                                https://consumer.finicityreports.com
                            </a>
                        </p>

                        <h2>What is the Fair Credit Reporting Act?</h2>
                        <p>
                            The Fair Credit Reporting Act (FCRA) is a federal law that gives you the right to know what
                            Consumer Reporting Agencies (CRAs) have on file about you, as well as outlining your right
                            to dispute errors contained in your consumer file. It sets tight restrictions for CRAs about
                            the circumstances under which a consumer report may be obtained and disclosed. The FCRA
                            gives you the right to receive a free copy of your consumer file if you are denied credit,
                            housing, employment or had any other adverse action as a result of information obtained from
                            a CRA. For additional information on the FCRA, visit the Federal Trade Commission's Web site
                            at:{' '}
                            <a href="www.ftc.gov" target="_blank" rel="noopener noreferrer">
                                www.ftc.gov
                            </a>
                            .
                        </p>

                        <h2>Someone else has been using my identity, what do I do?</h2>
                        <p>
                            If you believe you are the victim of identity theft, you should contact the credit bureau[s]
                            for information on how to place a fraud alert or file block on your consumer credit file.
                            Additional information on identity fraud may be found on the Federal Trade Commission's
                            Identity Theft Data Clearinghouse Web site at{' '}
                            <a href="www.consumer.gov/idtheft" target="_blank" rel="noopener noreferrer">
                                www.consumer.gov/idtheft
                            </a>
                            .
                        </p>

                        <p>
                            If you suspect that you have been or are about to become a victim of fraud or a related
                            crime, including identity theft, you may contact the national consumer reporting agencies to
                            request a fraud alert or other alerts permitted under the Fair Credit Reporting Act be
                            placed in the files such companies maintain on you. The addresses, phone numbers and
                            websites are as follows:
                        </p>
                        <p>
                            EQUIFAX
                            <br />
                            P.O. Box 740256
                            <br />
                            Atlanta, GA 30374
                            <br />
                            <a href="tel:800-525-6285">(800) 525-6285</a>
                            <br />
                            <a href="www.equifax.com" target="_blank" rel="noopener noreferrer">
                                www.equifax.com
                            </a>
                        </p>
                        <p>
                            EXPERIAN
                            <br />
                            P.O. Box 9556
                            <br />
                            Allen, TX 75013
                            <br />
                            <a href="tel:888-397-3742">(888) 397-3742</a>
                            <br />
                            <a href="www.experian.com" target="_blank" rel="noopener noreferrer">
                                www.experian.com
                            </a>
                        </p>
                        <p>
                            TRANSUNION
                            <br />
                            P.O. Box 6790
                            <br />
                            Fullerton, CA 92834-6790
                            <br />
                            <a href="tel:800-680-7289">(800) 680-7289</a>
                            <br />
                            <a href="www.transunion.com">www.transunion.com</a>
                        </p>

                        <p>
                            If you are a victim of identity theft, you should contact the Federal Trade Commission’s
                            Identity Theft Hotline to obtain more detailed information about how to protect yourself and
                            recover from identity theft and to file an identity theft complaint.
                        </p>
                        <p>
                            By sharing your identity theft complaint with the FTC, you will provide important
                            information that can help law enforcement officials across the nation track down identity
                            thieves and stop them. The FTC can refer victims' complaints to other government agencies
                            and companies for further action, as well as investigate companies for violations of laws
                            the agency enforces.
                        </p>
                        <p>
                            You can file a complaint online at www.ftc.gov/idtheft by phone through the FTC's Identity
                            Theft Hotline, toll-free: 1-877-IDTHEFT (438-4338); TTY: 1-866-653- 4261; or write: Identity
                            Theft Clearinghouse, Federal Trade Commission, 600 Pennsylvania Avenue, NW, Washington, DC
                            20580.
                        </p>
                    </Section>

                    <Section>
                        <h2>Contact Us</h2>
                        <p>
                            If you have additional questions or concerns, our Consumer Relations Specialists can assist
                            you.
                        </p>
                        <p>
                            Phone: <a href="tel:+1-888-333-2413">+1 (888) 333-2413</a>
                            <br />
                            Mail: <a href="mailto:consumer@funnelleasing.com">consumer@funnelleasing.com</a>
                            <br />
                            Funnel Leasing
                            <br />
                            150 west 22nd Street
                            <br />
                            NY, NY 10011
                        </p>
                    </Section>
                </ScrollableTermsCardSection>
            </Card>
        </>
    );
}

FAQ.propTypes = {
    community: PropTypes.object.isRequired,
};

export default FAQ;
