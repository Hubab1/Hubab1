import React from 'react';
import renderer from 'react-test-renderer';

import Checkbox from './Checkbox';

let defaultProps;

beforeEach(() => {
    defaultProps = {
        name: 'checky',
        checked: false,
        onChange: ()=>{},
        error: false,
        label: 'I authorize Nestio to obtain, on behalf of Landlord'
    }
})

it('Matches snapshot', function() {
    expect(
        renderer.create(<Checkbox {...defaultProps}/>)
    ).toMatchSnapshot();
})
