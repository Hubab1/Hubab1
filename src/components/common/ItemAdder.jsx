import React from 'react';
import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';
import Adder from 'components/common/Adder';
import { css } from 'emotion';

const title = css`
    font-size: 20px;
`;

// TODO: change size to 16px
const subtitle = css`
    font-size: 14px;
    color: #444b58;
`;
export default function ItemAdder(props) {
    return (
        <Box display="flex" flexGrow={1} justifyContent="space-between" alignItems="center" padding="10px">
            <div>
                <div className={title}>{props.title}</div>
                {!!props.subtitle && <div className={subtitle}>{props.subtitle}</div>}
            </div>
            <Adder ceil={props.limit} onChange={props.onChange} value={props.value} />
        </Box>
    );
}

ItemAdder.propTypes = {
    title: PropTypes.string,
    subtitle: PropTypes.string,
    limit: PropTypes.number,
    onChange: PropTypes.func,
    value: PropTypes.number,
};
