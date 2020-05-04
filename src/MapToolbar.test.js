//npm test -t MapToolbar

import ButtonAppBar from './MapToolbar';
//import { Typography } from 'material-ui';
import React from 'react';
import { createMount, createShallow } from '@material-ui/core/test-utils';
import {shallow, mount, render} from 'enzyme'
import { AppBar, ExpansionPanel, ToolBar, ExpansionPanelSummary } from '@material-ui/core';
//import sinon from 'sinon';


it('should render a toolbar correctly',  () => {
    const mount = createMount(<ButtonAppBar/>);
    const container = mount(<AppBar/>);
    
    expect(container.find('ToolBar')).toHaveLength(0);
});

it('should render the expansion panel correctly', () => {
    const shallow = createShallow(<ButtonAppBar/>);
    const wrapper = shallow(<ExpansionPanelSummary/>);
    
    expect(wrapper.find('Select')).toHaveLength(0);
});


// it('', () => {

// });




// it('expands on click',  () => {
//     const shallow = createShallow(<ButtonAppBar/>);
//     const wrapper = shallow(<ExpansionPanel/>);
    
//     const button = wrapper.findWhere(node => node.is(Button) && n.prop('children') === 'ExpansionPanelSummary')
// });

// it('allows you to search for something on the toolbar', () => {
//     const {changeHandler} = render(<ButtonAppBar/>);
//     const satSearch = changeHandler('satSearch');

//     expect(satSearch).toHaveValue('');
// });