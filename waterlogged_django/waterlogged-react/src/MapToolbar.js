import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import {makeStyles, fade } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import FilterListIcon from '@material-ui/icons/FilterList';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Slider from '@material-ui/core/Slider';
import { createMuiTheme,  MuiThemeProvider } from '@material-ui/core/styles';


const useStyles = makeStyles(theme => ({
  toolbarWrapper: {
  },
  appbar:{
    backgroundColor: '#303F9F',
    position: 'static'
  },
  toolbar: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  contentWrapper: {
    width: '100%',
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: "30px",
    paddingLeft: "30px",
  },
  contentWrapperMobile: {
    width: '100%',
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  }, 
  expansionPanel: {
    backgroundColor: "inherit",
    boxShadow: "none",
    width: "inherit"
  },
  expansionPanelSummaryText: {
      margin: "auto",
      color: "#ffffff",
      textAlign: "center"
  },
  filterIcon: {
      color: "#ffffff"
  },
  expansionPanelDetails: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      padding: "0",
      margin: 0,
      width: "100%"
  },
  searchWrapper: {
    borderRadius: 5,
    backgroundColor: fade('#ffffff', 0.15),
    display: "flex",
    flexDirection: "row",
    height: "30px",
    marginTop: "auto",
    marginBottom: "auto"
  },
  searchIconContainer: {
      marginRight: "5px"
  },
  SearchIcon: {
      height: "100%",
      color: "#ffffff"
  },
  inputRoot: {
      color: '#ffffff',
      marginRight: "2px"
  },
  selectRoot: {
    color: 'white',
    textAlign: 'center',
    minWidth: "150px",
    maxWdith: '150px',
    border: "none",
    marginTop: "auto",
    marginBottom: "auto",
    backgroundColor: fade('#ffffff', 0.15),
    border: "none"
  },
  selectMenu: {
    textAlign: "center"
  },
  selectIcon: {
      color: 'white'
  },
  popMenu: {
      backgroundColor: "#303F9F",
      color: "white"
  },
  sliderWrapper: {
    width: '300px'
  },
  sliderWrapperMobile: {
      width: '300px',
      margin: "auto"
  },
  sliderRoot: {
    color: '#FFDE03',
    height: 3,
  },
  sliderThumb: {
    height: 15,
    width: 15,
    backgroundColor: '#FFDE03'
  },
  sliderValueLabel: {
    left: 'calc(-50% + 4px)',
    color: '#ffffff',
  },
  sliderTrack: {
    height: 3,
  },
  sliderRail: {
    color: '#ffffff',
    opacity: 1,
    height: 3,
  },
  sliderMarkLabel: {
    color: "#c2c2c2"
  },
  sliderMarkLabelActive: {
    color: "#ffffff"
  }
}));

// MuiExpansionPanelSummary-root.Mui-focused
const pageTheme = createMuiTheme({
  overrides: {
      // overrides here
      MuiExpansionPanelSummary: { // Fixes Search Bar bug. Maintains blue color on focus
        root: {
          '&$focused': { 
            backgroundColor: '#303F9F'
          },

        },

      },
  },
});

