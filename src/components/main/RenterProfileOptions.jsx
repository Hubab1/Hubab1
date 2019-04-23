import React, { Fragment } from 'react';
import { Formik } from 'formik';

import Page from './Page';
import MultiSelectChoice from './MultiSelectChoice';
import MultiSelect from './MultiSelectChoice/MultiSelect';
import { PageHeader, Subtitle } from 'assets/index';

export default class RentalProfileOptions extends React.Component {
    render () {
        return (
            <Page>
                <div>
                <Formik
                    initialValues={{ options: [] }}
                    validate={values => {
                        let errors = {};
                        return errors;
                    }}
                    onSubmit={this.onSubmit}
                >
                {({
                    values,
                    setFieldValue,
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
                )
                }</Formik>
                </div>
            </Page>
        );
    }
}