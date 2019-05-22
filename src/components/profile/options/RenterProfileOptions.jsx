import React, { Fragment } from 'react';
import { Formik } from 'formik';
import { connect } from 'react-redux';
import ActionButton from 'components/common/ActionButton/ActionButton';

import { ROUTES } from 'app/constants';
import { selectors, updateRenterProfile } from 'reducers/renter-profile';
import { MultiSelect, MultiSelectChoice } from './MultiSelect';
import { H1, P } from 'assets/styles';

export class RentalProfileOptions extends React.Component {
    onSubmit = (values, { setSubmitting }) => {
        setSubmitting(false);
        this.props.updateRenterProfile({selected_rental_options: values.options});
        const index = this.props.routes.indexOf(ROUTES.PROFILE_OPTIONS);
        this.props.history.push(this.props.routes[index+1]);
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
                                    name="roommates"
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


export default connect((state) => ({routes: selectors.selectOrderedRoutes(state)}), {updateRenterProfile})(RentalProfileOptions);