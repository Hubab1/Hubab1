import React, { Fragment } from 'react';
import { Formik } from 'formik';
import Button from '@material-ui/core/Button';

import { MultiSelect, MultiSelectChoice } from 'components/MultiSelect';
import { PageHeader, Subtitle } from 'assets/emotion/styles';

export default class RentalProfileOptions extends React.Component {
    onSubmit = () => {
        // todo
    }
    
    render () {
        return (
            <div>
                <Formik
                    initialValues={{ options: [] }}
                    validate={values => {
                        let errors = {};
                        // todo
                        return errors;
                    }}
                    onSubmit={this.onSubmit}
                >
                {({
                    values,
                    setFieldValue
                }) => (
                    <Fragment>
                        <PageHeader>Let's talk about your new place</PageHeader>
                        <Subtitle>Select all that apply</Subtitle>
                        <div style={{height: 12}}></div>
                        <MultiSelect
                            onChange={(value) => setFieldValue('options', value)}
                            value={values.options}
                        >
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
                                name="parking"
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
                    </Fragment>
                )}</Formik>
                <Button onClick={this.onSubmit} variant="contained" color="primary" type="submit" fullWidth>
                    Continue
                </Button>
            </div>
        );
    }
}