export default function ButtonAppBar(props) {
  const classes = useStyles();

  const isMobile = window.innerWidth < 1200;

  const [pairStatus, setPairStatus] = React.useState(1);

  const [open, setOpen] = React.useState(false);

  const [filterDisplay, setFilterDisplay] = React.useState("Showing All Photos");

  const [expanded, setExpanded] = React.useState(false);
  
  const marks = [
    {
      value: 0,
      label: 'Today',
    },
    {
      value: 1,
      label: '1 Week',
    },
    {
      value: 2,
      label: '1 Month',
    },
    {
      value: 3,
      label: '6 Months',
    },
    {
      value: 4,
      label: '1 Year',
    },
    {
      value: 5,
      label: '1+ Years',
    },
  ];

  const handleSelectChange = event => {

    setPairStatus(event.target.value);

    if(event.target.value == 1){
      setFilterDisplay("Showing All Photos");
    }
    else if(event.target.value == 2){
      setFilterDisplay("Showing Pairs Only");
    }
    else {
      setFilterDisplay("Showing Unpaired Only");
    }

    props.onPairPrefChanged(event.target.value);
  };


  const handleSliderChange = (event, value) => {

    props.onSliderMoved(value);
  
  };


  const handleExpansion = event => {
    setExpanded(!expanded);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  if(isMobile){
    return (
      <MuiThemeProvider theme={pageTheme}>

      
      <div className={classes.toolbarWrapper}>
        <AppBar className={classes.appbar}>
          <Toolbar className={classes.toolbar}>
            <div className = { classes.contentWrapperMobile }>
              <ExpansionPanel classes = {{ root: classes.expansionPanel,}} expanded={expanded}>
                <ExpansionPanelSummary expandIcon={ <FilterListIcon classes = {{ root: classes.filterIcon }} onClick ={handleExpansion}/> }>
                  <div className={classes.searchWrapper}>
                    <div className={classes.searchIconContainer}>
                        <SearchIcon classes={{ root: classes.SearchIcon }}/>
                    </div>
                    <InputBase 
                        placeholder="Search…" 
                        id="satSearch" 
                        classes={{ root: classes.inputRoot }}
                    />
                  </div>
                  <Typography classes = {{ root: classes.expansionPanelSummaryText }} onClick ={handleExpansion}>
                      {filterDisplay}
                  </Typography>
                </ExpansionPanelSummary >
                  <ExpansionPanelDetails classes = {{root: classes.expansionPanelDetails}}>
                    <Select
                      disableUnderline
                      open={open}
                      onClose={handleClose}
                      onOpen={handleOpen}
                      value={pairStatus}
                      onChange={handleSelectChange}
                      variant={'standard'}
                      classes={{
                          root: classes.selectRoot,
                          select: classes.selectSelection,
                          selectMenu: classes.selectMenu,
                          icon: classes.selectIcon
                      }}
                      MenuProps={{
                        classes:  {
                              paper: classes.popMenu
                        }
                      }}
                    >
                      <MenuItem value={1} className={classes.menuItem}>All Photos</MenuItem>
                      <MenuItem value={2}>Pairs Only</MenuItem>
                      <MenuItem value={3}>Unpaired Only</MenuItem>
                    </Select>
                    <div className = {classes.sliderWrapperMobile}>
                      <Slider
                          getAriaLabel={index => (index === 0 ? 'Minimum price' : 'Maximum price')}
                          min={0}
                          max={5}
                          defaultValue={[0, 4]}
                          aria-labelledby="discrete-slider-custom"
                          step={1}
                          marks={marks}
                          onChangeCommitted={handleSliderChange}
                          classes={{
                              root: classes.sliderRoot,
                              thumb: classes.sliderThumb,
                              valueLabel: classes.sliderValueLabel,
                              track: classes.sliderTrack,
                              rail: classes.sliderRail,
                              markLabel: classes.sliderMarkLabel,
                              markLabelActive: classes.sliderMarkLabelActive
                          }}
                      />
                    </div>
                  </ExpansionPanelDetails>
              </ExpansionPanel>
            </div>
          </Toolbar>
        </AppBar>
      </div>
      </MuiThemeProvider>
    );
  }
  else{
    return (
      <div className={classes.toolbarWrapper}>
        <AppBar className={classes.appbar}>
          <Toolbar className={classes.toolbar}>
            <div className = { classes.contentWrapper}>
              <div className={classes.searchWrapper}>
                <div className={classes.searchIconContainer}>
                  <SearchIcon classes={{ root: classes.SearchIcon }}/>
                </div>
                <InputBase 
                  placeholder="Search…" 
                  id="satSearch" 
                  classes={{ root: classes.inputRoot }}
                />
              </div>
              <Select
                disableUnderline
                open={open}
                onClose={handleClose}
                onOpen={handleOpen}
                value={pairStatus}
                onChange={handleSelectChange}
                variant={'standard'}
                classes={{
                    root: classes.selectRoot,
                    select: classes.selectSelection,
                    selectMenu: classes.selectMenu,
                    icon: classes.selectIcon
                }}
                MenuProps={{
                  classes:  {
                        paper: classes.popMenu
                  }
                }}
              >
                <MenuItem value={1} className={classes.selectMenuItem}>All Photos</MenuItem>
                <MenuItem value={2}>Pairs Only</MenuItem>
                <MenuItem value={3}>Unpaired Only</MenuItem>
              </Select>
              <div className = {classes.sliderWrapper}>
                <Slider
                  getAriaLabel={index => (index === 0 ? 'Minimum price' : 'Maximum price')}
                  min={0}
                  max={5}
                  defaultValue={[0, 4]}
                  aria-labelledby="discrete-slider-custom"
                  step={1}
                  marks={marks}
                  onChangeCommitted={handleSliderChange}
                  classes={{
                    root: classes.sliderRoot,
                    thumb: classes.sliderThumb,
                    valueLabel: classes.sliderValueLabel,
                    track: classes.sliderTrack,
                    rail: classes.sliderRail,
                    markLabel: classes.sliderMarkLabel,
                    markLabelActive: classes.sliderMarkLabelActive
                  }}
                />
              </div>
            </div>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}