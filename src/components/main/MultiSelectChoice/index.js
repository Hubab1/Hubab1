import React from 'react';
import Button from '@material-ui/core/Button';

import { contentContainer, label, prefix, root } from './styles';

export default class MultiSelectChoice extends React.Component {
    render () {
        return (
            <Button
                textTransform="none"
                onClick={this.onClick}
                variant="outlined"
                color="primary"
                type="submit"
                fullWidth
                classes={{
                    root,
                    label: contentContainer
                }}
            >
                    <div className={prefix}>{this.props.prefix}</div>
                    <div className={label}>{this.props.label}</div>
            </Button>
        );
    }
}