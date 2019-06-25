import React, { Fragment } from 'react';

import { H1, SpacedH3 } from 'assets/styles';
import ActionButton from 'components/common/ActionButton/ActionButton';

export default class TellUsMore extends React.Component {
    render () {
        return (
            <Fragment>
                <H1>Tell Us A Little More</H1>
                <SpacedH3>Now, by filling out these details below we can screen you more accurately.</SpacedH3>
                <ActionButton disabled>Continue</ActionButton>
            </Fragment>
        )
    }
}