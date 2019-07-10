import React, { Fragment } from 'react';

import { H1, SpacedH3 } from 'assets/styles';

export default class AppStatusPage extends React.Component {
    render () {
        return (
            <Fragment>
                <H1>Hooray! You're done.</H1>
                <SpacedH3>We'll notify you about your application status, but you can always come back here to check the progress!</SpacedH3>
            </Fragment>
        )
    }
}