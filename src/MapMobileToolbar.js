import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import {makeStyles } from '@material-ui/core/styles';

import PhotoTypeSelector from './photoTypeSelector';
import TimeSlider from './TimeSlider';
import ExpandingSearchBar from './ExpandingSearchBar';
import SettingsPanel from './SettingsPanel';

const useStyles = makeStyles(theme => ({
  root: {
  },
  appbar:{
    backgroundColor: '#303F9F',
    position: 'static'
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between"
  }
}));

export default function ButtonAppBar() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar className={classes.appbar}>
        <Toolbar className={classes.toolbar}>
          <SettingsPanel/>
        </Toolbar>
      </AppBar>
    </div>
  );
}