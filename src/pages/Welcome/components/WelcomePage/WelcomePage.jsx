import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { makeStyles, useTheme } from '@material-ui/core';
import clsx from 'clsx';

import { ROUTES } from 'constants/constants';
import ActionButton from 'components//ActionButton/ActionButton';
import { H1, H2, P, link } from 'assets/styles';
import funnelImage from 'assets/images/PoweredByFunnel.png';
import homeImage from 'assets/images/home-image.png';

const useStyles = makeStyles((theme) => {
    return {
        background: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            zIndex: -5,
            opacity: theme.darkMode ? 1 : 0.3,
            backgroundImage: `url(${theme.assets.background})`,
        },
        backgroundOverlay: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: -4,
            opacity: 0.6,
            backgroundColor: theme.darkMode ? theme.palette.primary.main : 'none',
        },
        root: {
            position: 'absolute',
            display: 'flex',
            flexFlow: 'column',
            alignContent: 'space-around',
            color: 'white',
            height: '100%',
            width: '100%',
        },
        banner: {
            margin: '20px auto 0 auto',
            '& img': {
                maxWidth: '120px',
                maxHeight: '50px',
            },
        },
        content: {
            position: 'relative',
            margin: 'auto',
            paddingBottom: '50px',
            width: '82%',
            maxWidth: '500px',
            textAlign: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
        },
        homeImageContainer: {
            position: 'relative',
            top: '-35px',
            width: '70px',
            height: '35px',
            borderTopLeftRadius: '70px',
            borderTopRightRadius: '70px',
            background: 'inherit',
            textAlign: 'center',
            margin: '0 auto',

            '& img': {
                position: 'relative',
                top: '9px',
                width: '27px',
                height: '27px',
                objectFit: 'contain',
            },
        },
        footer: {
            display: 'flex',
            flexFlow: 'column',
            alignItems: 'center',
            margin: '2% 10%',
            height: '15%',
        },
        ctaButton: {
            backgroundColor: theme.darkMode ? theme.palette.common.white : theme.palette.primary.main,
        },
        link: {
            color: theme.darkMode ? theme.palette.common.white : theme.palette.common.black,
        },
    };
});

export function WelcomePage(props) {
    const theme = useTheme();
    const classes = useStyles();
    const { configuration } = props;
    const { community, unit } = configuration;
    const { building_name, city, state, postal_code, normalized_street_address } = community;

    const firstName = useMemo(() => {
        const { person, invitee } = configuration;
        if (person) {
            return person.first_name;
        } else if (invitee && invitee.first_name) {
            return invitee.first_name;
        } else {
            return null;
        }
    }, [configuration]);

    const cityStateZip = `${city}, ${state} ${postal_code}`;
    const helloContent = firstName ? `Hello ${firstName},` : 'Hi There,';

    return (
        <>
            <div className={classes.background} />
            <div className={classes.backgroundOverlay} />
            <div className={classes.root}>
                <div className={classes.banner}>
                    <img className={classes.logo} src={theme?.asserts?.logo} alt="company logo" />
                </div>
                <div data-testid="content" className={classes.content}>
                    <div className={classes.homeImageContainer}>
                        <img src={homeImage} alt="home-icon" />
                    </div>
                    <H2>{helloContent}</H2>
                    <P>Your new home awaits at</P>
                    {building_name && <H1 className="welcome__building-header">{building_name}</H1>}
                    {building_name ? (
                        <P>{normalized_street_address}</P>
                    ) : (
                        <H1 className="welcome__building-header">{normalized_street_address}</H1>
                    )}
                    {cityStateZip && <P>{cityStateZip}</P>}
                    {unit && unit.unit_number && <P>{`Unit ${unit.unit_number}`}</P>}
                </div>
                <div className={classes.footer}>
                    <Link to={{ pathname: ROUTES.SIGNUP }} style={{ textDecoration: 'none' }} className="cta-container">
                        <ActionButton data-testid="cta-button" buttonClassName={classes.ctaButton}>
                            Start Application
                        </ActionButton>
                    </Link>
                    <Link to={ROUTES.LOGIN} className={clsx(link, classes.link)}>
                        I already started an application
                    </Link>
                    <img src={funnelImage} width="150" alt="funnel logo" />
                </div>
            </div>
        </>
    );
}

WelcomePage.propTypes = {
    configuration: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    configuration: state.configuration,
});

export default connect(mapStateToProps, null)(WelcomePage);
