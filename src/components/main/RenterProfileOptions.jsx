import React from 'react';
import { Formik } from 'formik';

import Page from './Page';
import MultiSelectChoice from './MultiSelectChoice';
import MultiSelect from './MultiSelectChoice/MultiSelect';

export default class RentalProfileOptions extends React.Component {
    render () {
        return (
            <Page>
                <div>
                <Formik
                    initialValues={{ options: ['storage', 'pets'] }}
                    validate={values => {
                        let errors = {};
                        return errors;
                    }}
                    onSubmit={this.onSubmit}
                >
                {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    setValues,
                    handleSubmit,
                    isSubmitting,
                    /* and other goodies */
                }) => (
                    <MultiSelect onChange={handleChange} setValues={setValues} value={values.options}>
                        <MultiSelectChoice
                            prefix="👪"
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
                )
                }</Formik>
                </div>
            </Page>
        );
    }
}