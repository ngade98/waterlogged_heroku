import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';

const useStyles = makeStyles(theme => ({
    sliderWrapper: {
        width: '300px'
    },
    sliderWrapperMobile: {
        width: '300px',
        margin: "auto"
    },
    root: {
      color: '#FFDE03',
      height: 3,
    },
    thumb: {
      height: 15,
      width: 15,
      backgroundColor: '#FFDE03'
    },
    valueLabel: {
      left: 'calc(-50% + 4px)',
      color: '#ffffff',
    },
    track: {
      height: 3,
    },
    rail: {
      color: '#ffffff',
      opacity: 1,
      height: 3,
    },
    markLabel: {
      color: "#c2c2c2"
    },
    markLabelActive: {
      color: "#ffffff"
    }
}));
    
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


export default function TimeSlider(props) {

    const classes = useStyles();

    const isMobile = window.innerWidth < 1200;

    if(isMobile){
        return (
            <div className = {classes.sliderWrapperMobile}>
                <Slider
                    getAriaLabel={index => (index === 0 ? 'Minimum price' : 'Maximum price')}
                    min={0}
                    max={5}
                    defaultValue={[0, 4]}
                    aria-labelledby="discrete-slider-custom"
                    step={1}
                    marks={marks}
                    classes={{
                        root: classes.root,
                        thumb: classes.thumb,
                        valueLabel: classes.valueLabel,
                        track: classes.track,
                        rail: classes.rail,
                        markLabel: classes.markLabel,
                        markLabelActive: classes.markLabelActive
                    }}
                />
            </div>
        );
    }
    else {
        return (
            <div className = {classes.sliderWrapper}>
                <Slider
                    getAriaLabel={index => (index === 0 ? 'Minimum price' : 'Maximum price')}
                    min={0}
                    max={5}
                    defaultValue={[0, 4]}
                    aria-labelledby="discrete-slider-custom"
                    step={1}
                    marks={marks}
                    classes={{
                        root: classes.root,
                        thumb: classes.thumb,
                        valueLabel: classes.valueLabel,
                        track: classes.track,
                        rail: classes.rail,
                        markLabel: classes.markLabel,
                        markLabelActive: classes.markLabelActive
                    }}
                />
            </div>
        );
    }
}