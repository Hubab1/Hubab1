import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles, Typography } from '@material-ui/core';

import Notification from 'components/common/GenericFormMessage';

const useStyles = makeStyles((theme) => ({
    header: {
        display: 'flex',
        flexFlow: 'column',
        alignItems: 'center',
    },
    title: {
        marginBottom: theme.spacing(3),
        fontSize: 23,
        fontWeight: 600,
        lineHeight: 1,
        textAlign: 'center',
        color: '#000',
    },
    subTitle: {
        margin: theme.spacing(0, 2, 3, 2),
        padding: 0,
        fontSize: 18,
        fontWeight: 400,
        lineHeight: 1,
        textAlign: 'center',
        color: '#454b57',
    },
    notification: {
        marginBottom: theme.spacing(3),
    },
    image: {
        marginBottom: theme.spacing(3),
        width: 100,
        height: 100,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
    },
    content: {},
}));

export function Page({
    className,
    title,
    subTitle,
    notification = {
        messages: undefined,
        type: undefined,
    },
    image = {
        src: undefined,
        className: undefined,
    },
    loading = false,
    children,
}) {
    const classes = useStyles();

    return (
        <div className={className}>
            <div className={classes.header}>
                {title && (
                    <Typography variant="h1" className={classes.title}>
                        {title}
                    </Typography>
                )}
                {subTitle && (
                    <Typography variant="h2" className={classes.subTitle}>
                        {subTitle}
                    </Typography>
                )}
                {notification?.type && notification?.messages && (
                    <Notification type={notification.type} messages={notification.messages} />
                )}
                {image?.src && (
                    <div
                        className={clsx(classes.image, image.className)}
                        style={{
                            backgroundImage: `url(${image.src})`,
                        }}
                    />
                )}
            </div>
            {!loading && <div className={classes.content}>{children}</div>}
        </div>
    );
}

Page.propTypes = {
    className: PropTypes.string,
    title: PropTypes.string,
    subTitle: PropTypes.string,
    notification: PropTypes.shape({
        messages: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
        type: PropTypes.oneOf(['sucess', 'error']).isRequired,
    }),
    image: PropTypes.shape({
        src: PropTypes.string.isRequired,
        className: PropTypes.string,
    }),
    loading: PropTypes.bool,
    children: PropTypes.node.isRequired,
};

export default Page;
