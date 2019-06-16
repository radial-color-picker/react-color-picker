import React from 'react';
import ReactDOM from 'react-dom';
import { mount } from 'enzyme';

import ColorPicker from './ColorPicker';

// canvas support in JSDom is weak and throws an error so the dependency is mocked
import fillColorWheel from '@radial-color-picker/color-wheel';
jest.mock('@radial-color-picker/color-wheel');

describe('Init', () => {
    beforeEach(() => {
        fillColorWheel.mockClear();
    });

    // jsdom doesn't support layouting so `getComputedStyle(palette).backgroundImage`
    // would never include conic-gradient
    it('setups a fallback to canvas when `conic-gradient` CSS is not supported', () => {
        const wrapper = mount(<ColorPicker />);

        expect(fillColorWheel).toHaveBeenCalledTimes(1);
    });
});
