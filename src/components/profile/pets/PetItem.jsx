import React, { Fragment } from 'react';
import Cancel from '@material-ui/icons/Cancel';
import { css } from 'emotion';
import { getIn, Field } from 'formik';

import { ErrorDetail } from 'assets/styles';
import FormTextInput from 'components/common/FormTextInput/FormTextInput';
import PetTypeSelect from './PetTypeSelect';

const cancelButton = css`
    color: #828796;
    cursor: pointer;
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
    
    renderDogFields (petOption, handleChange, handleBlur, index) {
        return (
            <Fragment>
                <FormTextInput
                    label="Dog Name"
                    name={`petOptions[${index}].name`}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    value={petOption.name}
                />
                <FormTextInput
                    label="Breed"
                    name={`petOptions[${index}].breed`}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    value={petOption.breed}
                />
                <FormTextInput
                    label="Weight"
                    name={`petOptions[${index}].weight`}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    value={petOption.weight}
                    endAdornment={<span style={{color: '#828796'}}>Lb</span>}
                />
            </Fragment>
        );
    }

    renderCatFields (petOption, handleChange, handleBlur, index) {
        return (
            <Fragment>
                <FormTextInput
                    label="Cat Name"
                    name={`petOptions[${index}].name`}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    value={petOption.name}
                />
                <FormTextInput
                    label="Weight"
                    name={`petOptions[${index}].weight`}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    value={petOption.weight}
                    endAdornment={<span style={{color: '#828796'}}>Lb</span>}
                />
            </Fragment>
        );
    }

    renderOtherFields (petOption, handleChange, handleBlur, index) {
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
            </Fragment>
        );
    }
    
    onChangePetType = (value) => {
        const { petOption, arrayHelpers, index } = this.props;
        this.cache[petOption.pet_type] = Object.assign({}, petOption);
        arrayHelpers.replace(index, Object.assign(Object.assign({pet_type: value, key: petOption.key}, this.cache[value])));
    }
    render () {
        const { index, arrayHelpers, petOption, handleChange, handleBlur } = this.props;
        return (
            <div>
                <PetTypeSelect
                    topAdornment={index > 0 && <Cancel role="button" style={{fontSize: 17}} className={cancelButton} onClick={() => arrayHelpers.remove(index)}/>}
                    onChange={this.onChangePetType}
                    value={petOption.pet_type}
                />
                <ErrorMessage name={`petOptions[${index}].petType`} />
                {petOption.pet_type === 'Dog' && this.renderDogFields(petOption, handleChange, handleBlur, index)}
                <ErrorMessage name={`petOptions[${index}].name`} />
                {petOption.pet_type === 'Cat' && this.renderCatFields(petOption, handleChange, handleBlur, index)}
                {petOption.pet_type === 'Other' && this.renderOtherFields(petOption, handleChange, handleBlur, index)}
            </div>
        )
    }
}