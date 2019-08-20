import React from 'react';

import DoneRoundedIcon from '@material-ui/icons/CheckRounded';
import { P } from 'assets/styles';


export const PaidText = ({margin="0"}) => <P bold color="#56BA82" fontSize="14px" margin={margin}><DoneRoundedIcon style={{color:'#56BA82', width:18, verticalAlign:'top', position:'relative', top:-2}}/>Paid</P>;

export default PaidText;