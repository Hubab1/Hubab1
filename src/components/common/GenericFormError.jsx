import React, {Fragment} from 'react';
import { css } from 'emotion';
import Error from '@material-ui/icons/Error'

const errorContainer = css`
    padding: 20px 10px;
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
    padding: 15px 20px;
    border-radius: 3px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-grow: 1;
`

export default function GenericFormError (props) {
    return (
        <div className={errorContainer}>
            <div className={iconDiv}>
                <Error style={{color:'white', width: '18px'}}></Error>
            </div>
            <div className={messageDiv}>
                {props.errors.map((error) => {
                    return (
                        <Fragment key={error}>
                            {error} <br/>
                        </Fragment>
                    )
                })}
            </div>
        </div>
    );
}