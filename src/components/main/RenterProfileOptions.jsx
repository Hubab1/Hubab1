import React from 'react';

import Page from './Page';
import MultiSelectChoice from './MultiSelectChoice';
import MultiSelect from './MultiSelectChoice/MultiSelect';

export default class RentalProfileOptions extends React.Component {
    render () {
        return (
            <Page>
                <div>
                    <MultiSelect>
                        <MultiSelectChoice 
                            prefix="👪"
                            selected
                            name="other_adults"
                            label="Other adults will live here"
                        />
                        <div style={{height: 8}}></div>
                        <MultiSelectChoice
                            prefix="🐶"
                            name="pets"
                            label="Pets will live here"
                        />
                        <div style={{height: 8}}></div>
                        <MultiSelectChoice
                            prefix="💰"
                            name="guarantor"
                            label="I'll need a guarantor"
                        />
                        <div style={{height: 8}}></div>
                        <MultiSelectChoice
                            prefix="🚗"
                            name="paring"
                            label="I'd like a parking space"
                        />
                        <div style={{height: 8}}></div>
                        <MultiSelectChoice
                            prefix="🛍️"
                            name="storage"
                            label="I'll need extra storage"
                        />
                        <div style={{height: 8}}></div>
                    </MultiSelect>
                </div>
            </Page>
        );
    }
}