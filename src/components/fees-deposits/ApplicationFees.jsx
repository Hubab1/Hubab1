import React from 'react';
import styled from '@emotion/styled';
import { css } from 'emotion';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Info from '@material-ui/icons/Info';

import SimplePopover from 'components/common/SimplePopover';
import PaidText from './PaidText';
import { CardRowBorderless, P, infoIconRoot } from 'assets/styles';
import { formatCurrency } from 'utils/misc';


const SelfSelectedAmountContainer = styled.div`
    margin: auto 0;
`

const IndentedRow = styled(CardRowBorderless)`
    margin: 0 0 5px 32px;
`

const root = css`
    width: 100%;
`

const ApplicationFeesContainer = styled.div`
    padding: 15px 0;
    border-bottom: 1px solid #EEEEEE;
`

export const ApplicationFees = ({applicationFeesSelected, handleChange, everyone, baseAppFee, applicantFeePaid, unpaidApplicants }) => {

    const applicationFeeCopy = `Application fee is $${baseAppFee} per person to run a credit check and background screening.`;
    return (
        <ApplicationFeesContainer>
            <CardRowBorderless>
                <P>
                    Application Fee 
                    {" "}
                    <SimplePopover text={applicationFeeCopy}>
                        <Info classes={{root: infoIconRoot}} style={{color:'#828796',width:16}}/>
                    </SimplePopover>
                </P>
                { everyone.length > 1 ? <P/> : <P>{formatCurrency(baseAppFee, 0)}</P>}
            </CardRowBorderless>
            {
                !applicantFeePaid && everyone.length > 0 && !!unpaidApplicants &&
                    <CardRowBorderless style={{border:'none', paddingBottom:0}}>
                        <FormControl component="fieldset" classes={{root}}>
                            <RadioGroup
                                aria-label="payment-options"
                                name="payment-options"
                                value={applicationFeesSelected}
                                onChange={(event) => handleChange(event.target.value)}
                            >
                                <CardRowBorderless>
                                    <FormControlLabel value="self" control={<Radio />} label="Just Myself" />
                                    <SelfSelectedAmountContainer>
                                        { applicationFeesSelected === 'self' ? <P>{formatCurrency(baseAppFee, 0)}</P> : <P/> }
                                    </SelfSelectedAmountContainer>
                                </CardRowBorderless>
                                <FormControlLabel value="everyone" control={<Radio />} label="Everyone" />
                            </RadioGroup>
                        </FormControl>
                    </CardRowBorderless>
            }
            {
                applicationFeesSelected === 'everyone' && 
                    everyone.map((person, index) => <EveryoneRow key={index} person={person} baseAppFee={baseAppFee}/>)
            }
        </ApplicationFeesContainer>
    )
}

export const EveryoneRow = ({person, baseAppFee}) => {
    const name = person.client ? 
        person.client.person.name : 
        `${person.first_name} ${person.last_name}`
    return <IndentedRow>
        <P color="#454B57">{name}</P>
        <div>{ person.application_fee_paid ? <PaidText/> : <P>{formatCurrency(baseAppFee, 0)}</P> } </div>
    </IndentedRow>
}


export default ApplicationFees;