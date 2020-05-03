import React, { useState, useEffect, useRef } from 'react';
import { makeStyles, useTheme, MuiThemeProvider } from '@material-ui/core/styles';
import MobileStepper from '@material-ui/core/MobileStepper';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import SwipeableViews from 'react-swipeable-views';
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from 'axios';

import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";

const useStyles = makeStyles(theme => ({
    modalWrapper:{
        position: "fixed",
        zIndex: 9999,
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, .8)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    },
    root: {
        maxHeight: 700,
        maxWidth: 700,
        height: 525,
        width: 542, 
        backgroundColor: "black",
        right: 5,
        left: 5,
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: "center",
        height: 50,
        paddingLeft: theme.spacing(4),
        paddingRight: theme.spacing(4),
        backgroundColor: theme.palette.background.default,
    },
    photoInfoPaper: {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: theme.palette.background.default,
    },
    photoInfoDiv: {
        display: "flex",
        alignItems: 'center',
        justifyContent: "space-between",
        height: 50,
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
    },
    imgContainer: { 
        display: "flex", 
        height: 325, 
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        objectFit: 'contain',
    },
    img: {
        maxHeight: "100%",
        maxWidth: "100%",
        // height: 'inherit',
        // width: 'inherit',
    },
    button: { 
        borderRadius: 0, 
        height: 50,
    }
}));

function SwipeableTextMobileStepper(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);

    var picArray = [
        {
            source: props.postSource,
            imgPath: props.postImage,
        },
        {
            source: props.preSource,
            imgPath: props.preImage,
        }
    ];

    if(props.isPaired == false){
        picArray = [
            {
            source: props.postSource,
            imgPath: props.postImage,
            }
        ]
    };

    const maxSteps = picArray.length;

    const modalWrapper = useRef();

    var step1, step2 = ["", "", ""];

    if(props.date){
        var step1 = props.date.split("T");
        var step2 = step1[0].split("-")
    }

    useEffect(() => {
        // add when mounted
        document.addEventListener("mousedown", handleClick);
        // return function to be called when unmounted
        return () => {
        document.removeEventListener("mousedown", handleClick);
        };
    }, []);

    const handleClick = e => {
        if (modalWrapper.current){
            if(modalWrapper.current.contains(e.target)){
                // inside click
                return;
            }
            // outside click 
            onClose();
        }
    };

    const onClose = e => {
        setActiveStep(0);
        props.onClose && props.onClose(e);
    };

    const handleNext = () => {
        setActiveStep(prevActiveStep => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep(prevActiveStep => prevActiveStep - 1);
    };

    const handleStepChange = step => {
        setActiveStep(step);
    };

    const onPairImageClick = () => {
        props.onAddingLocation();
    }


    const bottomContent = () => {
        if(props.isPaired == "False"){
            return(
                    <Paper square elevation={0} className={classes.photoInfoPaper}>
                        <Button variant="contained" color="primary" className={classes.button} onClick={onPairImageClick}>
                            Pair This Image
                        </Button>
                    </Paper>
            );
        }
        else {
            if(props.preSource == "Google Maps"){
                return(
                    <Paper square elevation={0} className={classes.photoInfoPaper}>
                        <Button variant="contained" color="primary" className={classes.button} onClick={()=> window.open(props.mapsLink, "_blank")}>
                            See this on Google Streetview
                        </Button>
                    </Paper>
                );
            }
            else {
                return (
                    <MobileStepper
                            steps={maxSteps}
                            position="static"
                            variant="dots"
                            activeStep={activeStep}
                            nextButton={
                                <Button size="small" onClick={handleNext} disabled={activeStep === maxSteps - 1}>
                                    {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                                </Button>
                            }
                            backButton={
                                <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                                    {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                                </Button>
                            }
                        />
                );
            }
        }
    }

    const imageLoading = (image, label) => {
        if(props.loading){
            return(
                <CircularProgress/>
            );
        }
        else {
            return (
                <img className={classes.img} src={image} alt={label} />
            ); 
        }
    }


    if(!props.show){
        return null;
    }
    else{
        return (
            <div className ={classes.modalWrapper}  >
                <div className={classes.root} ref={modalWrapper}>
                    <Paper square elevation={0} className={classes.header}>
                        <Typography>{props.address}</Typography>
                    </Paper>
                    <SwipeableViews
                        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                        index={activeStep}
                        onChangeIndex={handleStepChange}
                        enableMouseEvents
                    >
                        {picArray.map((step, index) => (
                        <div key={step.label}  className={classes.imgContainer}>
                            {Math.abs(activeStep - index) <= 2 ? (
                                imageLoading(step.imgPath, step.label)
                            ) : null}
                        </div>
                        ))}
                    </SwipeableViews>
                    <Paper square elevation={0} className={classes.photoInfoPaper}>
                        <div className={classes.photoInfoDiv}>
                            <Typography>{activeStep === 0 ? "Post-Flood Image" : "Pre-Flood Image" }</Typography>
                            <Typography>Date: {step2[1] + "/" + step2[2] + "/" + step2[0]}</Typography> 
                        </div>
                        <div className={classes.photoInfoDiv}>
                            <Typography>
                                Flood Height: {props.height == null ? "n/a" : props.height}
                            </Typography>
                            <Typography>Source: {picArray[activeStep].source}</Typography>
                        </div>
                    </Paper>
                   {bottomContent()}
                </div>
            </div>
        );
    }
}

export default SwipeableTextMobileStepper;