import React, {Fragment} from 'react';
import { css } from 'emotion';
import Error from '@material-ui/icons/Error'

const errorContainer = css`
    padding: 20px 10px 0 10px;
    border-radius: 3px;
    display: flex;
    justify-content: center;
    font-size: 14px;
    line-height: 16px;
`

const iconDiv = css`
    background-color: #FB6D68;
    padding: 5px;
    border-radius: 3px 0 0 3px;
    display: flex;
    justify-content: center;
    align-items: center;
`

const messageDiv = css`
    background-color: #FEF0EF;
    display: inline-block;
    padding: 10px;
    border-radius: 3px;
    display: flex;
    justify-content: center;
    align-items: center;
`

export default function GenericFormError (props) {
    return (
        <div className={errorContainer}>
            <div className={iconDiv}>
                <Error style={{color:'white'}}></Error>
            </div>
            <div className={messageDiv}>
                {props.errors.map((error, index) => {
                    return (
                        <Fragment key={index}>
                            {error} <br/>
                        </Fragment>
                    )
                })}
            </div>
        </div>
    );
}