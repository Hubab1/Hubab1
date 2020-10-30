import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ActionButton from 'components/common/ActionButton/ActionButton';
import { H1, Card, ScrollableTermsCardSection } from 'assets/styles';
import UnauthenticatedPage from 'components/common/Page/UnauthenticatedPage';
import Checkbox from 'components/common/Checkbox';
import styled from '@emotion/styled';

const AgreementCheckboxContainer = styled.div`
    font-size: 14px;
    div {
        padding: 26px 0 0 0;
    }
    div:first-child {
        padding: 6px 0 0 0;
    }
    .MuiCheckbox-root {
        height: 14px;
        width: 14px;
    }
    margin-bottom: 47px;
`;

export function ElectronicSignatureAgreement(props) {
    const [agreeElectronicSignature, setAgreeElectronicSignature] = useState(false);
    const [agreeTermsOfService, setAgreeTermsOfService] = useState(false);
    const base = (
        <>
            <H1>Consent to Electronic Signature and Terms of Service</H1>
            <br />
            <Card>
                <ScrollableTermsCardSection>
                    <div className="tos-container">
                        <em>Last Updated: March 19, 2020</em>
                        <p>
                            <b>Consent to Electronic Signature</b>
                        </p>
                        <p>
                            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
                            laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi
                            architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit
                            aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione
                            voluptatem sequi nesciunt.
                        </p>
                        <p>
                            <b>Terms of Service</b>
                        </p>
                        <p>
                            At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium
                            voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati
                            cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id
                            est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam
                            libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod
                            maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.
                            Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut
                            et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a
                            sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis
                            doloribus asperiores repellat. At vero eos et accusamus et iusto odio dignissimos ducimus
                            qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias
                            excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia
                            deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est
                            et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil
                            impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est,
                            omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum
                            necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.
                            Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores
                            alias consequatur aut perferendis doloribus asperiores repellat. At vero eos et accusamus et
                            iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti
                            quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique
                            sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum
                            quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est
                            eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis
                            voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis
                            debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et
                            molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut
                            reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores
                            repellat. At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis
                            praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint
                            occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia
                            animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita
                            distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo
                            minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor
                            repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus
                            saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum
                            rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias
                            consequatur aut perferendis doloribus asperiores repellat.
                        </p>
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
                <ActionButton onClick={props.onAgree} disabled={!(agreeTermsOfService && agreeElectronicSignature)}>
                    Agree and Continue
                </ActionButton>
            </UnauthenticatedPage>
        );
    }
}

ElectronicSignatureAgreement.propTypes = {
    isSignedIn: PropTypes.bool.isRequired,
    onAgree: PropTypes.func.isRequired,
};
