import React, { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { generatePath, withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {
    makeStyles,
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
import { Menu as MenuIcon, ExpandMore as ExpandMoreIcon, ArrowBackIos as ArrowBackIosIcon } from '@material-ui/icons';
import { usePopupState, bindTrigger, bindPopover } from 'material-ui-popup-state/hooks';
import clsx from 'clsx';

import { APPLICATION_STATUSES, ROUTES } from 'constants/constants';
import { actions } from 'reducers/store';
import { selectors as profileSelectors } from 'reducers/renter-profile';
import { getOlApplicantCanViewApplicationsListPage } from 'selectors/launchDarkly';

import ProgressBar from './ProgressBar';
import BannerLogo from './BannerLogo';
import NavStepper from './NavStepper';
import { drawerContent } from './styles';
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
        backgroundColor: !theme.darkMode ? '#ffffff' : theme.palette.primary.main,
        color: !theme.darkMode ? '#000000' : theme.palette.primary.contrastText,
    },
    toolbar: {
        display: 'flex',
        flexFlow: 'row nowrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: 76,
    },
    bannerLogo: {
        position: 'absolute',
        left: 0,
        right: 0,
        margin: 'auto',
        pointerEvents: 'none',
    },
    drawerMenuTrigger: {
        color: !theme.darkMode ? 'black' : 'white',
    },
    profileMenuTrigger: {
        borderRadius: '35px',
        color: !theme.darkMode ? 'black' : 'white',
    },
    profileMenuList: {
        width: 130,

        // Divider
        '& hr': {
            backgroundColor: '#eee',
            margin: '4px 8px',
        },
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
        border: !theme.darkMode ? '2px solid black' : '2px solid white',
        borderRadius: '50%',
        color: !theme.darkMode ? 'black' : 'white',
        fontSize: 12,
    },
    goBack: {
        color: !theme.darkMode ? 'black' : 'white',
        borderRadius: '35px',

        '& span': {
            fontSize: 14,
        },
    },
}));

const APPLICATION_TOOLBAR_ROUTES = [ROUTES.APPLICATIONS];

