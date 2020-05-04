import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import FilterListIcon from '@material-ui/icons/FilterList';

import TimeSlider from './TimeSlider';
import PhotoTypeSelector from './photoTypeSelector';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import SearchBar from './SearchBar';


const useStyles = makeStyles(theme => ({
    wrapper: {
        width: '100%',
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingRight: "30px",
        paddingLeft: "30px",
    },
    wrapperMobile: {
        width: '100%',
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between"
    },
    root: {
        backgroundColor: "inherit",
        boxShadow: "none",
        width: "inherit"
    },
    summaryText: {
        margin: "auto",
        color: "#ffffff",
        textAlign: "center"
    },
    icon: {
        color: "#ffffff"
    },
    panelDetails: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0",
        margin: 0,
        width: "100%"
    },
    mobileSliderWrapper: {
        width: "300px",
        margin: "auto"
    }
    
}));

export default function SimpleExpansionPanel() {
    
    const classes = useStyles();
        const displayValue = "All Photos";
        const isMobile = window.innerWidth < 1200;

    if(isMobile){
        return (
            <div className = { classes.wrapperMobile }>
              <ExpansionPanel classes = {{ root: classes.root }}>
                <ExpansionPanelSummary expandIcon={ <FilterListIcon classes = {{ root: classes.icon }}/> }>
                    <SearchBar/>
                    <Typography classes = {{ root: classes.summaryText }}>
                        {displayValue}
                    </Typography>
                </ExpansionPanelSummary>
                    <ExpansionPanelDetails classes = {{root: classes.panelDetails}}>
                        <PhotoTypeSelector/>
                        <TimeSlider />
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            </div>
        );
    }
    else {
        return(
            <div className = { classes.wrapper }>
                <SearchBar/>
                <PhotoTypeSelector/>
                <TimeSlider/>
            </div>
        );
    }
};