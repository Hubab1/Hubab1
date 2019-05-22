import React, { Fragment } from 'react';
import { Formik } from 'formik';
import ActionButton from 'components/common/ActionButton/ActionButton';

import { ROUTES } from 'app/constants';
import { MultiSelect, MultiSelectChoice } from './MultiSelect';
import { H1, P } from 'assets/styles';

export default class RentalProfileOptions extends React.Component {
    onSubmit = (values, { setSubmitting }) => {
        this.props.history.push(ROUTES.INVITE_ROOMMATES);
        setSubmitting(false);
    }

    render () {
        return (
            <Fragment>
                <H1>Let's talk about your new place</H1>
                <P>Select all that apply</P>
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
                        setFieldValue,
                        isSubmitting,
                        handleSubmit,
                    }) => (
                        <form onSubmit={handleSubmit} autoComplete="off">
                            <MultiSelect
                                onChange={(value) => setFieldValue('options', value)}
                                value={values.options}
                            >
                                <MultiSelectChoice
                                    prefix="👪"
                                    name="other_adults"
                                    label="Other adults will live here"
                                />
                                <MultiSelectChoice
                                    prefix="🐶"
                                    name="pets"
                                    label="Pets will live here"
                                />
                                <MultiSelectChoice
                                    prefix="💰"
                                    name="guarantor"
                                    label="I'll need a guarantor"
                                />
                                <MultiSelectChoice
                                    prefix="🚗"
                                    name="parking"
                                    label="I'd like a parking space"
                                />
                                <MultiSelectChoice
                                    prefix="🛍️"
                                    name="storage"
                                    label="I'll need extra storage"
                                />
                            </MultiSelect>
                            <ActionButton disabled={isSubmitting} marginTop="31px" marginBottom="10px">Continue</ActionButton>
                        </form>
                    )}
                </Formik>
            </Fragment>
        );
    }
}
