import React, { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {
    makeStyles,
    CssBaseline,
    Drawer,
    AppBar,
    Toolbar,
    Divider,
    IconButton,
    Popover,
    MenuList,
    MenuItem,
    Box,
} from '@material-ui/core';
import { Menu as MenuIcon, ExpandMore as ExpandMoreIcon } from '@material-ui/icons';
import { usePopupState, bindTrigger, bindPopover } from 'material-ui-popup-state/hooks';
import clsx from 'clsx';

import { APPLICATION_STATUSES, ROUTES } from 'app/constants';
import { actions } from 'reducers/store';
import { selectors } from 'reducers/renter-profile';
import ProgressBar from 'components/common/Page/ProgressBar';
import BannerLogo from 'components/common/Page/BannerLogo';
import NavStepper from './NavStepper';
import { drawerContent } from 'components/common/Page/styles';
import { PALLETE_TYPES } from 'assets/theme';
import { H3 } from 'assets/styles';

const useStyles = makeStyles((theme) => ({
    list: {
        width: 300,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: '0 8px',
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
    appBar: {
        backgroundColor: theme.palette.type === PALLETE_TYPES.LIGHT ? '#ffffff' : theme.palette.primary.main,
        color: theme.palette.type === PALLETE_TYPES.LIGHT ? '#000000' : theme.palette.primary.contrastText,
    },
    toolbar: {
        minHeight: 76,
    },
    menuTrigger: {
        borderRadius: '35px',
    },
    menuList: {
        width: 130,
    },
    menuListItemDivider: {
        backgroundColor: '#eee',
        margin: '4px 8px',
    },
    section: {
        margin: '24px 16px',
        marginBottom: 0,
        paddingBottom: 24,
        borderBottom: '1px solid #eee',
    },
    communitySection: {
        display: 'flex',
        flexFlow: 'column',

        '& :first-child': {
            fontSize: 18,
            fontWeight: 600,
        },
        '& :nth-child(2)': {
            fontSize: 14,
        },
    },
    paymentSection: {
        '& ul': {
            margin: '10px 0 10px 0',
            padding: '0',
            listStyleType: 'none',
        },
    },
    footer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        border: 'none',
    },
    initials: {
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
    avatar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 30,
        height: 30,
        backgroundColor: 'transparent',
        border: theme.palette.type === PALLETE_TYPES.LIGHT ? '2px solid black' : '2px solid white',
        borderRadius: '50%',
        color: theme.palette.type === PALLETE_TYPES.LIGHT ? 'black' : 'white',
        fontSize: 12,
    },
}));

export function PersistentDrawerLeft({
    history,
    applicant,
    profile,
    currentRoute,
    children,
    navRoutes,
    canAccessRoute,
    logout,
}) {
    const classes = useStyles();
    const menuState = usePopupState({ variant: 'popover', popupId: 'menu' });
    const [open, setOpen] = useState(false);
    const unitNumber = profile?.unit?.unit_number;
    const communityName = profile?.community?.display_name;
    const initials = `${applicant?.first_name?.charAt(0)}${applicant?.last_name?.charAt(0)}`.toUpperCase()

    const progressBarPercentage = useMemo(() => {
        if (!(currentRoute && navRoutes)) return 0;

        if (profile?.status === APPLICATION_STATUSES.APPLICATION_STATUS_COMPLETED) return 100;

        for (let i = 0; i < navRoutes.length; i++) {
            const route = navRoutes[i];
            if (route.value === currentRoute) return Math.floor((i * 100) / navRoutes.length);
        }
        return 0;
    }, [navRoutes, currentRoute, profile]);

    const handleDrawerOpen = useCallback(() => {
        setOpen(true);
    }, []);

    const handleDrawerClose = useCallback(() => {
        setOpen(false);
    }, []);

    const handleAccountClick = useCallback(() => {
        menuState.close();
        history.push(ROUTES.ACCOUNT);
    }, [menuState, history]);

    const handleLogoutClick = useCallback(() => {
        menuState.close();
        localStorage.clear();
        logout();
        history.push(ROUTES.LOGIN);
    }, [menuState, logout, history]);

    if (!applicant) return null;

    return (
        <div>
            <CssBaseline />
            <AppBar color="primary" position="fixed" className={classes.appBar}>
                <Toolbar className={classes.toolbar}>
                    <IconButton color="inherit" aria-label="Open drawer" onClick={handleDrawerOpen} edge="start">
                        <MenuIcon />
                    </IconButton>
                    <BannerLogo />
                    <IconButton className={classes.menuTrigger} {...bindTrigger(menuState)}>
                        <div className={classes.avatar}>{initials}</div>
                        <ExpandMoreIcon />
                    </IconButton>
                    <Popover
                        {...bindPopover(menuState)}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                    >
                        <MenuList className={classes.menuList}>
                            <MenuItem onClick={handleAccountClick}>Account</MenuItem>
                            <Divider className={classes.menuListItemDivider} />
                            <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
                        </MenuList>
                    </Popover>
                </Toolbar>
                <ProgressBar percent={progressBarPercentage} />
            </AppBar>
            <Drawer anchor="left" open={open} onClose={handleDrawerClose}>
                <div className={classes.list} role="presentation">
                    <Box className={clsx(classes.section, classes.communitySection)}>
                        <span>{communityName}</span>
                        {unitNumber && <span>{`Unit ${unitNumber}`}</span>}
                    </Box>
                    {canAccessRoute(ROUTES.PAYMENT_DETAILS) && profile?.fees_breakdown && (
                        <Box className={clsx(classes.section, classes.paymentSection)}>
                            <H3>Payments</H3>
                            <ul>
                                <li>
                                    <b>${profile.fees_breakdown.application_fees.total}</b> due at application
                                </li>
                                <li>
                                    <b>${profile.fees_breakdown.move_in_fees_v2.total}</b> due at move in
                                </li>
                                <li>
                                    <b>${profile.fees_breakdown.monthly_fees_v2.total}</b> monthly rent
                                </li>
                            </ul>
                            <Link to={ROUTES.PAYMENT_DETAILS}>Payment Details</Link>
                        </Box>
                    )}
                    <Box className={classes.section}>
                        <NavStepper handleDrawerClose={handleDrawerClose} />
                    </Box>
                    <Box className={clsx(classes.section, classes.footer)}>
                        <Link target="_blank" to={ROUTES.PRIVACY_POLICY}>
                            Privacy
                        </Link>
                        <Link target="_blank" to={ROUTES.TERMS}>
                            Terms of Use
                        </Link>
                        <Link target="_blank" to={ROUTES.FAQ}>
                            FAQs
                        </Link>
                    </Box>
                </div>
            </Drawer>
            <main>
                <div className={classes.drawerHeader} />
                <div className={drawerContent}>{children}</div>
            </main>
        </div>
    );
}

PersistentDrawerLeft.propTypes = {
    history: PropTypes.object,
    applicant: PropTypes.object,
    profile: PropTypes.object,
    currentRoute: PropTypes.string,
    children: PropTypes.array,
    navRoutes: PropTypes.array,
    canAccessRoute: PropTypes.func,
    logout: PropTypes.func,
};

const mapStateToProps = (state) => ({
    applicant: state.applicant,
    profile: state.renterProfile,
    canAccessRoute: (route) => selectors.canAccessRoute(state, route),
    navRoutes: selectors.selectNav(state),
    currentRoute: state.siteConfig.currentRoute,
});

const mapDispatchToProps = {
    logout: actions.logout,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(PersistentDrawerLeft));
