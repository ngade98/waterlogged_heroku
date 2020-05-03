import React from 'react';
import MapPage from './MapPage';
import { createMount, createShallow } from '@material-ui/core/test-utils';
import {shallow, mount, render} from 'enzyme'
import { Redirect } from '@material-ui/core';

it('gets the location of the image accurately', () => {
    const mount = createMount(<MapPage/>);
    const wrapper = mount(<Redirect/>);

    expect(wrapper.find('Redirect').props().value).to.equal('');
});

