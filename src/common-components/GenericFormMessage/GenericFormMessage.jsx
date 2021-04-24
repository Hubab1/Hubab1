import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';
import castArray from 'lodash/castArray';
import ErrorIcon from '@material-ui/icons/Error';
import CheckCircle from '@material-ui/icons/CheckCircle';
import clsx from 'clsx';

const errorContainer = css`
    padding: 20px 0;
    border-radius: 3px;
    display: flex;
    justify-content: center;
    font-size: 14px;
    line-height: 16px;
`;

const darkGreen = css`
    background-color: #67c18b;
`;

const darkRed = css`
    background-color: #fb6d68;
`;
const lightRed = css`
    background-color: #fef0ef;
`;
const lightGreen = css`
    background-color: rgba(103, 193, 139, 0.1);
`;

const iconDiv = css`
    padding: 5px;
    border-radius: 3px 0 0 3px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const messageDiv = css`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-grow: 1;
    padding: 15px 20px;
    border-radius: 3px;
`;

export default function GenericFormMessage(props) {
    if (!props.messages) return null;
    const Icon = props.type === 'success' ? CheckCircle : ErrorIcon;
    return (
        <div className={errorContainer}>
            <div className={clsx([iconDiv, props.type === 'success' ? darkGreen : darkRed])}>
                <Icon style={{ color: 'white', width: '18px' }} />
            </div>
            <div className={clsx([messageDiv, props.type === 'success' ? lightGreen : lightRed])}>
                {castArray(props.messages).map((error) => {
                    return (
                        <Fragment key={error}>
                            {error} <br />
                        </Fragment>
                    );
                })}
            </div>
        </div>
    );
}

GenericFormMessage.defaultProps = {
    type: 'success',
};

GenericFormMessage.propTypes = {
    messages: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.node]),
    type: PropTypes.oneOf(['sucess', 'error']),
};
