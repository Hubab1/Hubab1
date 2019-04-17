import React from 'react';
import Input from '@material-ui/core/Input';

export default class TalkAboutOptions extends React.Component {
    render () {
        return (
            <div>
                <div>
                    {['option1', 'option2', 'option3'].map((el, i) => (
                        <li key={i}>{el}</li>
                    ))}
                </div>
                <div>
                    <Input></Input>
                </div>
                <div>
                    <Input></Input>
                </div>
            </div>
        );
    }
}