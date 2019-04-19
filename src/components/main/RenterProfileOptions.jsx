import React from 'react';

export default class RentalProfileOptions extends React.Component {
    render () {
        return (
            <div>
                <div>
                    {['option1', 'option2', 'option3'].map((el, i) => (
                        <li key={i}>{el}</li>
                    ))}
                </div>
            </div>
        );
    }
}