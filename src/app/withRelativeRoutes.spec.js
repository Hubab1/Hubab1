import React from 'react';
import { mount } from 'enzyme';

import withRelativeRoutes from './withRelativeRoutes';

jest.mock('react-redux', () => {
    return {
        // unwraps connected component
        connect: ()=>(C)=>C,
    };
});


let defaultProps;
beforeEach(() => {
    defaultProps = {
        currentRouteReceived: jest.fn(),
        history: {
            push: jest.fn(),
        }
    }
});

const WrappedComponent = ()=><div>Wrapped Component Text</div>;

describe('application completed', function () {
    it('prevents you from acccessing anything but the initialPage', function() {
        const Component = withRelativeRoutes(WrappedComponent, '/lease-terms')
        let wrapper = mount(
            <Component
                {...defaultProps}
                selectApplicantStillFinishingApplication={false}
                initialPage="/application-complete"
            />
        );
        expect(defaultProps.history.push).toHaveBeenCalledWith('/application-complete');
        expect(wrapper.instance().blockRender).toBe(true);
        expect(wrapper.html()).toBe(null);
    })
    it('allows accessing initialPage', function() {
        const Component = withRelativeRoutes(WrappedComponent, '/application-complete')
        let wrapper = mount(
            <Component
                {...defaultProps}
                selectApplicantStillFinishingApplication={false}
                initialPage="/application-complete"
            />
        );
        expect(defaultProps.history.push).not.toHaveBeenCalled();
        expect(defaultProps.currentRouteReceived).toHaveBeenCalledWith('/application-complete');
        expect(wrapper.text()).toEqual('Wrapped Component Text');
    })
});
describe('application not completed', function () {
    it('doesnt prevent you from acccessing anything but the initialPage', function() {
        const Component = withRelativeRoutes(WrappedComponent, '/lease-terms')
        let wrapper = mount(
            <Component
                {...defaultProps}
                selectApplicantStillFinishingApplication={true}
                initialPage="/application-complete"
            />
        );
        expect(defaultProps.history.push).not.toHaveBeenCalled();
        expect(defaultProps.currentRouteReceived).toHaveBeenCalledWith('/lease-terms');
        expect(wrapper.text()).toEqual('Wrapped Component Text');
    })
});
