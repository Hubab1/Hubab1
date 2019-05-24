import React from 'react';
import styled from '@emotion/styled';
import Icon from '@material-ui/core/Icon';


const FormErrorContainer = styled.div`
    padding: 20px 10px 0 10px;
    border-radius: 3px;
    display: flex;
    justify-content: center;
    font-size: 14px;
    line-height: 16px;
`

const IconDiv = styled.div`
    background-color: #FB6D68;
    width: 10%;
    padding: 7px 5px 5px 5px;
    text-align: center;
    border-radius: 3px;
`

const MessageDiv = styled.div`
    background-color: #FEF0EF;
    display: inline-block;
    padding: 10px;
    border-radius: 3px;
`

export default function GenericFormError (props) {
    return (
        <FormErrorContainer>
            <IconDiv>
                <Icon style={{color:'white'}}>error</Icon>
            </IconDiv>
            <MessageDiv>
                {props.errors}
            </MessageDiv>
        </FormErrorContainer>
    );
}