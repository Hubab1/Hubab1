import React, {Fragment} from 'react';
import styled from '@emotion/styled';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Info from '@material-ui/icons/Info';

import SimplePopover from 'components/common/SimplePopover';
import PaidText from './PaidText';
import { CardRow, P, infoIconRoot } from 'assets/styles';
import { formatCurrency } from 'utils/misc';


const AmountContainer = styled.div`
    width: 90px;
    text-align: left;
`    

export const ApplicationFees = ({ totalApplicationFee, applicationFeesSelected, handleChange, otherApplicants, baseAppFee, applicantFeePaid }) => {

    const otherApplicantNames = [];
    const reduceFunction = (acc, current) => {
        acc.push(`${current.first_name} ${current.last_name}`);
        return acc
    }
    otherApplicants.reduce(reduceFunction, otherApplicantNames);

    const applicationFeeCopy = `Application fee is $${baseAppFee} per person to run a credit check and background screening.`

    return (
        <Fragment>
            <CardRow>
                <P bold>
                    Application Fee 
                    {" "}
                    <SimplePopover text={applicationFeeCopy}>
                        <Info classes={{root: infoIconRoot}} style={{color:'#828796',width:16}}/>
                    </SimplePopover>
                </P>
                <AmountContainer>
                    { applicantFeePaid ? <PaidText/> : <P bold>{formatCurrency(totalApplicationFee)}</P>}
                </AmountContainer>
            </CardRow>
            {   
                !applicantFeePaid && otherApplicants.length > 0 && 
                    <CardRow style={{border:'none'}}>
                        <FormControl component="fieldset">
                            <RadioGroup
                                aria-label="payment-options"
                                name="payment-options"
                                value={applicationFeesSelected}
                                onChange={(event) => handleChange(event.target.value)}
                            >
                                <FormControlLabel value="self" control={<Radio />} label="Just Myself" />
                                <FormControlLabel value="everyone" control={<Radio />} label="Everyone" />
                            </RadioGroup>
                        </FormControl>
                    </CardRow>
            }
            {
                applicationFeesSelected === 'everyone' && 
                    otherApplicants.map((person, index) => 
                        <OtherApplicantRow 
                            key={index} 
                            name={`${person.first_name} ${person.last_name}`}
                            applicantFeePaid={person.application_fee_paid}
                        />
                    )
            }
        </Fragment>
    )
}


export const OtherApplicantRow = ({name, applicantFeePaid}) => {
    return <CardRow style={{border:'none'}}>
        { applicantFeePaid ? <P color="#828796" decoration="line-through" margin="-20px 0 0 32px" fontSize="14px">{name}</P> : <P fontSize="14px" margin="-20px 0 0 32px">{name}</P> }
        <AmountContainer>
            { 
                applicantFeePaid ? <PaidText margin="-20px 0 0 0"/> : null
            }
        </AmountContainer>
    </CardRow>
}

export default ApplicationFees;