import React from 'react';
import PropTypes from 'prop-types';

import Notification from 'components/common/GenericFormMessage';
import { H1, SpacedH3 } from 'assets/styles';

export function Page({ children, title, subTitle, notification, image: Image, className }) {
    return (
        <div className={className}>
            {title && <H1>{title}</H1>}
            {subTitle && <SpacedH3>{subTitle}</SpacedH3>}
            {notification && <Notification type={notification.type} messages={notification.messages} />}
            {Image && <Image />}
            {children}
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
    image: PropTypes.node,
    children: PropTypes.node.isRequired,
};

export default Page;