export function PersistentDrawerLeft({
    history,
    applicant,
    applicationFees,
    profile,
    currentRoute,
    children,
    navRoutes,
    canSeeApplications,
    canAccessRoute,
    logout,
}) {
    const classes = useStyles();
    const menuState = usePopupState({ variant: 'popover', popupId: 'menu' });
    const [open, setOpen] = useState(false);
    const unitNumber = profile?.unit?.unit_number;
    const communityName = profile?.community?.display_name;
    const initials = `${applicant?.first_name?.charAt(0)}${applicant?.last_name?.charAt(0)}`.toUpperCase();
    const showGoBack = history.length > 2;

    /**
     * Determines wether or not to show the applications toolbar instead of the sidebar drawer
     * based on the current location.
     */
    const showApplicationsToolbar = useMemo(() => {
        return APPLICATION_TOOLBAR_ROUTES.includes(history.location.pathname);
    }, [history.location.pathname]);

    const progressBarPercentage = useMemo(() => {
        if (!(currentRoute && navRoutes)) return 0;

        if (profile?.status === APPLICATION_STATUSES.APPLICATION_STATUS_COMPLETED) return 100;

        for (let i = 0; i < navRoutes.length; i++) {
            const route = navRoutes[i];
            if (route.value === currentRoute) return Math.floor((i * 100) / navRoutes.length);
        }
        return 0;
    }, [navRoutes, currentRoute, profile]);

    const getShouldHistoryPush = useCallback(
        (route) => {
            return history?.location?.pathname !== route;
        },
        [history]
    );

    const handleGoBackClick = useCallback(() => {
        history.goBack();
    }, [history]);

    const handleDrawerOpen = useCallback(() => {
        setOpen(true);
    }, []);

    const handleDrawerClose = useCallback(() => {
        setOpen(false);
    }, []);

    const handleAccountClick = useCallback(() => {
        menuState.close();

        if (getShouldHistoryPush(ROUTES.ACCOUNT)) {
            history.push(ROUTES.ACCOUNT);
        }
    }, [menuState, history, getShouldHistoryPush]);

    const handleApplicationsClick = useCallback(() => {
        menuState.close();

        if (getShouldHistoryPush(ROUTES.APPLICATIONS)) {
            history.push(ROUTES.APPLICATIONS);
        }
    }, [menuState, history, getShouldHistoryPush]);

    const handleLogoutClick = useCallback(() => {
        menuState.close();
        localStorage.clear();
        logout();
        history.push(ROUTES.LOGIN);
    }, [menuState, logout, history]);

    const menu = useMemo(() => {
        return (
            <Popover
                {...bindPopover(menuState)}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
            >
                <MenuList className={classes.profileMenuList}>
                    <MenuItem onClick={handleAccountClick}>Account</MenuItem>
                    {canSeeApplications && (
                        // Material-UI: The Menu component doesn't accept a Fragment as a child...
                        <div>
                            <Divider className={classes.menuListItemDivider} />
                            <MenuItem onClick={handleApplicationsClick}>Applications</MenuItem>
                        </div>
                    )}
                    <Divider />
                    <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
                </MenuList>
            </Popover>
        );
    }, [classes, canSeeApplications, menuState, handleAccountClick, handleApplicationsClick, handleLogoutClick]);

    if (!applicant) return null;

    if (showApplicationsToolbar) {
        return (
            <>
                <AppBar color="primary" position="fixed" className={classes.appBar}>
                    <Toolbar
                        className={classes.toolbar}
                        style={{ justifyContent: showGoBack ? 'space-between' : 'flex-end' }}
                    >
                        {showGoBack && (
                            <IconButton className={classes.goBack} onClick={handleGoBackClick} edge="start">
                                <ArrowBackIosIcon />
                                <span>Go Back</span>
                            </IconButton>
                        )}
                        <BannerLogo className={classes.bannerLogo} />
                        <IconButton className={classes.profileMenuTrigger} {...bindTrigger(menuState)} edge="end">
                            <div className={classes.avatar}>{initials}</div>
                            <ExpandMoreIcon fontSize="small" />
                        </IconButton>
                        {menu}
                    </Toolbar>
                </AppBar>
                <main>
                    <div className={classes.drawerHeader} />
                    <div className={drawerContent}>{children}</div>
                </main>
            </>
        );
    }

    return (
        <>
            <AppBar color="primary" position="fixed" className={classes.appBar}>
                <Toolbar className={classes.toolbar}>
                    <IconButton className={classes.drawerMenuTrigger} onClick={handleDrawerOpen} edge="start">
                        <MenuIcon />
                    </IconButton>
                    <BannerLogo className={classes.bannerLogo} />
                    <IconButton className={classes.profileMenuTrigger} {...bindTrigger(menuState)} edge="end">
                        <div className={classes.avatar}>{initials}</div>
                        <ExpandMoreIcon fontSize="small" />
                    </IconButton>
                    {menu}
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
                                    <b>${applicationFees.total}</b> due at application
                                </li>
                                <li>
                                    <b>${profile.fees_breakdown.move_in_fees.total}</b> due at move in
                                </li>
                                <li>
                                    <b>${profile.fees_breakdown.monthly_fees.total}</b> monthly rent
                                </li>
                            </ul>
                            <Link to={generatePath(ROUTES.PAYMENT_DETAILS, { application_id: profile.id })}>
                                Payment Details
                            </Link>
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
        </>
    );
}

PersistentDrawerLeft.propTypes = {
    history: PropTypes.object,
    applicant: PropTypes.object,
    applicationFees: PropTypes.object,
    profile: PropTypes.object,
    currentRoute: PropTypes.string,
    children: PropTypes.array,
    navRoutes: PropTypes.array,
    canSeeApplications: PropTypes.bool,
    canAccessRoute: PropTypes.func,
    logout: PropTypes.func,
};

const mapStateToProps = (state) => ({
    applicant: state.applicant,
    applicationFees: profileSelectors.applicationFees(state),
    profile: state.renterProfile,
    canAccessRoute: (route) => profileSelectors.canAccessRoute(state, route),
    navRoutes: profileSelectors.selectNav(state),
    currentRoute: state.siteConfig.currentRoute,
    canSeeApplications: getOlApplicantCanViewApplicationsListPage(state),
});

const mapDispatchToProps = {
    logout: actions.logout,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(PersistentDrawerLeft));
