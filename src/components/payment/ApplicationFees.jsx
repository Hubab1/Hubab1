import React, {Fragment} from 'react';
import styled from '@emotion/styled';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Info from '@material-ui/icons/Info';
import SimplePopover from 'components/common/SimplePopover';


import { CardRow, P, infoIconRoot } from 'assets/styles';
import { formatCurrency } from 'utils/misc';


export const CardRowNoFlex = styled.div`
    padding: 10px 0;
    border-bottom: 1px solid #EEEEEE;
`

const OtherApplicant = styled.div`
    margin: -2px 0 10px 32px;
`


export const ApplicationFees = ({ totalApplicationFee, applicationFeesSelected, handleChange, otherApplicants, baseAppFee }) => {

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
                <P bold>{formatCurrency(totalApplicationFee)}</P>
            </CardRow>
            {   
                otherApplicants.length > 0 && 
                    <CardRowNoFlex>
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
                        {
                            applicationFeesSelected === 'everyone' && 
                                otherApplicantNames.map((name, index) => <OtherApplicant key={index}>{name}</OtherApplicant>)
                        }
                    </CardRowNoFlex>
            }
        </Fragment>
    )
}

export default ApplicationFees;