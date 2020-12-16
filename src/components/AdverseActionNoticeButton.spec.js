import React from 'react';
import { shallow } from 'enzyme';
import { AdverseActionNoticeButton } from './AdverseActionNoticeButton';
import API from 'app/api';
import { LinkButton } from 'assets/styles';

describe('AdverseActionNoticeButton', () => {
    let mockedWindow;
    beforeEach(() => {
        mockedWindow = {
            location: {
                replace: jest.fn(),
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

    it('opens document on click', async () => {
        API.fetchAANDocument = jest.fn().mockReturnValue('pdf-data');

        const wrapper = shallow(<AdverseActionNoticeButton />);

        expect(wrapper.find(LinkButton).text()).toBe('Learn why');
        await wrapper.find(LinkButton).simulate('click');
        wrapper.update();

        expect(global.open).toBeCalled();
        expect(API.fetchAANDocument).toBeCalled();
        expect(global.URL.createObjectURL).toBeCalled();
        expect(mockedWindow.location.replace).toBeCalledWith('data:application/pdf;base64,SOMETHING');
    });

    it('handles error', async () => {
        API.fetchAANDocument = jest.fn().mockReturnValue(Promise.reject());

        const wrapper = shallow(<AdverseActionNoticeButton />);

        expect(wrapper.find(LinkButton).text()).toBe('Learn why');
        await wrapper.find(LinkButton).simulate('click');
        wrapper.update();

        expect(API.fetchAANDocument).toBeCalled();
        expect(wrapper.find(LinkButton).text()).toBe('An error occurred. Please try again.');
    });
});
