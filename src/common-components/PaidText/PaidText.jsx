import React from 'react';
import PropTypes from 'prop-types';
import GreenCheckIcon from 'common-components/GreenCheckIcon/GreenCheckIcon';
import { P } from 'assets/styles';

export const PaidText = ({ margin = '0' }) => (
    <P bold color="#56BA82" margin={margin}>
        <GreenCheckIcon />
        Paid
    </P>
);

PaidText.propTypes = {
    margin: PropTypes.string,
};

export default PaidText;
