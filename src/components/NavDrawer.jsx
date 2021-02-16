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

import { APPLICATION_STATUSES, ROUTES } from 'app/constants';
import { actions } from 'reducers/store';
import { selectors } from 'reducers/renter-profile';
import ProgressBar from 'components/common/Page/ProgressBar';
import BannerLogo from 'components/common/Page/BannerLogo';
import NavStepper from './NavStepper';
import { drawerContent } from 'components/common/Page/styles';
import { H3 } from 'assets/styles';

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
    appBar: {
        backgroundColor: theme.palette.type === 'light' ? '#ffffff' : theme.palette.primary.main,
        color: theme.palette.type === 'light' ? '#000000' : theme.palette.primary.contrastText,
    },
    toolbar: {
        minHeight: 76,
    },
    menuList: {
        width: 130,
    },
    menuListItemDivider: {
        backgroundColor: '#eee',
        margin: '4px 8px',
    },
    accountDetails: {
        padding: '28px 15px 15px 15px',
        borderBottom: '1px solid #EEEEEE',
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
    name: {
        width: 100,
        fontSize: 18,
        fontWeight: 700,
    },
    email: {
        width: 100,
    },
    avatarWrapper: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 30,
        height: 30,
        backgroundColor: 'transparent',
        border: theme.palette.type === 'light' ? '2px solid black' : '2px solid white',
        borderRadius: '50%',
        color: theme.palette.type === 'light' ? 'black' : 'white',
        fontSize: 12,
    },
    ellipsed: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    paymentsTitle: {
        marginTop: '30px',
    },
    paymentSections: {
        margin: '10px 0 10px 0',
        padding: '0',
        listStyleType: 'none',
    },
    footer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px',
    },
}));

export function PersistentDrawerLeft({
    canAccessRoute,
    logout,
    history,
    applicant,
    children,
    profile,
    navRoutes,
    currentRoute,
}) {
    const classes = useStyles();
    const menuState = usePopupState({ variant: 'popover', popupId: 'menu' });
    const [open, setOpen] = useState(false);
    const name = `${applicant?.first_name} ${applicant?.last_name}`;
    const email = applicant?.email;
    const initials = name.split(' ').map((word) => word[0].toUpperCase());

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
        <div className={classes.root}>
            <CssBaseline />
            <AppBar color="primary" position="fixed" className={classes.appBar}>
                <Toolbar className={classes.toolbar}>
                    <IconButton color="inherit" aria-label="Open drawer" onClick={handleDrawerOpen} edge="start">
                        <MenuIcon />
                    </IconButton>
                    <BannerLogo />
                    <div className={classes.avatarWrapper}>
                        <div className={classes.avatar}>{initials}</div>
                        <IconButton size="small" {...bindTrigger(menuState)}>
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
                    </div>
                </Toolbar>
                <ProgressBar percent={progressBarPercentage} />
            </AppBar>
            <Drawer anchor="left" open={open} onClose={handleDrawerClose}>
                <div className={classes.list} role="presentation">
                    <Box className={classes.accountDetails}>
                        <Box display="flex">
                            <Box className={classes.initials}>{initials}</Box>
                            <Box display="flex" flexDirection="column">
                                <Box className={classes.ellipsed} maxWidth={220}>
                                    <span className={classes.name}>{name}</span>
                                </Box>
                                <Box className={classes.ellipsed} maxWidth={220}>
                                    <span className={classes.email}>{email}</span>
                                </Box>
                            </Box>
                        </Box>
                        {canAccessRoute(ROUTES.PAYMENT_DETAILS) && profile?.fees_breakdown && (
                            <Box>
                                <H3 className={classes.paymentsTitle}>Payments</H3>
                                <ul className={classes.paymentSections}>
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
                    </Box>
                    <Divider />
                    <NavStepper handleDrawerClose={handleDrawerClose} />
                    <Divider />
                    <Box className={classes.footer}>
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
    canAccessRoute: PropTypes.func,
    logout: PropTypes.func,
    history: PropTypes.object,
    applicant: PropTypes.object,
    children: PropTypes.array,
    profile: PropTypes.object,
    navRoutes: PropTypes.array,
    currentRoute: PropTypes.string,
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
