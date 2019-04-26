import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import { Bold, PageHeader, agentBlock, agentTitle, BackgroundImage } from 'assets/emotion/styles';
import history from 'history.js';

export class WelcomePage extends Component {

    render() {
        return (
            <Fragment>
                <div className={agentBlock}>
                    <BackgroundImage url={this.props.leaseSettings.background_image} />
                    <div>Jane Morgan</div>
                    <span aria-label="agent-avatar" role="img" style={{fontSize: 60, lineHeight: '80px'}}>👩</span>
                    <div className={agentTitle}>
                        <div>Leasing Agent</div>
                        <div>Sky Residencies</div>
                    </div>
                </div>
                <div style={{textAlign: 'left', padding: 25}}>
                    <PageHeader>Hi Sam,</PageHeader>
                    <div>Your magically simple rental application starts here.</div>
                    <br/>
                    <div>Your new home awaits at <Bold>555 Waverly 605 W 11th St, New York, Unit 3F</Bold> awaits.</div>
                    <br/>
                    <br/>
                    <ActionButton
                        onClick={() => history.push('/login')}>Click here</ActionButton>
                </div>
            </Fragment>

        );
    }
}

const mapStateToProps = state => ({
    leaseSettings: state.leaseSettings,
});

export default connect(mapStateToProps, null)(WelcomePage);
