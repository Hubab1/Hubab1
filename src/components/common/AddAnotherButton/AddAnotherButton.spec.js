import React from 'react';
import renderer from 'react-test-renderer';

import AddAnotherButton from './index';

let defaultProps;

beforeEach(() => {
    defaultProps = {
        theme: {
            palette: {
                primary: {
                    main: '#FFFFFF'
                }
            }
        },
        fontSize: 15,
        thing: 'Pet'
    };
});

describe('AddAnotherButton', function() {
    it('Matches snapshot', function() {
        expect(
            renderer.create(<AddAnotherButton {...defaultProps}/>)
        ).toMatchSnapshot();
    });
});
