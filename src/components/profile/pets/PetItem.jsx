import React, { Fragment } from 'react';
import { css } from 'emotion';
import { getIn, Field } from 'formik';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import PropTypes from 'prop-types';
import { ErrorDetail } from 'assets/styles';
import { viewPetPolicy } from './styles';

import FormTextInput from 'components/common/FormTextInput/FormTextInput';
import PetTypeSelect from './PetTypeSelect';

import { RENTAL_OPTIONS_PETS_DOGS, RENTAL_OPTIONS_PETS_CATS, RENTAL_OPTIONS_PETS_OTHER } from 'app/constants';

const root = css`
    flex-direction: row !important;
`;

const ErrorMessage = ({ name }) => (
    <Field
        name={name}
        render={({ form }) => {
            const error = getIn(form.errors, name);
            const touch = getIn(form.touched, name);
            const submitCount = form.submitCount;
            return <ErrorDetail>{(touch && error) || submitCount ? error : null}</ErrorDetail>;
        }}
    />
);

ErrorMessage.propTypes = {
    name: PropTypes.string,
};

export default class PetItem extends React.Component {
    cache = {};

    renderServiceAnimalField () {
        const { petOption, handleChange, index } = this.props;
        return (
            <FormControl component="fieldset">
                <FormHelperText id="service-animal">Is this a service animal?</FormHelperText>
                <RadioGroup
                    classes={{root}}
                    aria-label="service-animal"
                    name={`petOptions[${index}].service_animal`}
                    onChange={handleChange}
                    value={JSON.parse(petOption.service_animal)}
                >
                    <FormControlLabel value={false} control={<Radio />} label="No" />
                    <FormControlLabel value={true} control={<Radio />} label="Yes" />
                </RadioGroup>
            </FormControl>
        );
    }

    renderDogFields () {
        const { petOption, handleChange, handleBlur, index, toggleViewPetRestrictions } = this.props;
        return (
            <Fragment>
                <FormTextInput
                    label="Dog Name"
                    name={`petOptions[${index}].name`}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    value={petOption.name}
                />
                <ErrorMessage name={`petOptions[${index}].name`} />
                <FormTextInput
                    label="Breed"
                    name={`petOptions[${index}].breed`}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    value={petOption.breed}
                />
                <span role="button" onClick={toggleViewPetRestrictions} className={viewPetPolicy}>View pet restrictions</span>
                <ErrorMessage name={`petOptions[${index}].breed`} />
                <FormTextInput
                    label="Weight"
                    name={`petOptions[${index}].weight`}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    value={petOption.weight}
                    endAdornment={<span style={{color: '#828796'}}>Lb</span>}
                />
                <ErrorMessage name={`petOptions[${index}].weight`} />
                {this.renderServiceAnimalField()}
            </Fragment>
        );
    }

    renderCatFields () {
        const { petOption, handleChange, handleBlur, index } = this.props;
        return (
            <Fragment>
                <FormTextInput
                    label="Cat Name"
                    name={`petOptions[${index}].name`}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    value={petOption.name}
                />
                <ErrorMessage name={`petOptions[${index}].name`} />
                <FormTextInput
                    label="Weight"
                    name={`petOptions[${index}].weight`}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    value={petOption.weight}
                    endAdornment={<span style={{color: '#828796'}}>Lb</span>}
                />
                <ErrorMessage name={`petOptions[${index}].weight`} />
                {this.renderServiceAnimalField()}
            </Fragment>
        );
    }

    renderOtherFields () {
        const { petOption, handleChange, handleBlur, index, toggleViewPetRestrictions } = this.props;
        return (
            <Fragment>
                <FormTextInput
                    label="Description"
                    name={`petOptions[${index}].description`}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    value={petOption.description}
                    helperText="Please share a bit about your pet"
                />
                <span role="button" onClick={toggleViewPetRestrictions} className={viewPetPolicy}>
                    View pet restrictions
                </span>
                <ErrorMessage name={`petOptions[${index}].description`} />
                {this.renderServiceAnimalField()}
            </Fragment>
        );
    }

    onChangePetType = (value) => {
        const { petOption, arrayHelpers, index } = this.props;
        this.cache[petOption.pet_type] = { ...petOption };
        arrayHelpers.replace(
            index,
            { pet_type: value, key: petOption.key, service_animal: 'false', ...this.cache[value] });
    };

    render () {
        const { index, arrayHelpers, petOption, petTypeOptions, handleDelete } = this.props;
        const hideCancelButton = Boolean(index === 0 && petOption.key);

        return (
            <div>
                <PetTypeSelect
                    hideCancelButton={hideCancelButton}
                    onDelete={() => handleDelete(arrayHelpers, index)}
                    onChange={this.onChangePetType}
                    value={petOption.pet_type}
                    petTypeOptions={petTypeOptions}
                />
                <ErrorMessage name={`petOptions[${index}].pet_type`} />
                {petOption.pet_type === RENTAL_OPTIONS_PETS_DOGS && this.renderDogFields()}
                {petOption.pet_type === RENTAL_OPTIONS_PETS_CATS && this.renderCatFields()}
                {petOption.pet_type === RENTAL_OPTIONS_PETS_OTHER && this.renderOtherFields()}
            </div>
        );
    }
}

PetItem.propTypes = {
    petOption: PropTypes.object,
    handleChange: PropTypes.func,
    index: PropTypes.number,
    handleBlur: PropTypes.func,
    toggleViewPetRestrictions: PropTypes.func,
    arrayHelpers: PropTypes.array,
    petTypeOptions: PropTypes.array,
    handleDelete: PropTypes.func,
};
