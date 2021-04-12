import React from 'react';
import { shallow } from 'enzyme';

import API from 'api/api';
import { AdverseActionNoticeButton, ACTION_BUTTON, LINK_BUTTON } from './AdverseActionNoticeButton';
import ActionButton from 'common-components/ActionButton/ActionButton';
import { LinkButton } from 'assets/styles';

const runAllPromises = () => new Promise(setImmediate);

const defaultProps = {
    application: {
        id: 1,
    },
};

describe('AdverseActionNoticeButton', () => {
    let mockedWindow;
    beforeEach(() => {
        mockedWindow = {
            location: {
                replace: jest.fn(),
            },
            document: {
                write: jest.fn(),
            },
        };
        const PDF_DATA_URI = 'data:application/pdf;base64,SOMETHING';
        global.open = jest.fn().mockReturnValue(mockedWindow);
        global.URL = {
            createObjectURL: jest.fn().mockReturnValue(PDF_DATA_URI),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders link button', async () => {
        const wrapper = shallow(<AdverseActionNoticeButton componentType={LINK_BUTTON} {...defaultProps} />);
        expect(wrapper.find(LinkButton).length).toBe(1);
    });

    it('renders action button', async () => {
        const wrapper = shallow(<AdverseActionNoticeButton componentType={ACTION_BUTTON} {...defaultProps} />);
        expect(wrapper.find(ActionButton).length).toBe(1);
    });

    it('opens document on click', async () => {
        API.fetchAANDocument = jest.fn().mockReturnValue('pdf-data');

        const wrapper = shallow(<AdverseActionNoticeButton componentType={LINK_BUTTON} {...defaultProps} />);

        expect(wrapper.find(LinkButton).text()).toBe('Learn why');
        wrapper.find(LinkButton).simulate('click');

        await runAllPromises();

        expect(global.open).toBeCalled();
        expect(mockedWindow.document.write).toBeCalledWith('Loading');

        expect(API.fetchAANDocument).toBeCalled();
        expect(global.URL.createObjectURL).toBeCalled();
        expect(mockedWindow.location.replace).toBeCalledWith('data:application/pdf;base64,SOMETHING');
    });

    it('handles error', async () => {
        API.fetchAANDocument = jest.fn().mockReturnValue(Promise.reject());

        const wrapper = shallow(<AdverseActionNoticeButton componentType={LINK_BUTTON} {...defaultProps} />);

        expect(wrapper.find(LinkButton).text()).toBe('Learn why');
        wrapper.find(LinkButton).simulate('click');

        await runAllPromises();
        wrapper.update();

        expect(API.fetchAANDocument).toBeCalled();
        expect(wrapper.find('p').text()).toBe('An error occurred. Please try again.');
    });
});
