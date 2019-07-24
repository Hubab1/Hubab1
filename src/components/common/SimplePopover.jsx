import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import { css } from 'emotion';
import Cancel from '@material-ui/icons/Cancel';
const cancelButton = css`
    color: #828796;
    cursor: pointer;
    position: absolute;
    top: 10px;
    right: 5px;
`

const useStyles = makeStyles(theme => ({
    typography: {
        padding: theme.spacing(2, 4, 2, 2),
    },
    root: {
        display: 'inline'
    }
}));

export default function SimplePopover(props) {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);

    function handleClick(event) {
        setAnchorEl(event.currentTarget);
    }

    function handleClose() {
        setAnchorEl(null);
    }

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
        <>
            <Typography
                aria-describedby={id}
                aria-haspopup="true"
                classes={{
                    root: classes.root
                }}
                onClick={handleClick}
            >
                {props.children}
            </Typography>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
            >
                <Typography className={classes.typography}>Lorem ipsum dolor sit amet, consectetur adipiscing elit
                    <Cancel onClick={handleClose} role="button" style={{fontSize: 17}} className={cancelButton} />
                </Typography>
            </Popover>
        </>
    );
}
