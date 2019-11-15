import React, { useContext } from 'react';
import styled from '@emotion/styled';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Grid from '@material-ui/core/Grid';
import { Link } from 'react-router-dom';

import { Bold } from 'assets/styles';
import ProgressBar from 'components/common/Page/ProgressBar';
import { AppTheme } from 'contexts/AppContextProvider';
import BannerLogo from 'components/common/Page/BannerLogo';
import { drawerContent } from 'components/common/Page/styles';
import UnauthenticatedPage from 'components/common/Page/UnauthenticatedPage';
import NavStepper from './NavStepper';

const useStyles = makeStyles(theme => ({
    list: {
        width: 240,
    },
    padRight: {
        width: 48
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
        color: theme.palette.primary.contrastText
    },
    liteThemeAppbar: {
        backgroundColor: '#ffffff',
        color: '#000000'
    },
    toolbar: { 
        minHeight: 76
    },
}));

const AccountDetailsContainer = styled.div`
    padding: 15px;
    border-bottom: 1px solid #EEEEEE;
`

const InitialsContainer = styled.div`
    color: #828796;
    background-color: #EFEFEF;
    border-radius: 50px;
    text-align: center;
    font-size: 17px;
    height: 40px;
    width: 40px;
    line-height: 40px;
`;

export function PersistentDrawerLeft(props) {
    if (props.hideNav) {
        return <UnauthenticatedPage>{props.children}</UnauthenticatedPage>
    }
    const appThemeContext = useContext(AppTheme);
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    function handleDrawerOpen() {
        setOpen(true);
    }

    function handleDrawerClose() {
        setOpen(false);
    }

    const initials = props.name.split(' ').map(word => word[0].toUpperCase());

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar
                color="primary"
                position="fixed"
                classes={{colorPrimary: appThemeContext.dark_mode ? classes.darkThemeAppbar : classes.liteThemeAppbar}}
            >
                <Toolbar className={classes.toolbar}>
                    <IconButton
                        color="inherit"
                        aria-label="Open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                    >
                        <MenuIcon />
                    </IconButton>
                    <BannerLogo />
                    <div className={classes.padRight}></div>
                </Toolbar>
                <ProgressBar percent={33}/>
            </AppBar>
            <Drawer
                anchor="left"
                open={open}
                onClose={handleDrawerClose}
            >
                <div
                    className={classes.list}
                    role="presentation"
                >
                    <div className={classes.drawerHeader}>
                        <IconButton onClick={handleDrawerClose}>
                            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                        </IconButton>
                    </div>
                    <AccountDetailsContainer>
                        <Grid container spacing={1}>
                            <Grid item xs={3}>
                                <InitialsContainer>{initials}</InitialsContainer>
                            </Grid>
                            <Grid item xs={9}>
                                <Grid item xs>
                                    <Bold fontSize={18}>{props.name}</Bold>
                                </Grid>
                                <Grid item xs>
                                    {props.email}
                                </Grid>
                            </Grid>
                            <Grid item>
                                <Link to='/'>Account Details</Link>
                            </Grid>
                        </Grid>
                    </AccountDetailsContainer>
                    <Divider />
                    <NavStepper onRouteClicked={handleDrawerClose}/>
                    <Divider />
                </div>
            </Drawer>
            <main>
                <div className={classes.drawerHeader} />
                <div className={drawerContent}>
                    {props.children}
                </div>
            </main>
        </div>
    );
}

export default PersistentDrawerLeft;
