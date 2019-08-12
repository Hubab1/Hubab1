import React, {Fragment} from 'react';
import styled from '@emotion/styled';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';

import { CardRow, P } from 'assets/styles';
import { formatCurrency } from 'utils/misc';


const CardRowNoFlex = styled.div`
    padding: 10px 0;
    border-bottom: 1px solid #EEEEEE;
`

const OtherApplicant = styled.div`
    margin: -2px 0 10px 32px;
`


export const ApplicationFees = ({totalApplicationFee, applicationFeesSelected, handleChange, otherApplicants}) => {
    return (
        <Fragment>
            <CardRow>
                <P bold>Application Fee</P>
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
                                otherApplicants.map((name, index) => <OtherApplicant key={`${name}${index}`}>{name}</OtherApplicant>)
                        }
                    </CardRowNoFlex>
            }
        </Fragment>
    )
}

export default ApplicationFees;