import React from 'react';
import renderer from 'react-test-renderer';

import { WelcomePage } from 'components/main/WelcomePage';


it('matches snapshot for created event', function(){
    expect(
        renderer.create(<WelcomePage />)
    ).toMatchSnapshot();
});
