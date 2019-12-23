import React, { Fragment } from 'react';
import { css } from 'emotion';
import { getIn, Field } from 'formik';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';

import { ErrorDetail } from 'assets/styles';
import { viewPetPolicy } from './styles';

import FormTextInput from 'components/common/FormTextInput/FormTextInput';
import PetTypeSelect from './PetTypeSelect';

const root = css`
    flex-direction: row !important;
`

const ErrorMessage = ({ name }) => (
    <Field
        name={name}
        render={({ form }) => {
            const error = getIn(form.errors, name);
            const touch = getIn(form.touched, name);
            const submitCount = form.submitCount;
            return <ErrorDetail>{(touch && error) || submitCount ? error : null}</ErrorDetail>
        }}
    />
);

export default class PetItem extends React.Component {
    cache = {}

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
                    value={String(petOption.service_animal)}
                >
                    <FormControlLabel value="false" control={<Radio />} label="No" />
                    <FormControlLabel value="true" control={<Radio />} label="Yes" />
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
                <span role="button" onClick={toggleViewPetRestrictions} className={viewPetPolicy}>View pet restrictions</span>
                <ErrorMessage name={`petOptions[${index}].description`} />
                {this.renderServiceAnimalField()}
            </Fragment>
        );
    }
    
    onChangePetType = (value) => {
        const { petOption, arrayHelpers, index } = this.props;
        this.cache[petOption.pet_type] = Object.assign({}, petOption);
        arrayHelpers.replace(index, Object.assign(Object.assign({pet_type: value, key: petOption.key, service_animal: 'false'}, this.cache[value])));
    }
    render () {
        const { index, arrayHelpers, petOption, petTypeOptions, totalPets } = this.props;
        return (
            <div>
                <PetTypeSelect
                    showCancelButton={totalPets > 1 || index > 0}
                    onCancel={() => arrayHelpers.remove(index)}
                    onChange={this.onChangePetType}
                    value={petOption.pet_type}
                    petTypeOptions={petTypeOptions}
                />
                <ErrorMessage name={`petOptions[${index}].pet_type`} />
                {petOption.pet_type === 'Dog' && this.renderDogFields()}
                {petOption.pet_type === 'Cat' && this.renderCatFields()}
                {petOption.pet_type === 'Other' && this.renderOtherFields()}
            </div>
        )
    }
}
