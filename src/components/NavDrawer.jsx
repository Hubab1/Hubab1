import React, { useContext } from 'react';
import { connect } from 'react-redux';
import { css } from 'emotion';
import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import MenuIcon from '@material-ui/icons/Menu';
import Box from '@material-ui/core/Box';
import { Link } from 'react-router-dom';

import { actions } from 'reducers/store';
import ProgressBar from 'components/common/Page/ProgressBar';
import { AppTheme } from 'contexts/AppContextProvider';
import BannerLogo from 'components/common/Page/BannerLogo';
import { drawerContent } from 'components/common/Page/styles';
import NavStepper from './NavStepper';

import { ROUTES } from 'app/constants';
import styled from '@emotion/styled';
import { withStyles } from '@material-ui/styles';
import { H3 } from 'assets/styles';
import PropTypes from 'prop-types';
import { selectors } from 'reducers/renter-profile';

const useStyles = makeStyles((theme) => ({
    list: {
        width: 300,
    },
    padRight: {
        width: 48,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: '0 8px',
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
    darkThemeAppbar: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
    },
    liteThemeAppbar: {
        backgroundColor: '#ffffff',
        color: '#000000',
    },
    toolbar: {
        minHeight: 76,
    },
    accountDetails: {
        padding: '28px 15px 15px 15px',
        borderBottom: '1px solid #EEEEEE',
    },
    initialsContainer: {
        color: '#828796',
        backgroundColor: '#EFEFEF',
        borderRadius: 50,
        textAlign: 'center',
        fontSize: 17,
        height: 40,
        width: 40,
        lineHeight: '40px',
        margin: '0 10px 10px 0',
    },
    logout: {
        fontWeight: 600,
        'text-transform': 'none',
    },
    paymentsTitle: {
        marginTop: '30px',
    },
    paymentSections: {
        margin: '10px 0 10px 0',
        padding: '0',
        listStyleType: 'none',
    },
}));

const links = css`
    > a:not(:last-child) {
        margin-right: 20px;
    }
`;

const EllipsisText = styled.b`
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: ${(props) => (props.fontWeight ? `${props.fontWeight}` : '600')};
    font-size: ${(props) => (props.fontSize ? `${props.fontSize}px` : 'inherit')};
    width: ${(props) => (props.width ? `${props.width}px` : '50px')};
`;

const StyledBox = withStyles({
    root: {
        witheSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
})(Box);

export function PersistentDrawerLeft(props) {
    const appThemeContext = useContext(AppTheme);
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    function handleDrawerOpen() {
        setOpen(true);
    }

    function handleDrawerClose() {
        setOpen(false);
    }

    function logout() {
        localStorage.clear();
        props.logout();
        props.history.push(ROUTES.LOGIN);
    }

    if (!props.applicant) return null;

    const name = `${props.applicant.first_name} ${props.applicant.last_name}`;
    const email = props.applicant.email;

    const initials = name.split(' ').map((word) => word[0].toUpperCase());

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar
                color="primary"
                position="fixed"
                classes={{
                    colorPrimary: appThemeContext?.dark_mode ? classes.darkThemeAppbar : classes.liteThemeAppbar,
                }}
            >
                <Toolbar className={classes.toolbar}>
                    <IconButton color="inherit" aria-label="Open drawer" onClick={handleDrawerOpen} edge="start">
                        <MenuIcon />
                    </IconButton>
                    <BannerLogo />
                    <div className={classes.padRight} />
                </Toolbar>
                <ProgressBar percent={33} />
            </AppBar>
            <Drawer anchor="left" open={open} onClose={handleDrawerClose}>
                <div className={classes.list} role="presentation">
                    <Box className={classes.accountDetails}>
                        <Box display="flex">
                            <Box className={classes.initialsContainer}>{initials}</Box>
                            <Box display="flex" flexDirection="column">
                                <StyledBox width={220} maxWidth={220}>
                                    <EllipsisText fontSize={18} width={100}>
                                        {name}
                                    </EllipsisText>
                                </StyledBox>
                                <StyledBox width={220} maxWidth={220}>
                                    <EllipsisText fontWeight={400} width={100}>
                                        {email}
                                    </EllipsisText>
                                </StyledBox>
                            </Box>
                        </Box>
                        <Box>
                            <Link to={ROUTES.ACCOUNT}>Account Details</Link>
                        </Box>
                        {props.canAccessRoute(ROUTES.PAYMENT_DETAILS) && props.profile?.fees_breakdown && (
                            <Box>
                                <H3 className={classes.paymentsTitle}>Payments</H3>
                                <ul className={classes.paymentSections}>
                                    <li>
                                        <b>${props.profile.fees_breakdown.application_fees.total}</b> due at application
                                    </li>
                                    <li>
                                        <b>${props.profile.fees_breakdown.move_in_fees_v2.total}</b> due at move in
                                    </li>
                                    <li>
                                        <b>${props.profile.fees_breakdown.monthly_fees_v2.total}</b> monthly rent
                                    </li>
                                </ul>
                                <Link to={ROUTES.PAYMENT_DETAILS}>Payment Details</Link>
                            </Box>
                        )}
                    </Box>
                    <Divider />
                    <NavStepper onRouteClicked={handleDrawerClose} />
                    <Divider />
                    <Box display="flex" justifyContent="space-between" alignItems="center" padding="0 15px">
                        <Button onClick={logout} classes={{ root: classes.logout }}>
                            Logout
                        </Button>
                        <div className={links}>
                            <Link target="_blank" to={ROUTES.PRIVACY_POLICY}>
                                Privacy
                            </Link>
                            <Link to={ROUTES.TERMS}>Terms of Use</Link>
                        </div>
                    </Box>
                </div>
            </Drawer>
            <main>
                <div className={classes.drawerHeader} />
                <div className={drawerContent}>{props.children}</div>
            </main>
        </div>
    );
}

PersistentDrawerLeft.propTypes = {
    canAccessRoute: PropTypes.func,
    logout: PropTypes.func,
    history: PropTypes.object,
    applicant: PropTypes.object,
    children: PropTypes.array,
    profile: PropTypes.object,
};

const mapStateToProps = (state) => ({
    applicant: state.applicant,
    profile: state.renterProfile,
    canAccessRoute: (route) => selectors.canAccessRoute(state, route),
});

const mapDispatchToProps = {
    logout: actions.logout,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(PersistentDrawerLeft));
