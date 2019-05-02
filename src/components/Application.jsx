import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { buildRoute, getInitialPage } from 'utils/routeNavigation';
import { Routes } from 'constants.js';
import ProfileContainer from 'components/profile/ProfileContainer';
import TermsPage from 'components/TermsPage';
import AppContext from 'contexts/AppContext';
export default class Application extends React.Component {
    static contextType = AppContext;
    componentDidMount () {
        const { history, match } = this.props;
        const initialPage = getInitialPage(this.context.communityId, this.props.profile);
        history.replace(initialPage);
        history.replace('terms')
    }
    
    render () {
        const { match } = this.props;
        return (
            <Switch>
                <Route path={buildRoute(match.url, Routes.PROFILE)} component={ProfileContainer} />
                <Route path={buildRoute(match.url, Routes.TOS)} component={TermsPage}/>
            </Switch>
        )
    }
}