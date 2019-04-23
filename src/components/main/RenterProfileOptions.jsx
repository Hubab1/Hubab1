import React from 'react';
import Button from '@material-ui/core/Button';
import Page from './Page';
import MultiSelectChoice from './MultiSelectChoice';

export default class RentalProfileOptions extends React.Component {
    render () {
        return (
            <Page>
                <div>
                    <MultiSelectChoice 
                        prefix="👪"
                        label="Other adults will live here"
                    />
                    <div style={{height: 8}}></div>
                    <MultiSelectChoice
                        prefix="🐶"
                        label="Pets will live here"
                    />
                    <div style={{height: 8}}></div>
                    <MultiSelectChoice
                        prefix="💰"
                        label="I'll need a guarantor"
                    />
                    <div style={{height: 8}}></div>
                    <MultiSelectChoice
                        prefix="🚗"
                        label="I'd like a parking space"
                    />
                    <div style={{height: 8}}></div>
                    <MultiSelectChoice
                        prefix="🛍️"
                        label="I'll need extra storage"
                    />
                    <div style={{height: 8}}></div>
                </div>
            </Page>
        );
    }
}