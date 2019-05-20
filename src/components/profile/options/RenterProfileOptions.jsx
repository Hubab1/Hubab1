import React, { Fragment } from 'react';
import { Formik } from 'formik';
import { connect } from 'react-redux';
import ActionButton from 'components/common/ActionButton/ActionButton';

import { ROUTES } from 'app/constants';
import { selectors, updateRenterProfile } from 'reducers/renter-profile';
import { MultiSelect, MultiSelectChoice } from './MultiSelect';
import { H1, Subtitle } from 'assets/styles';

export class RentalProfileOptions extends React.Component {
    onSubmit = (values, { setSubmitting }) => {
        setSubmitting(false);
        this.props.updateRenterProfile({selected_rental_options: values.options});
        const index = this.props.routes.indexOf(ROUTES.PROFILE_OPTIONS);
        this.props.history.push(this.props.routes[index+1]);
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
                        setFieldValue,
                        handleSubmit
                    }) => (
                        <Fragment>
                            <H1>Let's talk about your new place</H1>
                            <Subtitle>Select all that apply</Subtitle>
                            <div style={{height: 12}}></div>
                            <form onSubmit={handleSubmit}>
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
                                <ActionButton>Continue</ActionButton>
                            </form>
                        </Fragment>
                    )}</Formik>
            </div>
        );
    }
}


export default connect((state) => ({routes: selectors.selectOrderedRoutes(state)}), {updateRenterProfile})(RentalProfileOptions);