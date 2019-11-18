import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Box from '@material-ui/core/Box';
import { Link } from 'react-router-dom';

import { Bold } from 'assets/styles';
import ProgressBar from 'components/common/Page/ProgressBar';
import { AppTheme } from 'contexts/AppContextProvider';
import BannerLogo from 'components/common/Page/BannerLogo';
import { drawerContent } from 'components/common/Page/styles';
import UnauthenticatedPage from 'components/common/Page/UnauthenticatedPage';
import NavStepper from './NavStepper';
import { ROUTES } from 'app/constants';

const useStyles = makeStyles(theme => ({
    list: {
        width: 300,
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
    }
}));


export function PersistentDrawerLeft(props) {
    if (props.hideNav) {
        return <UnauthenticatedPage>{props.children}</UnauthenticatedPage>
    }
    const appThemeContext = useContext(AppTheme);
    const classes = useStyles();
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
                    <Box className={classes.accountDetails} >
                        <Box display="flex">
                            <Box className={classes.initialsContainer}>{initials}</Box>
                            <Box display="flex" flexDirection="column">
                                <Box>
                                    <Bold fontSize={18}>{props.name}</Bold>
                                </Box>
                                <Box>
                                    {props.email}
                                </Box>
                            </Box>
                        </Box>
                        <Box>
                            <Link to={ROUTES.ACCOUNT}>Account Details</Link>
                        </Box>
                    </Box>
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
