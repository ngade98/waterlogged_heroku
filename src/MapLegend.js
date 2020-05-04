import React from 'react';
import {makeStyles } from '@material-ui/core/styles';
import RoomIcon from '@material-ui/icons/Room';
        
const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: '#fff',
        border: '2px solid #fff',
        borderRadius: '10px',
        boxShadow: '0 2px 6px rgba(0,0,0,.3)',
        minWidth: '50px',
        maxWidth: '50px',
        maxHeight: 160,
        minHeight: 160,
        display: "block",
        fontFamily: 'Roboto,Arial,sans-serif',
        margin: "7px"
    },
    legendEntry: {
        minWidth: "100%",
        height: 75, 
        display: "flex",
        flexDirection: "column",
        justifyContent: 'center',
        alignItems: 'center'
    },
    entryIcon: {
        display: "flex",
        paddingTop: 10, 
        fontSize: 35,
    },
    entryLabel: {
        display: "flex",
        textAlign: "center"
    },
    entryText: {
        display: "flex",
        marginTop: 5,
    },
    dividerDiv: {
        display: "block"
    },
    divider: {
        margin: "auto"
    }
}));
       
export default function MapLegend() {
    
    const classes = useStyles();
    
    return(
        <div className={classes.root} id={"legend"}>
            <div className={classes.legendEntry}>
                <RoomIcon className = {classes.entryIcon} style={{color: "#72B5E6"}}/>
                <div className = {classes.entryLabel}>
                    <p className = {classes.entryText}>
                        Paired
                    </p>
                </div>
            </div>
            <div className = {classes.dividerDiv}>
                <hr className = {classes.divider}></hr>
            </div>
            <div className={classes.legendEntry}>
                <RoomIcon className = {classes.entryIcon} style={{color: "#FFDE03"}}/>
                <div className = {classes.entryLabel}>
                    <p className = {classes.entryText}>
                        Needs Pairing
                    </p>
                </div>
            </div>
        </div>
    );
}