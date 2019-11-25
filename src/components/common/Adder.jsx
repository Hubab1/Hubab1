import React from 'react';
import { css } from 'emotion';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import RemoveCircleOutlineSharpIcon from '@material-ui/icons/RemoveCircleOutlineSharp';
import AddCircleOutlineSharpIcon from '@material-ui/icons/AddCircleOutlineSharp';


const valueDisplay = css`
    width: 30px;
    text-align: center;
    font-size: 30px;
    color: #1C2B6D;
    user-select: none;
`
export default function Adder(props) {
    const onFloor = props.value <= props.floor;
    const onCeil = props.value >= props.ceil;
    const decrement = () => {
        if (!onFloor) {
            props.onChange(props.value - 1)
        }
    }
    const increment = () => {
        if (!onCeil) {
            props.onChange(props.value + 1)
        }
    }
    return <Box display="flex" alignItems="center">
        <IconButton disabled={onFloor} onClick={decrement}>
            <RemoveCircleOutlineSharpIcon fontSize="large" />
        </IconButton>
        <div className={valueDisplay}>{props.value}</div>
        <IconButton disabled={onCeil} onClick={increment}>
            <AddCircleOutlineSharpIcon fontSize="large"/>
        </IconButton>
    </Box>
}

Adder.defaultProps = {
    value: 0,
    floor: 0,
    ceil: 10,
    size: '24px',
}