import React from 'react';
import renderer from 'react-test-renderer';

import FormTextInput from './FormTextInput';

let defaultProps;

beforeEach(() => {
    defaultProps = {
        name: 'fun_field',
        handleChange: jest.fn(),
        handleBlur: jest.fn(),
        value: 'orange',
        label: 'fruits',
        type: 'text',
    };
});

describe('FormTextInput', function () {
    describe('regular text input', function () {
        it('Matches snapshot', function () {
            expect(renderer.create(<FormTextInput {...defaultProps} />)).toMatchSnapshot();
        });
        it('can add endAdornment', function () {
            expect(
                renderer.create(<FormTextInput {...defaultProps} endAdornment={<span>Lb</span>} />)
            ).toMatchSnapshot();
        });
    });
    describe('password input', function () {
        it('Matches snapshot', function () {
            expect(renderer.create(<FormTextInput {...defaultProps} type="password" />)).toMatchSnapshot();
        });
        it('showValidationText shows validation text before submit', function () {
            expect(
                renderer.create(
                    <FormTextInput
                        {...defaultProps}
                        showValidationText
                        touched={true}
                        submitted={false}
                        error="Invalid password!"
                    />
                )
            ).toMatchSnapshot();
        });
    });
});
