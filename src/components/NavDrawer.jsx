import React, { useContext } from 'react';
import { connect } from 'react-redux';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ProgressBar from 'components/common/Page/ProgressBar';

import { AppTheme } from 'contexts/AppContextProvider';
import BannerLogo from 'components/common/Page/BannerLogo';
import { subPage } from 'components/common/Page/styles';
import { NAV_ROUTES } from 'app/constants';
import UnauthenticatedPage from 'components/common/Page/UnauthenticatedPage';
import { actions } from 'reducers/store';
import { ROUTES } from 'app/constants';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    darkThemeAppbar: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText
    },
    liteThemeAppbar: {
        backgroundColor: '#ffffff',
        color: '#000000'
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    padRight: {
        width: 48
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: '0 8px',
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -drawerWidth,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    },
}));

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

    function logout () {
        localStorage.clear();
        props.logout();
        props.history.push(ROUTES.LOGIN)
    }

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar
                color="primary"
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}
                classes={{colorPrimary: appThemeContext.dark_mode ? classes.darkThemeAppbar : classes.liteThemeAppbar}}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="Open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        className={clsx(classes.menuButton, open && classes.hide)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <BannerLogo />
                    <div className={clsx(classes.padRight, open && classes.hide)}></div>
                </Toolbar>
                <ProgressBar percent={33}/>
            </AppBar>
            <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="left"
                open={open}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <div className={classes.drawerHeader}>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </div>
                <Divider />
                <List>
                    {NAV_ROUTES.map((route) => (
                        <ListItem button key={route.value} onClick={() => props.history.push(route.value)}>
                            <ListItemText primary={route.name} />
                        </ListItem>
                    ))}
                </List>
                <Divider />
                <ListItem button onClick={logout}>
                    <ListItemText primary="Logout" />
                </ListItem>
            </Drawer>
            <main
                className={clsx(classes.content, {
                    [classes.contentShift]: open,
                })}
            >
                <div className={classes.drawerHeader} />
                <div className={subPage}>
                    {props.children}
                </div>
            </main>
        </div>
    );
}

const mapDispatchToProps = {
    logout: actions.logout
};

export default connect(null, mapDispatchToProps)(withRouter(PersistentDrawerLeft));
