import React from 'react';
import { shallow } from 'enzyme';

import App from 'App';


it('starts on the login page', function () {
    expect(shallow(<App/>).html()).toContain('Your magically simple rental application');
});